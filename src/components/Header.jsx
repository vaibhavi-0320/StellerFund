export default function Header({ connected, address, onConnect }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="https://stellar.org/wp-content/uploads/2023/01/stellar-logo.svg" 
            alt="Stellar" 
            className="h-8"
          />
          <h1 className="text-2xl font-bold">StellarFund</h1>
        </div>
        
        <button
          onClick={onConnect}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            connected
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {connected ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
