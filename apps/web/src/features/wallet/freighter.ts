import { signTransaction, setAllowed, getAddress } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import { HORIZON_URL, NETWORK_PASSPHRASE } from '@/lib/config';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export const checkConnection = async () => {
  return await setAllowed();
};

export const retrievePublicKey = async () => {
  const { address } = await getAddress();
  return address;
};

export const getBalance = async () => {
  await setAllowed();
  const { address } = await getAddress();
  const account = await server.loadAccount(address);
  const xlm = account.balances.find(
    (b: StellarSdk.Horizon.HorizonApi.BalanceLine) => b.asset_type === 'native'
  );
  return xlm?.balance || '0';
};

export const userSignTransaction = async (xdr: string, network: string, signWith: string) => {
  const { signedTxXdr } = await signTransaction(xdr, { networkPassphrase: network, address: signWith });
  return signedTxXdr;
};

export const sendXLM = async (fromPublicKey: string, destination: string, amount: string) => {
  try {
    const account = await server.loadAccount(fromPublicKey);
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(30)
      .build();

    const xdr = transaction.toXDR();
    const signedXdr = await userSignTransaction(xdr, NETWORK_PASSPHRASE, fromPublicKey);
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const result = await server.submitTransaction(signedTx);
    return { success: true, txHash: result.hash };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Transaction failed',
    };
  }
};

export const shortenAddress = (address: string) => {
  if (!address) return '';
  return address.slice(0, 4) + '...' + address.slice(-4);
};
