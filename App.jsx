import { useState } from 'react';
import Header from './components/Header';
import SendXLM from './components/SendXLM';
import './App.css';

export default function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const handleConnect = (pubKey, bal) => {
    setAddress(pubKey);
    setBalance(bal);
  };

  const handleDisconnect = () => {
    setAddress('');
    setBalance('');
  };

  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <div className="app">
      <Header 
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <main>
        <SendXLM 
          address={address}
          balance={balance}
          onBalanceUpdate={handleBalanceUpdate}
        />
      </main>
    </div>
  );
}
