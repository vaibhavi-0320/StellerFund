import { useState } from 'react';
import { connectFreighter, getAccountBalance } from '../lib/freighter';

export default function Header({ onConnect, onDisconnect }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    
    try {
      const pubKey = await connectFreighter();
      setAddress(pubKey);
      
      const bal = await getAccountBalance(pubKey);
      setBalance(bal);
      
      setConnected(true);
      
      if (onConnect) {
        onConnect(pubKey, bal);
      }
    } catch (error) {
      if (error.message === 'NOT_INSTALLED') {
        alert('Please install Freighter wallet extension!');
      } else {
        alert('Connection failed. Make sure Freighter is unlocked.');
      }
    }
    
    setLoading(false);
  };

  const handleDisconnect = () => {
    setAddress('');
    setBalance('');
    setConnected(false);
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <header className="header">
      <h1 className="title">StellarFund</h1>
      
      {!connected ? (
        <button 
          onClick={handleConnect} 
          disabled={loading}
          className="connect-btn"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="info-box">
            {address.slice(0, 4)}...{address.slice(-4)}
          </div>
          <div className="info-box">
            Balance: {parseFloat(balance).toFixed(2)} XLM
          </div>
          <button 
            onClick={handleDisconnect} 
            className="connected-btn"
          >
            Connected
          </button>
        </div>
      )}
    </header>
  );
}
