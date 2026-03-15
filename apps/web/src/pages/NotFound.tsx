import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import stellarLogo from "@/assets/stellar-fund-logo.svg";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={stellarLogo} alt="StellarFund logo" className="w-7 h-7 object-contain" />
            <span className="font-display font-bold text-foreground">StellarFund</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 opacity-80 shadow-[0_0_32px_rgba(0,0,0,0.35)]"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={stellarLogo} alt="StellarFund logo" className="w-full h-full object-contain" />
          </motion.div>

          <h1 className="font-display text-7xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-xl font-bold text-foreground mb-3">Lost in the cosmos</h2>
          <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
            The route <code className="bg-secondary px-2 py-0.5 rounded font-mono text-xs text-foreground">{location.pathname}</code> doesn't exist on this network.
          </p>
          <p className="text-muted-foreground/60 text-xs mb-8">
            Double-check the URL or head back to safety.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-display font-semibold text-sm hover:brightness-110 transition-all glow-gold-sm"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/app")}
              className="border border-border text-foreground px-8 py-3 rounded-lg font-display font-semibold text-sm hover:bg-secondary transition-all"
            >
              Launch App
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground">
          <p>© 2026 StellarFund — Decentralised escrow on Stellar</p>
        </div>
      </footer>
    </div>
  );
}
