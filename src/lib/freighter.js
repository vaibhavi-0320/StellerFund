import {
  getPublicKey,
  isAllowed,
  isConnected,
  requestAccess,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';
import * as StellarSdk from 'stellar-sdk';

export const CONTRACT_ID = 'CBMWJRPO32QCOEAUJQHGRCDEJVNIFJALUUWD7KDCBLIUOSMN35Y7MRKF';
export const NETWORK = 'TESTNET';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

const STROOPS_PER_XLM = 10000000n;
const MAX_U32 = 4294967295n;

function rpcServer() {
  return new StellarSdk.SorobanRpc.Server(RPC_URL);
}

export function txExplorerUrl(hash) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function contractExplorerUrl() {
  return `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;
}

function parseFreighterXdr(response) {
  if (typeof response === 'string') {
    const trimmed = response.trim();

    // Some Freighter versions/providers return a JSON string payload
    // instead of a raw base64 XDR string.
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseFreighterXdr(parsed);
      } catch {
        // fall through to treat as raw string
      }
    }

    // Sometimes the response is a quoted base64 string.
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1).trim();
    }

    return trimmed;
  }
  if (response && typeof response === 'object') {
    if (typeof response.error === 'string' && response.error) {
      throw new Error(response.error);
    }
    if (typeof response.signedTxXdr === 'string') return response.signedTxXdr.trim();
    if (typeof response.signedTransaction === 'string') return response.signedTransaction.trim();
    if (typeof response.xdr === 'string') return response.xdr.trim();
  }
  throw new Error(`Unexpected Freighter signTransaction response: ${JSON.stringify(response)}`);
}

function decodeResultXdr(resultXdr) {
  try {
    return resultXdr?.toXDR?.('base64') ?? null;
  } catch {
    return null;
  }
}

function mapContractError(rawText) {
  const text = String(rawText || '').toLowerCase();
  if (text.includes('error(contract, #1)')) return 'EscrowNotFound';
  if (text.includes('error(contract, #2)')) return 'UnauthorizedClient';
  if (text.includes('error(contract, #3)')) return 'AlreadyCompleted';
  return 'UnknownError';
}

function parseAmountToI128(amountText) {
  const normalized = String(amountText || '').trim();
  if (!/^\d+(\.\d{0,7})?$/.test(normalized)) {
    throw new Error('Amount must be a valid positive XLM value with up to 7 decimals.');
  }

  const [whole, frac = ''] = normalized.split('.');
  const wholeBig = BigInt(whole || '0');
  const fracBig = BigInt((frac + '0000000').slice(0, 7));
  const stroops = wholeBig * STROOPS_PER_XLM + fracBig;

  if (stroops <= 0n) {
    throw new Error('Amount must be greater than 0.');
  }
  return stroops;
}

function parseU32(idText) {
  const raw = String(idText || '').trim();
  if (!/^\d+$/.test(raw)) throw new Error('Escrow ID must be a positive integer.');
  const idBig = BigInt(raw);
  if (idBig === 0n || idBig > MAX_U32) throw new Error('Escrow ID must fit u32 range.');
  return Number(idBig);
}

async function signPreparedTransaction(preparedTxXdrBase64, accountToSign) {
  try {
    const response = await freighterSignTransaction(preparedTxXdrBase64, {
      network: NETWORK,
      networkPassphrase: NETWORK_PASSPHRASE,
      accountToSign,
    });
    return parseFreighterXdr(response);
  } catch (err) {
    if (window.freighterApi?.signTransaction) {
      const response = await window.freighterApi.signTransaction(preparedTxXdrBase64, {
        network: NETWORK,
        networkPassphrase: NETWORK_PASSPHRASE,
        accountToSign,
      });
      return parseFreighterXdr(response);
    }
    throw err;
  }
}

async function waitForFinalTx(hash, maxAttempts = 30) {
  const server = rpcServer();
  for (let i = 0; i < maxAttempts; i += 1) {
    const tx = await server.getTransaction(hash);
    if (tx.status === 'SUCCESS' || tx.status === 'FAILED') return tx;
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return null;
}

async function invokeWrite({ sourceAddress, operation }) {
  const server = rpcServer();
  const account = await server.getAccount(sourceAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const preparedXdr = prepared.toXDR('base64');
  const signedXdr = await signPreparedTransaction(preparedXdr, sourceAddress);
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const send = await server.sendTransaction(signedTx);

  if (!send?.hash) {
    throw new Error(`RPC response missing transaction hash: ${JSON.stringify(send)}`);
  }
  if (send.status === 'ERROR') {
    const code = mapContractError(JSON.stringify(send));
    const msg = code === 'UnknownError' ? 'Transaction rejected before submission.' : code;
    return { status: 'failed', txHash: send.hash, errorType: code, message: msg, raw: send };
  }

  const finalTx = await waitForFinalTx(send.hash);
  if (!finalTx) {
    return {
      status: 'pending_timeout',
      txHash: send.hash,
      message: 'Transaction submitted, still pending confirmation.',
    };
  }

  if (finalTx.status === 'FAILED') {
    const raw = JSON.stringify(finalTx);
    const code = mapContractError(raw);
    return {
      status: 'failed',
      txHash: send.hash,
      errorType: code,
      message: code === 'UnknownError' ? 'Transaction failed on-chain.' : code,
      raw: finalTx,
      resultXdr: decodeResultXdr(finalTx.resultXdr),
    };
  }

  return {
    status: 'success',
    txHash: send.hash,
    returnValue: finalTx.returnValue ? StellarSdk.scValToNative(finalTx.returnValue) : null,
    resultXdr: decodeResultXdr(finalTx.resultXdr),
  };
}

export async function connectFreighter() {
  const connected = await isConnected();
  if (!connected) {
    throw new Error('Freighter extension not detected. Install/enable Freighter.');
  }

  const allowed = await isAllowed();
  if (!allowed) {
    const pk = await requestAccess();
    if (!pk) throw new Error('Freighter access not granted.');
    return pk;
  }

  const pk = await getPublicKey();
  if (!pk) throw new Error('Unable to read public key from Freighter.');
  return pk;
}

export async function getXlmBalance(address) {
  const response = await fetch(`${HORIZON_URL}/accounts/${address}`);
  if (!response.ok) throw new Error(`Failed to load balance: ${response.status}`);
  const data = await response.json();
  const native = data.balances?.find((b) => b.asset_type === 'native');
  return native?.balance ?? '0.0000000';
}

export async function createEscrow({ clientAddress, freelancerAddress, amountText }) {
  const amountI128 = parseAmountToI128(amountText);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const operation = contract.call(
    'create_escrow',
    new StellarSdk.Address(clientAddress).toScVal(),
    new StellarSdk.Address(freelancerAddress).toScVal(),
    StellarSdk.nativeToScVal(amountI128, { type: 'i128' }),
  );

  const result = await invokeWrite({ sourceAddress: clientAddress, operation });
  if (result.status === 'success') {
    return {
      ...result,
      escrowId: Number(result.returnValue),
      txUrl: txExplorerUrl(result.txHash),
    };
  }
  return { ...result, txUrl: result.txHash ? txExplorerUrl(result.txHash) : null };
}

export async function releaseEscrow({ clientAddress, escrowId }) {
  const id = parseU32(escrowId);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const operation = contract.call(
    'release',
    new StellarSdk.Address(clientAddress).toScVal(),
    StellarSdk.nativeToScVal(id, { type: 'u32' }),
  );

  const result = await invokeWrite({ sourceAddress: clientAddress, operation });
  return { ...result, txUrl: result.txHash ? txExplorerUrl(result.txHash) : null };
}

export async function refundEscrow({ clientAddress, escrowId }) {
  const id = parseU32(escrowId);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const operation = contract.call(
    'refund',
    new StellarSdk.Address(clientAddress).toScVal(),
    StellarSdk.nativeToScVal(id, { type: 'u32' }),
  );

  const result = await invokeWrite({ sourceAddress: clientAddress, operation });
  return { ...result, txUrl: result.txHash ? txExplorerUrl(result.txHash) : null };
}

export async function getEscrow({ sourceAddress, escrowId }) {
  const id = parseU32(escrowId);
  const server = rpcServer();
  const account = await server.getAccount(sourceAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_escrow', StellarSdk.nativeToScVal(id, { type: 'u32' })))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (sim.error) {
    const code = mapContractError(sim.error);
    return {
      status: 'failed',
      errorType: code,
      message: code === 'UnknownError' ? sim.error : code,
      escrow: null,
    };
  }

  const value = StellarSdk.scValToNative(sim.result.retval);
  return {
    status: 'success',
    escrow: {
      id,
      client: String(value.client),
      freelancer: String(value.freelancer),
      amount: String(value.amount),
      amountXlm: (Number(value.amount) / 10000000).toFixed(7),
      status:
        typeof value.status === 'string'
          ? value.status
          : Object.keys(value.status || {})[0] || 'Pending',
    },
  };
}
