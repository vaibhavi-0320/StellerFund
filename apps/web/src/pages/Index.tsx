import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CONTRACT_ID } from "@/lib/config";
import StarfieldBackground from "@/components/layout/StarfieldBackground";
import stellarLogo from "@/assets/stellar-fund-logo.svg";


function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FlowStep({ step, icon, title, desc, color, delay }: {
  step: number; icon: string; title: string; desc: string; color: string; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: step % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { scale: 1.03, y: -4 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`bg-card border rounded-xl p-6 cursor-pointer transition-colors ${
          hovered ? "border-primary/50" : "border-border"
        }`}
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={hovered ? { rotate: [0, -10, 10, 0], scale: 1.2 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}
          >
            {icon}
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary font-mono text-xs">0{step}</span>
              <h3 className="truncate font-display font-bold text-lg text-foreground">{title}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            <motion.div
              initial={{ width: 0 }}
              animate={hovered ? { width: "100%" } : { width: 0 }}
              className="h-0.5 bg-primary/40 rounded mt-3"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { title: "Trustless", desc: "Smart contract enforced, no middlemen needed", icon: "🔒" },
    { title: "Instant", desc: "3-5 second finality on Stellar network", icon: "⚡" },
    { title: "Cheap", desc: "Fractions of a cent per transaction", icon: "💰" },
    { title: "Global", desc: "Anyone, anywhere, anytime, no borders", icon: "🌐" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body relative">
      {/* 3D Starfield Background */}
      <StarfieldBackground />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img src={stellarLogo} alt="StellarFund logo" className="w-8 h-8 object-contain" />
            <span className="truncate font-display font-bold text-lg text-foreground">StellarFund</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">Problem</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#tech" className="hover:text-foreground transition-colors">Technology</a>
          </div>
          <button
            onClick={() => navigate("/app")}
            className="hidden rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 md:inline-flex"
          >
            Launch App
          </button>
        </div>
        <div className="border-t border-border/40 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted min-[420px]:w-auto"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
            <button
              onClick={() => navigate("/app")}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 min-[420px]:w-auto"
            >
              Launch App
            </button>
          </div>
          {menuOpen && (
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <a href="#problem" onClick={() => setMenuOpen(false)} className="rounded-lg border border-border/60 bg-card px-3 py-2 hover:text-foreground transition-colors">Problem</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="rounded-lg border border-border/60 bg-card px-3 py-2 hover:text-foreground transition-colors">How it works</a>
              <a href="#features" onClick={() => setMenuOpen(false)} className="rounded-lg border border-border/60 bg-card px-3 py-2 hover:text-foreground transition-colors">Features</a>
              <a href="#tech" onClick={() => setMenuOpen(false)} className="rounded-lg border border-border/60 bg-card px-3 py-2 hover:text-foreground transition-colors">Technology</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-36 z-10 sm:px-6 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-xs tracking-widest uppercase text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              Live on Stellar Testnet
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={stellarLogo} alt="StellarFund logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold tracking-tight leading-[1.1] sm:text-6xl md:text-7xl">
              <span className="text-foreground">Stellar</span>
              <span className="text-gradient-gold">Fund</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-primary font-display text-lg font-semibold mb-4 sm:text-2xl"
          >
            Get paid without the trust tax.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground max-w-xl mx-auto mb-10 text-sm leading-relaxed md:text-base"
          >
            StellarFund is a decentralised escrow platform that locks XLM in a Soroban
            smart contract. Funds release only when work is approved, enforced by code, not trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <button
              onClick={() => navigate("/app")}
              className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-display font-semibold text-primary-foreground transition-all hover:brightness-110 glow-gold sm:w-auto"
            >
              Launch App
            </button>
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-border px-8 py-3 text-sm font-display font-semibold text-foreground transition-all hover:bg-secondary sm:w-auto"
            >
              View Contract
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-center sm:gap-8"
          >
            {[
              { value: "3-5s", label: "Finality" },
              { value: "<$0.01", label: "Tx Fee" },
              { value: "100%", label: "On-chain" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="cursor-default"
              >
                <p className="text-primary font-display font-bold text-lg">{stat.value}</p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-4 relative z-10 sm:px-6 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block bg-primary/20 text-primary text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-8">
              The Problem
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-2 text-foreground">
              Freelancing is a
            </h2>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-muted-foreground/40">
              leap of faith
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "👻", title: "Payment ghosting", desc: "60% of freelancers report late or missing payments. You deliver, they disappear." },
              { emoji: "🏛️", title: "Platform exploitation", desc: "Centralized platforms take 20 to 35% fees and can freeze your account without warning." },
              { emoji: "⚖️", title: "No enforcement", desc: "Contracts are pieces of paper. When things go wrong, you are alone." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6, borderColor: "hsl(38 55% 62% / 0.4)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-card border border-border rounded-xl p-6 h-full group cursor-default"
                >
                  <motion.span
                    className="text-3xl mb-4 block"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: "spring" }}
                  >
                    {item.emoji}
                  </motion.span>
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 relative z-10 sm:px-6 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <span className="inline-block bg-primary/20 text-primary text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-8">
              How It Works
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-foreground">Three steps.</h2>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-foreground">Permanent protection.</h2>
            <p className="text-muted-foreground text-sm mb-12 md:mb-16 max-w-lg">Tap or hover over each step to explore the escrow lifecycle on the Stellar blockchain.</p>
          </AnimatedSection>

          <div className="space-y-4 relative">
            <div className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-success/40 to-destructive/30 hidden md:block" />
            <FlowStep step={1} icon="🔐" title="Client locks funds" desc="XLM is deposited into the Soroban smart contract. Funds sit on-chain, controlled by code. Nobody can touch them without authorization." color="bg-primary/20" delay={0} />
            <FlowStep step={2} icon="🚀" title="Freelancer delivers work" desc="The freelancer completes the agreed deliverable. Once ready, the client reviews and decides to approve or dispute." color="bg-accent/20" delay={0.15} />
            <FlowStep step={3} icon="✅" title="One-click settlement" desc="Client releases payment to the freelancer, or refunds themselves. Every action requires a Freighter wallet signature, fully trustless." color="bg-success/20" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 relative z-10 sm:px-6 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block bg-primary/20 text-primary text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-8">
              Why StellarFund
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-foreground">Built different.</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-card border border-border rounded-xl p-6 cursor-default transition-colors text-center hover:border-primary/50 h-full flex flex-col items-center justify-center"
                >
                  <span className="text-3xl mb-4 block">{feat.icon}</span>
                  <h3 className="font-display font-bold text-foreground mb-2 text-lg">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section id="tech" className="py-20 px-4 relative z-10 sm:px-6 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block bg-primary/20 text-primary text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-8">
              Technology
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-foreground">Built on Stellar.</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "⚙️", title: "Soroban Smart Contracts", desc: "Rust-based smart contracts on Stellar's Soroban platform. Type-safe, deterministic, and battle-tested." },
              { icon: "🔑", title: "Freighter Wallet", desc: "Browser extension for signing transactions. Your private keys never leave your device." },
              { icon: "🌐", title: "Stellar Testnet", desc: "Deploy and test with free testnet XLM. Production-ready architecture for mainnet migration." },
              { icon: "⚛️", title: "React Frontend", desc: "Modern frontend with real-time transaction feedback, 3D visuals, and responsive design." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "hsl(38 55% 62% / 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-card border border-border rounded-xl p-6 cursor-default"
                >
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative z-10 sm:px-6 sm:py-24">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 shadow-[0_0_32px_rgba(0,0,0,0.4)]"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <img src={stellarLogo} alt="StellarFund logo" className="w-full h-full object-contain" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 text-sm">Connect your Freighter wallet and create your first escrow on the Stellar testnet.</p>
          <button
            onClick={() => navigate("/app")}
            className="w-full rounded-lg bg-primary px-10 py-3 text-sm font-display font-semibold text-primary-foreground transition-all hover:brightness-110 glow-gold sm:w-auto"
          >
            Launch App
          </button>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 relative z-10 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={stellarLogo} alt="StellarFund logo" className="w-6 h-6 object-contain" />
            <span className="font-display font-bold text-foreground">StellarFund</span>
          </div>
          <p>Decentralised escrow powered by Stellar &amp; Soroban smart contracts.</p>
          <p>© 2026 StellarFund</p>
        </div>
      </footer>
    </div>
  );
}
