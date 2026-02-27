import { useState } from 'react';
import { sendPayment, getAccountBalance } from '../lib/freighter';

export default function SendXLM({ address, balance, onBalanceUpdate }) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setTxHash('');
    setError('');

    try {
      const result = await sendPayment(address, destination, amount);
      
      setTxHash(result.hash);
      setDestination('');
      setAmount('');
      
      setTimeout(async () => {
        if (onBalanceUpdate) {
          const newBal = await getAccountBalance(address);
          onBalanceUpdate(newBal);
        }
      }, 2000);
    } catch (err) {
      setError('Transaction failed: ' + (err.message || 'Unknown error'));
    }

    setLoading(false);
  };

  if (!address) {
    return (
      <div className="send-container">
        <p className="info-text">Please connect your wallet first to send XLM</p>
      </div>
    );
  }

  return (
    <div className="send-container">
      <div className="account-info">
        <p className="account-address">{address.slice(0, 4)}...{address.slice(-4)}</p>
        <p className="account-balance">Balance: {parseFloat(balance).toFixed(2)} XLM</p>
      </div>

      <h2>Send XLM</h2>

      <form onSubmit={handleSend}>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination Address"
          className="input-field"
          required
        />

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="input-field"
          required
        />

        <button type="submit" disabled={loading} className="send-btn">
          {loading ? 'Sending...' : 'Send XLM'}
        </button>
      </form>

      {txHash && (
        <div className="success-box">
          <p>Transaction Successful!</p>
          <p className="tx-hash">Hash: {txHash.slice(0, 16)}...</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View on Stellar Expert →
          </a>
        </div>
      )}

      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
