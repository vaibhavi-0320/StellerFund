import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import {
  CONTRACT_ID,
  NATIVE_ASSET_CONTRACT_ID,
  NETWORK_PASSPHRASE,
  SOROBAN_RPC_URL,
} from './config';

const STROOPS_PER_XLM = 10_000_000n;
const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

type ContractCallResult<T = undefined> = {
  success: boolean;
  hash: string;
  error?: string;
  value?: T;
};

type EscrowRecord = {
  id: number;
  client: string;
  freelancer: string;
  token: string;
  amount: string;
  status: string;
};

function getResultCode(result?: StellarSdk.xdr.TransactionResult | null): string | null {
  if (!result) {
    return null;
  }

  try {
    const code = result.result().switch();
    if (typeof code === 'string') {
      return code;
    }

    if (typeof code?.name === 'string') {
      return code.name;
    }

    return String(code);
  } catch {
    return null;
  }
}

function describeSendFailure(response: StellarSdk.rpc.Api.SendTransactionResponse): string {
  const resultCode = 'errorResult' in response ? getResultCode(response.errorResult) : null;
  return [response.status, resultCode].filter(Boolean).join(': ');
}

function normalizeError(error: string, method: string) {
  if (error.includes('txBAD_AUTH')) {
    return 'Transaction failed. Freighter did not provide the required authorization. Reconnect the wallet and sign again.';
  }

  if (error.includes('txINSUFFICIENT_BALANCE')) {
    return 'Transaction failed. The wallet does not have enough XLM to cover the escrow amount and fees.';
  }

  if (error.includes('txSOROBAN_INVALID')) {
    return 'Transaction failed. The simulated contract call became invalid at submission time. Refresh and try again.';
  }

  if (error.includes('Bad union switch: 4')) {
    return 'Transaction failed. Please check wallet balance or contract state.';
  }

  if (error.includes('HostError: Error(Contract, #4)') || error.includes('Error(Contract, #4)')) {
    return method === 'create_escrow'
      ? 'Transaction failed. Amount must be greater than zero.'
      : 'Transaction failed. Please check wallet balance or contract state.';
  }

  if (error.includes('HostError: Error(Contract, #3)') || error.includes('Error(Contract, #3)')) {
    return 'Transaction failed. This escrow is already completed or refunded.';
  }

  if (error.includes('HostError: Error(Contract, #2)') || error.includes('Error(Contract, #2)')) {
    return 'Transaction failed. Your wallet is not authorized for this action.';
  }

  if (error.includes('HostError: Error(Contract, #1)') || error.includes('Error(Contract, #1)')) {
    return 'Transaction failed. Escrow not found.';
  }

  if (error.includes('non-existent contract function') || error.includes('MissingValue')) {
    return `Contract function "${method}" not found. Redeploy the contract and update CONTRACT_ID in apps/web/src/lib/config.ts.`;
  }

  if (error.includes('insufficient balance')) {
    return 'Transaction failed. Please check wallet balance or contract state.';
  }

  return error;
}

function scValToNumber(value: StellarSdk.xdr.ScVal): number {
  const native = StellarSdk.scValToNative(value);
  return Number(typeof native === 'bigint' ? native : BigInt(native));
}

function formatAmount(stroopsLike: unknown): string {
  const stroops = typeof stroopsLike === 'bigint' ? stroopsLike : BigInt(String(stroopsLike ?? 0));
  return (Number(stroops) / Number(STROOPS_PER_XLM)).toFixed(2);
}

function serializeForLog(value: unknown) {
  return JSON.stringify(value, (_key, currentValue) =>
    typeof currentValue === 'bigint' ? currentValue.toString() : currentValue
  );
}

function isPendingTransactionStatus(status: StellarSdk.rpc.Api.GetTransactionStatus): boolean {
  return (
    status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND ||
    status === StellarSdk.rpc.Api.GetTransactionStatus.PENDING
  );
}

async function invokeContract<T = undefined>(
  method: string,
  args: StellarSdk.xdr.ScVal[],
  publicKey: string,
  parseValue?: (value: StellarSdk.xdr.ScVal) => T
): Promise<ContractCallResult<T>> {
  try {
    const account = await server.getAccount(publicKey);
    const contract = new StellarSdk.Contract(CONTRACT_ID);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
      const error = normalizeError((simulated as { error?: string }).error || 'Simulation failed', method);
      console.error(`[StellarFund] ${method} simulation failed:`, simulated);
      return { success: false, hash: '', error };
    }

    const simulatedResult = simulated.result?.retval;
    const value = simulatedResult && parseValue ? parseValue(simulatedResult) : undefined;
    const prepared = await server.prepareTransaction(tx);

    const { signedTxXdr, error: signError } = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: publicKey,
    });

    if (signError || !signedTxXdr) {
      return {
        success: false,
        hash: '',
        error: normalizeError(
          signError || 'Transaction failed. Freighter did not return a signed transaction.',
          method
        ),
      };
    }

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
    const sendResult = await server.sendTransaction(signedTx as StellarSdk.Transaction);

    if (sendResult.status === 'ERROR') {
      console.error(`[StellarFund] ${method} submission failed:`, sendResult);
      return {
        success: false,
        hash: '',
        error: normalizeError(
          `Transaction submission failed (${describeSendFailure(sendResult)})`,
          method
        ),
      };
    }

    let txHash = sendResult.hash;
    if (sendResult.status === 'PENDING') {
      let txResponse = await server.getTransaction(sendResult.hash);
      let waited = 0;

      while (isPendingTransactionStatus(txResponse.status) && waited < 30) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txResponse = await server.getTransaction(sendResult.hash);
        waited += 1;
      }

      if (txResponse.status !== StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
        console.error(`[StellarFund] ${method} transaction failed:`, txResponse);
        const resultCode = 'resultXdr' in txResponse ? getResultCode(txResponse.resultXdr) : null;
        return {
          success: false,
          hash: sendResult.hash,
          error: normalizeError(
            `Transaction failed with status: ${txResponse.status}${resultCode ? ` (${resultCode})` : ''}`,
            method
          ),
        };
      }

      txHash = txResponse.txHash ?? sendResult.hash;
    }

    return { success: true, hash: txHash, value };
  } catch (err) {
    const message = err instanceof Error
      ? normalizeError(err.message, method)
      : 'Transaction failed. Please check wallet balance or contract state.';
    console.error(`[StellarFund] ${method} threw:`, err);
    return { success: false, hash: '', error: message };
  }
}

export async function createEscrow(
  publicKey: string,
  freelancerAddress: string,
  amount: number
): Promise<ContractCallResult<number>> {
  const stroops = BigInt(Math.round(amount * Number(STROOPS_PER_XLM)));
  const args = [
    new StellarSdk.Address(publicKey).toScVal(),
    new StellarSdk.Address(freelancerAddress).toScVal(),
    new StellarSdk.Address(NATIVE_ASSET_CONTRACT_ID).toScVal(),
    StellarSdk.nativeToScVal(stroops, { type: 'i128' }),
  ];

  return invokeContract('create_escrow', args, publicKey, scValToNumber);
}

export async function releasePayment(publicKey: string, escrowId: number) {
  const args = [
    StellarSdk.nativeToScVal(BigInt(escrowId), { type: 'u64' }),
    new StellarSdk.Address(publicKey).toScVal(),
  ];

  return invokeContract('release_payment', args, publicKey);
}

export async function refundEscrow(publicKey: string, escrowId: number) {
  const args = [
    StellarSdk.nativeToScVal(BigInt(escrowId), { type: 'u64' }),
    new StellarSdk.Address(publicKey).toScVal(),
  ];

  return invokeContract('refund', args, publicKey);
}

export async function getEscrowDetails(
  escrowId: number,
  callerPublicKey?: string
): Promise<{ success: boolean; data?: EscrowRecord; error?: string }> {
  try {
    const lookupKey =
      callerPublicKey || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7';
    const account = await server.getAccount(lookupKey);
    const contract = new StellarSdk.Contract(CONTRACT_ID);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('get_escrow', StellarSdk.nativeToScVal(BigInt(escrowId), { type: 'u64' })))
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
      return {
        success: false,
        error: normalizeError((simulated as { error?: string }).error || 'Escrow not found', 'get_escrow'),
      };
    }

    if (!simulated.result?.retval) {
      return { success: false, error: 'No result returned' };
    }

    const resultVal = simulated.result.retval;

    try {
      const native = StellarSdk.scValToNative(resultVal) as {
        id?: bigint | number | string;
        client?: unknown;
        freelancer?: unknown;
        token?: unknown;
        amount?: bigint | number | string;
        status?: unknown;
      };

      console.log('[StellarFund] Raw escrow data:', serializeForLog(native));

      let status = 'Unknown';
      if (typeof native.status === 'string') {
        status = native.status;
      } else if (Array.isArray(native.status) && native.status.length > 0) {
        status = String(native.status[0]);
      } else if (native.status !== undefined) {
        status = serializeForLog(native.status) ?? String(native.status);
      }

      return {
        success: true,
        data: {
          id: Number(BigInt(String(native.id ?? 0))),
          client: typeof native.client === 'string' ? native.client : String(native.client ?? 'Unknown'),
          freelancer:
            typeof native.freelancer === 'string'
              ? native.freelancer
              : String(native.freelancer ?? 'Unknown'),
          token: typeof native.token === 'string' ? native.token : String(native.token ?? 'Unknown'),
          amount: native.amount !== undefined ? formatAmount(native.amount) : '0',
          status,
        },
      };
    } catch (parseErr) {
      console.error('[StellarFund] Failed to parse escrow result:', parseErr);
      console.error('[StellarFund] Raw retval XDR:', resultVal.toXDR('base64'));
      return {
        success: false,
        error: `Failed to parse escrow data: ${
          parseErr instanceof Error ? parseErr.message : 'Unknown parse error'
        }`,
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch escrow';
    console.error('[StellarFund] get_escrow threw:', err);
    return { success: false, error: message };
  }
}
