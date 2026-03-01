import { Link } from 'react-router-dom';

function Starfield() {
  const stars = Array.from({ length: 80 }, (_, i) => i);
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-shell">
      <Starfield />
      <header className="home-header">
        <img
          src="https://stellar.org/wp-content/uploads/2023/01/stellar-logo.svg"
          alt="Stellar logo"
          className="stellar-mark"
        />
        <h1 className="title-pop">StellarFund</h1>
        <p className="subtitle">Escrow infrastructure for freelancers on Stellar Testnet.</p>
        <Link className="launch-btn" to="/escrow">
          Launch App
        </Link>
      </header>

      <section className="info-section">
        <h2>Problem</h2>
        <p>
          Freelancers and clients lose trust when payments happen off-platform. Traditional escrow
          services are slow and expensive for small global payments.
        </p>
      </section>

      <section className="info-section">
        <h2>How It Works</h2>
        <p>
          A client creates an escrow on-chain with freelancer address and amount. Funds are
          released or refunded by the client through signed Soroban transactions in Freighter.
        </p>
      </section>

      <section className="info-section">
        <h2>Technology</h2>
        <p>
          Soroban smart contract (Rust), React + Vite frontend, Freighter signing, and Stellar
          Expert transaction traceability.
        </p>
      </section>
    </div>
  );
}
