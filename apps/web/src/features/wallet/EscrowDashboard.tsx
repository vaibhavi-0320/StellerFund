import { useState } from "react";

interface EscrowItem {
  id: number;
  freelancer: string;
  amount: string;
  status: "Active" | "Completed" | "Cancelled";
}

interface EscrowDashboardProps {
  publicKey: string;
}

export function EscrowDashboard({ publicKey }: EscrowDashboardProps) {
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [freelancer, setFreelancer] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Create a new escrow (local demo - no on-chain call)
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!freelancer.trim() || !amount.trim()) return;
    if (Number(amount) <= 0) return alert("Amount must be greater than zero");

    const newEscrow: EscrowItem = {
      id: escrows.length + 1,
      freelancer: freelancer.trim(),
      amount: amount.trim(),
      status: "Active",
    };

    setEscrows([...escrows, newEscrow]);
    setFreelancer("");
    setAmount("");
    setShowForm(false);
  }

  // Release payment
  function handleRelease(id: number) {
    setEscrows(
      escrows.map((e) =>
        e.id === id && e.status === "Active" ? { ...e, status: "Completed" } : e
      )
    );
  }

  // Refund
  function handleRefund(id: number) {
    setEscrows(
      escrows.map((e) =>
        e.id === id && e.status === "Active" ? { ...e, status: "Cancelled" } : e
      )
    );
  }

  const shortenAddr = (addr: string) =>
    addr.length > 12 ? addr.slice(0, 4) + "..." + addr.slice(-4) : addr;

  return (
    <div>
      {/* Create escrow button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold mb-4"
      >
        {showForm ? "Cancel" : "Create Escrow"}
      </button>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-card border border-border rounded-xl p-5 mb-4 flex flex-col gap-3"
        >
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Freelancer Address</label>
            <input
              type="text"
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
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
              placeholder="500"
              min="1"
              step="any"
              required
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Submit Escrow
          </button>
        </form>
      )}

      {/* Escrow list */}
      {escrows.length === 0 && !showForm && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">No escrows yet. Create one to get started.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {escrows.map((esc) => (
          <div
            key={esc.id}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Escrow #{esc.id}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  esc.status === "Active"
                    ? "bg-primary/20 text-primary"
                    : esc.status === "Completed"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {esc.status}
              </span>
            </div>
            <p className="text-sm text-foreground mb-1">
              <span className="text-muted-foreground">To:</span> {shortenAddr(esc.freelancer)}
            </p>
            <p className="text-lg font-bold text-primary mb-3">{esc.amount} XLM</p>

            {esc.status === "Active" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleRelease(esc.id)}
                  className="flex-1 bg-green-700 text-white rounded-lg py-2 text-xs font-medium"
                >
                  Release
                </button>
                <button
                  onClick={() => handleRefund(esc.id)}
                  className="flex-1 bg-destructive text-destructive-foreground rounded-lg py-2 text-xs font-medium"
                >
                  Refund
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
