import { useState } from "react";
import { checkConnection, retrievePublicKey, getBalance, shortenAddress } from "./freighter";
import { SendXLM } from "./SendXLM";
import { EscrowDashboard } from "./EscrowDashboard";
import stellarLogo from "@/assets/stellar-fund-logo.svg";

export default function Header() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0");
  const [activeTab, setActiveTab] = useState<"send" | "escrow">("escrow");

  const connectWallet = async () => {
    try {
      const allowed = await checkConnection();
      if (!allowed) return alert("Permission denied");
      const key = await retrievePublicKey();
      const bal = await getBalance();
      setPublicKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0");
  };

  const refreshBalance = async () => {
    const bal = await getBalance();
    setBalance(Number(bal).toFixed(2));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={stellarLogo} alt="StellarFund logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold text-primary">StellarFund</span>
        </div>
        {connected ? (
          <button
            onClick={disconnect}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            {shortenAddress(publicKey)}
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            Connect Wallet
          </button>
        )}
      </nav>

      {!connected && (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Powered by Stellar Network
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Escrow
            <br />
            <span className="text-primary italic">on Stellar</span>
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
            Experience the future of decentralized trust with high-impact security,
            purplish precision, and seamless cross-border transactions.
          </p>
          <button
            onClick={connectWallet}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-sm mb-3"
          >
            Get Started
          </button>
          <a
            href="https://soroban.stellar.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline text-xs"
          >
            View Docs
          </a>
        </div>
      )}

      {connected && publicKey && (
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="bg-card border border-border rounded-xl p-5 mb-6 text-center">
            <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
            <p className="text-3xl font-bold text-primary">
              {balance} <span className="text-base text-muted-foreground">XLM</span>
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("escrow")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "escrow"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Escrow
            </button>
            <button
              onClick={() => setActiveTab("send")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "send"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Send XLM
            </button>
          </div>

          {activeTab === "send" && (
            <SendXLM fromPublicKey={publicKey} onSuccess={refreshBalance} />
          )}

          {activeTab === "escrow" && (
            <EscrowDashboard publicKey={publicKey} />
          )}
        </div>
      )}

      <footer className="border-t border-border py-6 mt-12 text-center text-xs text-muted-foreground">
        <div className="mb-2 flex items-center justify-center gap-2">
          <img src={stellarLogo} alt="StellarFund logo" className="w-6 h-6 object-contain" />
          <p className="font-semibold text-foreground">StellarFund</p>
        </div>
        <p>Redefining escrow with high-impact security on the Stellar network.</p>
        <p className="mt-2">© 2026 StellarFund</p>
      </footer>
    </div>
  );
}
