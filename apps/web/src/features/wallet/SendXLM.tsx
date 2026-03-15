import { useState } from "react";
import { sendXLM } from "./freighter";

interface SendXLMProps {
  fromPublicKey: string;
  onSuccess: () => void;
}

export function SendXLM({ fromPublicKey, onSuccess }: SendXLMProps) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim() || !amount.trim()) return;

    setLoading(true);
    setTxHash("");
    setError("");

    const result = await sendXLM(fromPublicKey, destination.trim(), amount.trim());

    if (result.success && result.txHash) {
      setTxHash(result.txHash);
      setDestination("");
      setAmount("");
      onSuccess();
    } else {
      setError(result.error ?? "Transaction failed.");
    }

    setLoading(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">Send XLM</h2>

      <form onSubmit={handleSend} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Destination Address</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="G..."
            required
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Amount (XLM)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            min="0.0000001"
            step="any"
            required
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 mt-1"
        >
          {loading ? "Signing & Sending..." : "Send Transaction"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 p-3 bg-secondary border border-border rounded-lg text-sm">
          <strong className="text-success">Transaction Successful!</strong>
          <br />
          <span className="font-mono text-xs text-muted-foreground break-all">{txHash}</span>
          <br />
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs"
          >
            View on StellarExpert →
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-secondary border border-destructive rounded-lg text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
