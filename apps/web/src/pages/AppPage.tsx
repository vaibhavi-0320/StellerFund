import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { checkConnection, retrievePublicKey, getBalance, shortenAddress } from "@/features/wallet/freighter";
import { createEscrow, releasePayment, refundEscrow, getEscrowDetails } from "@/lib/soroban";
import { CONTRACT_ID, FRIENDBOT_URL } from "@/lib/config";
import stellarLogo from "@/assets/stellar-fund-logo.svg";

// ── Main component ─────────────────────────────────────────
export default function AppPage() {
  const navigate = useNavigate();

  // Wallet state
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0.00");

  // Create escrow form
  const [freelancerAddr, setFreelancerAddr] = useState("");
  const [escrowAmount, setEscrowAmount] = useState("");
  const [projectMemo, setProjectMemo] = useState("");
  const [createResult, setCreateResult] = useState<TxResult>({ status: "idle", message: "" });

  // Escrow tracking
  const [createdEscrows, setCreatedEscrows] = useState<CreatedEscrow[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);

  // Per-escrow action loading
  const [actionLoading, setActionLoading] = useState<{ id: number; type: string } | null>(null);

  // Lookup
  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupData, setLookupData] = useState<{ id: number; client: string; freelancer: string; token: string; amount: string; status: string } | null>(null);
  const [lookupError, setLookupError] = useState("");

  // Confirmation modal
  const [confirmAction, setConfirmAction] = useState<{ type: "release" | "refund"; escrow: CreatedEscrow } | null>(null);

  // Transaction status indicator (global)
  const [txIndicator, setTxIndicator] = useState<{ status: "signing" | "pending" | "confirmed" | "failed"; message: string } | null>(null);

  // ── Wallet ───────────────────────────────────────────────
  const connectWallet = async () => {
    try {
      const allowed = await checkConnection();
      if (!allowed) return alert("Freighter permission denied.");
      const key = await retrievePublicKey();
      const bal = await getBalance();
      setPublicKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch {
      alert("Could not connect wallet. Make sure Freighter is installed.");
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0.00");
    setCreatedEscrows([]);
    setActivityFeed([]);
  };

  const refreshBalance = useCallback(async () => {
    try {
      const bal = await getBalance();
      setBalance(Number(bal).toFixed(2));
    } catch (error) {
      console.error("Failed to refresh balance", error);
    }
  }, []);

  const fundWithFriendbot = async () => {
    if (!publicKey) return;
    try {
      await fetch(`${FRIENDBOT_URL}?addr=${publicKey}`);
      await refreshBalance();
      alert("Account funded with testnet XLM!");
    } catch {
      alert("Friendbot failed. Try again.");
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const friendlyError = (raw: string): string => {
    if (raw.includes("non-existent contract function") || raw.includes("MissingValue"))
      return "Contract not deployed with latest code. Redeploy and update CONTRACT_ID.";
    if (raw.includes("not active")) return "Escrow is no longer active — already completed or cancelled.";
    if (raw.includes("Unauthorized") || raw.includes("only the client")) return "Only the original client can perform this action.";
    if (raw.includes("not found") || raw.includes("No escrows found")) return "Escrow not found. Check the ID and ensure it was created on this contract.";
    if (raw.includes("Amount must be")) return "Amount must be greater than zero.";
    if (raw.includes("Bad union switch: 4") || raw.includes("Transaction failed")) return "Transaction failed. Please check wallet balance or contract state.";
    return raw;
  };

  const isValidAddress = (addr: string) => /^G[A-Z2-7]{55}$/.test(addr.trim());

  const showTxStatus = (status: "signing" | "pending" | "confirmed" | "failed", message: string) => {
    setTxIndicator({ status, message });
    if (status === "confirmed" || status === "failed") {
      setTimeout(() => setTxIndicator(null), 5000);
    }
  };

  const addActivity = (entry: ActivityEntry) => {
    setActivityFeed(prev => [entry, ...prev]);
  };

  // ── Create Escrow ────────────────────────────────────────
  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancerAddr.trim() || !escrowAmount.trim()) return;
    if (!isValidAddress(freelancerAddr)) {
      setCreateResult({ status: "error", message: "Invalid Stellar address. Must start with G and be 56 characters." });
      return;
    }
    if (Number(escrowAmount) <= 0) {
      setCreateResult({ status: "error", message: "Amount must be greater than zero." });
      return;
    }

    setCreateResult({ status: "loading", message: "Waiting for Freighter signature..." });
    showTxStatus("signing", "Waiting for Freighter signature...");

    const result = await createEscrow(publicKey, freelancerAddr.trim(), Number(escrowAmount));

    if (result.success && typeof result.value === "number") {
      const escrowId = result.value;
      showTxStatus("pending", "Transaction submitted, confirming...");
      setTimeout(() => showTxStatus("confirmed", `Escrow #${escrowId} created successfully!`), 500);

      setCreateResult({
        status: "success",
        message: `Escrow #${escrowId} created on-chain!`,
        hash: result.hash,
      });
      setCreatedEscrows(prev => [...prev, {
        id: escrowId,
        freelancer: freelancerAddr.trim(),
        amount: escrowAmount.trim(),
        memo: projectMemo.trim(),
        timestamp: new Date(),
        txHash: result.hash,
        status: "Active",
      }]);
      addActivity({
        type: "create",
        escrowId,
        timestamp: new Date(),
        txHash: result.hash,
        amount: escrowAmount.trim(),
        counterparty: freelancerAddr.trim(),
        message: `Escrow #${escrowId} created — ${escrowAmount} XLM locked`,
      });
      setFreelancerAddr("");
      setEscrowAmount("");
      setProjectMemo("");
      refreshBalance();
    } else {
      showTxStatus("failed", friendlyError(result.error || "Failed"));
      setCreateResult({ status: "error", message: friendlyError(result.error || "Failed to create escrow") });
    }
  };

  // ── Release (inline from escrow card) ────────────────────
  const handleRelease = async (escrow: CreatedEscrow) => {
    setActionLoading({ id: escrow.id, type: "release" });
    showTxStatus("signing", `Releasing Escrow #${escrow.id}...`);

    const result = await releasePayment(publicKey, escrow.id);
    if (result.success) {
      showTxStatus("confirmed", `Escrow #${escrow.id} released!`);
      setCreatedEscrows(prev => prev.map(e => e.id === escrow.id ? { ...e, status: "Completed" as const } : e));
      addActivity({
        type: "release",
        escrowId: escrow.id,
        timestamp: new Date(),
        txHash: result.hash,
        amount: escrow.amount,
        message: `Funds released to freelancer for Escrow #${escrow.id}`,
      });
      refreshBalance();
    } else {
      showTxStatus("failed", friendlyError(result.error || "Release failed"));
    }
    setActionLoading(null);
  };

  // ── Refund (inline from escrow card) ─────────────────────
  const handleRefund = async (escrow: CreatedEscrow) => {
    setActionLoading({ id: escrow.id, type: "refund" });
    showTxStatus("signing", `Refunding Escrow #${escrow.id}...`);

    const result = await refundEscrow(publicKey, escrow.id);
    if (result.success) {
      showTxStatus("confirmed", `Escrow #${escrow.id} refunded!`);
      setCreatedEscrows(prev => prev.map(e => e.id === escrow.id ? { ...e, status: "Cancelled" as const } : e));
      addActivity({
        type: "refund",
        escrowId: escrow.id,
        timestamp: new Date(),
        txHash: result.hash,
        amount: escrow.amount,
        message: `Escrow #${escrow.id} refunded — funds returned to client`,
      });
      refreshBalance();
    } else {
      showTxStatus("failed", friendlyError(result.error || "Refund failed"));
    }
    setActionLoading(null);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, escrow } = confirmAction;
    setConfirmAction(null);
    if (type === "release") await handleRelease(escrow);
    else await handleRefund(escrow);
  };

  // ── Lookup ───────────────────────────────────────────────
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    setLookupData(null);
    setLookupError("");
    const result = await getEscrowDetails(Number(lookupId), publicKey || undefined);
    if (result.success && result.data) {
      setLookupData(result.data);
    } else {
      setLookupError(friendlyError(result.error || "Escrow not found"));
    }
    setLookupLoading(false);
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-4xl block mb-3">
                  {confirmAction.type === "release" ? "✅" : "↩️"}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Confirm {confirmAction.type === "release" ? "Release" : "Refund"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {confirmAction.type === "release"
                    ? `Release ${confirmAction.escrow.amount} XLM for Escrow #${confirmAction.escrow.id} to the freelancer? This is irreversible.`
                    : `Refund ${confirmAction.escrow.amount} XLM for Escrow #${confirmAction.escrow.id} back to your wallet? This is irreversible.`}
                </p>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 bg-secondary border border-border text-foreground rounded-lg py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 rounded-lg py-3 text-sm font-display font-bold transition-all ${
                    confirmAction.type === "release"
                      ? "bg-success text-success-foreground hover:brightness-110"
                      : "bg-destructive text-destructive-foreground hover:brightness-110"
                  }`}
                >
                  {confirmAction.type === "release" ? "Release Funds" : "Refund Now"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Transaction Status Indicator (floating) ── */}
      <AnimatePresence>
        {txIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed left-4 right-4 top-20 z-[90] rounded-xl border px-4 py-3 shadow-lg sm:left-1/2 sm:right-auto sm:top-16 sm:w-auto sm:min-w-[320px] sm:max-w-xl sm:-translate-x-1/2 ${
              txIndicator.status === "signing" ? "bg-card border-primary/40 text-primary" :
              txIndicator.status === "pending" ? "bg-card border-primary/40 text-primary" :
              txIndicator.status === "confirmed" ? "bg-card border-success/40 text-success" :
              "bg-card border-destructive/40 text-destructive"
            }`}
          >
            {txIndicator.status === "signing" && (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block">⏳</motion.span>
            )}
            {txIndicator.status === "pending" && (
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">📡</motion.span>
            )}
            {txIndicator.status === "confirmed" && "✅"}
            {txIndicator.status === "failed" && "❌"}
            <span className="text-xs">{txIndicator.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header / Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={stellarLogo} alt="StellarFund logo" className="w-7 h-7 object-contain" />
              <span className="font-display font-bold text-foreground">StellarFund</span>
            </button>
            <span className="text-[10px] tracking-wider uppercase bg-secondary text-muted-foreground px-2 py-0.5 rounded font-mono">
              Testnet
            </span>
          </div>

          {connected ? (
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3">
              <div className="order-3 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-[11px] sm:order-none sm:flex sm:w-auto sm:items-center sm:gap-2 sm:py-1.5 sm:text-xs">
                <span className="text-foreground font-mono font-semibold">{balance} XLM</span>
                <span className="text-muted-foreground">·</span>
                <span className="break-all font-mono text-muted-foreground">{shortenAddress(publicKey)}</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Connected
              </span>
              <button onClick={disconnect} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 sm:w-auto"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* ── Not Connected State ── */}
      {!connected && (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 shadow-[0_0_32px_rgba(0,0,0,0.4)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={stellarLogo} alt="StellarFund logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold mb-3 text-foreground">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              Install the Freighter browser extension and connect to interact with the StellarFund escrow contract on testnet.
            </p>
            <button
              onClick={connectWallet}
              className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-display font-semibold text-primary-foreground transition-all hover:brightness-110 glow-gold sm:w-auto"
            >
              Connect Freighter
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Connected Dashboard ── */}
      {connected && publicKey && (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 sm:py-8">

          {/* ─── 1. Wallet Status Card ─── */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Wallet Balance</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    {balance} <span className="text-base text-muted-foreground">XLM</span>
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 break-all">{publicKey}</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    onClick={fundWithFriendbot}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
                  >
                    🪙 Fund with Friendbot
                  </button>
                  <button
                    onClick={refreshBalance}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:w-auto"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ─── 2. Create Escrow ─── */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionHeader icon="📝" title="Create Escrow" badge="Step 1" badgeColor="bg-primary/20 text-primary" />
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Lock XLM in a Soroban smart contract. The freelancer gets paid only when you release. Freighter will ask you to sign.
              </p>
              <form onSubmit={handleCreateEscrow} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Freelancer Wallet Address</label>
                  <input
                    type="text"
                    value={freelancerAddr}
                    onChange={(e) => setFreelancerAddr(e.target.value)}
                    placeholder="G..."
                    required
                    className={`w-full bg-input border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring ${
                      freelancerAddr && !isValidAddress(freelancerAddr) ? "border-destructive/50" : "border-border"
                    }`}
                  />
                  {freelancerAddr && !isValidAddress(freelancerAddr) && (
                    <p className="text-destructive text-[10px] mt-1">Invalid address — must start with G and be 56 characters</p>
                  )}                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Amount (XLM)</label>
                    <input type="number" value={escrowAmount} onChange={(e) => setEscrowAmount(e.target.value)} placeholder="100" min="1" step="any" required className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Project Memo <span className="text-muted-foreground/50 normal-case">Optional</span></label>
                    <input type="text" value={projectMemo} onChange={(e) => setProjectMemo(e.target.value)} placeholder="Logo design, website, etc." className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createResult.status === "loading" || (!!freelancerAddr && !isValidAddress(freelancerAddr))}
                  className="bg-primary text-primary-foreground rounded-lg py-3.5 text-sm font-display font-bold disabled:opacity-60 hover:brightness-110 transition-all glow-gold-sm"
                >
                  {createResult.status === "loading" ? "⏳ Waiting for Freighter..." : "🔐 Create Escrow"}
                </button>
              </form>

              {/* Create result */}
              <AnimatePresence>
                {createResult.status !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-4 rounded-lg border text-sm ${
                      createResult.status === "loading" ? "bg-primary/10 border-primary/30 text-primary" :
                      createResult.status === "success" ? "bg-success/10 border-success/30 text-success" :
                      "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                  >
                    <p className="font-semibold text-xs">{createResult.status === "success" ? "✅ Escrow Created" : createResult.status === "error" ? "❌ Error" : "Processing..."}</p>
                    <p className="text-xs opacity-80 mt-1">{createResult.message}</p>
                    {createResult.hash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${createResult.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block break-all text-[10px] text-primary underline"
                      >
                        View on Stellar Expert →
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* ─── 3. Active Escrows (with inline actions) ─── */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionHeader icon="📋" title="Active Escrows" badge={`${createdEscrows.length} total`} badgeColor="bg-secondary text-muted-foreground" />

            {createdEscrows.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-10 text-center">
                <p className="text-muted-foreground text-sm">No escrows yet. Create one above to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {createdEscrows.map((esc) => {
                  const isLoading = actionLoading?.id === esc.id;
                  return (
                    <motion.div
                      key={esc.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-card border border-border rounded-xl p-5 flex flex-col"
                    >
                      {/* Card header */}
                      <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="font-mono font-bold text-primary text-lg">#{esc.id}</span>
                          {esc.memo && <span className="truncate text-[10px] text-muted-foreground italic">"{esc.memo}"</span>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                          esc.status === "Active" ? "bg-primary/20 text-primary" :
                          esc.status === "Completed" ? "bg-success/20 text-success" :
                          "bg-destructive/20 text-destructive"
                        }`}>{esc.status}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">Freelancer</span>
                          <span className="font-mono text-right text-foreground break-all">{shortenAddress(esc.freelancer)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-semibold text-primary">{esc.amount} XLM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-foreground">{esc.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {/* Tx link */}
                      {esc.txHash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${esc.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block break-all text-[10px] text-primary underline"
                        >
                          View creation tx →
                        </a>
                      )}

                      {/* Inline Actions */}
                      {esc.status === "Active" && (
                        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
                          <button
                            onClick={() => setConfirmAction({ type: "release", escrow: esc })}
                            disabled={isLoading}
                            className="flex-1 bg-success/10 text-success border border-success/20 rounded-lg py-2.5 text-xs font-bold hover:bg-success/20 transition-all disabled:opacity-50"
                          >
                            {isLoading && actionLoading?.type === "release" ? "⏳ Releasing..." : "✅ Release Funds"}
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: "refund", escrow: esc })}
                            disabled={isLoading}
                            className="flex-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg py-2.5 text-xs font-bold hover:bg-destructive/20 transition-all disabled:opacity-50"
                          >
                            {isLoading && actionLoading?.type === "refund" ? "⏳ Refunding..." : "↩️ Refund"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* ─── 4. Recent Activity (Event Feed) ─── */}
          {activityFeed.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SectionHeader icon="📡" title="Recent Activity" badge={`${activityFeed.length} events`} badgeColor="bg-accent/20 text-accent-foreground" />
              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {activityFeed.slice(0, 10).map((entry, i) => (
                  <motion.div
                    key={`${entry.txHash}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                    className="flex flex-col items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/20 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {entry.type === "create" ? "📝" : entry.type === "release" ? "✅" : "↩️"}
                      </span>
                      <div>
                        <p className="text-xs text-foreground font-medium">{entry.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{entry.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${entry.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary underline"
                    >
                      View →
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── 5. Escrow Lookup ─── */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SectionHeader icon="🔍" title="Lookup Escrow" badge="Read Only" badgeColor="bg-secondary text-muted-foreground" />
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-xs text-muted-foreground mb-4">
                Enter any escrow ID to view its on-chain details — client, freelancer, amount, and status.
              </p>
              <form onSubmit={handleLookup} className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input type="number" value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Escrow ID" required className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring" />
                <button type="submit" disabled={lookupLoading} className="bg-secondary border border-border text-foreground px-6 py-3 rounded-lg text-sm font-display font-bold disabled:opacity-60 hover:bg-muted transition-all sm:w-auto">
                  {lookupLoading ? "..." : "Lookup"}
                </button>
              </form>
              {lookupError && (
                <div className="p-4 rounded-lg border bg-destructive/10 border-destructive/30 text-destructive text-sm">
                  <p className="font-semibold text-xs mb-1">Not Found</p>
                  <p className="text-xs opacity-80">{lookupError}</p>
                </div>
              )}
              {lookupData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border bg-success/10 border-success/30">
                  <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <p className="text-sm font-semibold text-success">Escrow #{lookupId}</p>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      lookupData.status === "Active" ? "bg-primary/20 text-primary"
                        : lookupData.status === "Completed" ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}>{lookupData.status}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Amount</p>
                      <p className="font-mono font-semibold text-primary">{lookupData.amount} XLM</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Status</p>
                      <p className="font-mono font-semibold text-foreground">{lookupData.status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground mb-0.5">Client</p>
                      <p className="font-mono text-foreground break-all text-[10px]">{lookupData.client}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground mb-0.5">Freelancer</p>
                      <p className="font-mono text-foreground break-all text-[10px]">{lookupData.freelancer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* ─── 6. Transaction History ─── */}
          {activityFeed.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <SectionHeader icon="📜" title="Transaction History" badge={`${activityFeed.length} txns`} badgeColor="bg-secondary text-muted-foreground" />
              <div className="space-y-3 sm:hidden">
                {activityFeed.map((entry, i) => (
                  <div key={`${entry.txHash}-mobile-${i}`} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        entry.type === "create" ? "bg-primary/20 text-primary" :
                        entry.type === "release" ? "bg-success/20 text-success" :
                        "bg-destructive/20 text-destructive"
                      }`}>{entry.type}</span>
                      <span className="font-mono font-bold text-foreground">#{entry.escrowId}</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Time</span>
                        <span className="text-foreground">{entry.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-foreground">{entry.amount ? `${entry.amount} XLM` : "â€”"}</span>
                      </div>
                      <div className="pt-1">
                        <a href={`https://stellar.expert/explorer/testnet/tx/${entry.txHash}`} target="_blank" rel="noopener noreferrer" className="text-primary text-[11px] underline break-all">
                          View transaction
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-x-auto sm:block">
                <div className="min-w-[720px] bg-card border border-border rounded-xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-2 bg-secondary/50 border-b border-border px-5 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2">ID</span>
                  <span className="col-span-3">Time</span>
                  <span className="col-span-2">Amount</span>
                  <span className="col-span-3">Hash</span>
                </div>
                <div className="divide-y divide-border">
                  {activityFeed.map((entry, i) => (
                    <div key={`${entry.txHash}-${i}`} className="px-5 py-3 text-xs grid grid-cols-12 gap-2 items-center hover:bg-secondary/20 transition-colors">
                      <div className="col-span-3 sm:col-span-2">
                        <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          entry.type === "create" ? "bg-primary/20 text-primary" :
                          entry.type === "release" ? "bg-success/20 text-success" :
                          "bg-destructive/20 text-destructive"
                        }`}>{entry.type}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-mono font-bold text-foreground">#{entry.escrowId}</span>
                      </div>
                      <div className="col-span-4 sm:col-span-3 text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        {entry.amount ? <span className="font-semibold text-foreground">{entry.amount} XLM</span> : <span className="text-muted-foreground">—</span>}
                      </div>
                      <div className="hidden sm:flex col-span-3 items-center gap-2">
                        <span className="font-mono text-muted-foreground truncate">{entry.txHash.slice(0, 10)}...</span>
                        <a href={`https://stellar.expert/explorer/testnet/tx/${entry.txHash}`} target="_blank" rel="noopener noreferrer" className="text-primary text-[10px] underline">View</a>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ─── Contract Info Footer ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Smart Contract</p>
            <p className="font-mono text-[10px] text-foreground break-all mb-2">{CONTRACT_ID}</p>
            <a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline">
              View on Stellar Expert →
            </a>
          </motion.div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 mt-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={stellarLogo} alt="StellarFund logo" className="w-6 h-6 object-contain" />
            <span className="font-display font-bold text-foreground">StellarFund</span>
          </div>
          <p>Decentralised escrow powered by Stellar & Soroban smart contracts.</p>
          <p>© 2026 StellarFund</p>
        </div>
      </footer>
    </div>
  );
}

// ── Reusable section header ────────────────────────────────
function SectionHeader({ icon, title, badge, badgeColor }: { icon: string; title: string; badge: string; badgeColor: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-xl">{icon}</span>
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-mono font-semibold ${badgeColor}`}>{badge}</span>
    </div>
  );
}



