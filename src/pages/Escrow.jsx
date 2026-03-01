import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CONTRACT_ID,
  connectFreighter,
  contractExplorerUrl,
  createEscrow,
  getEscrow,
  getXlmBalance,
  refundEscrow,
  releaseEscrow,
} from '../lib/freighter';

export default function Escrow() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [escrowId, setEscrowId] = useState('');
  const [loadedEscrow, setLoadedEscrow] = useState(null);
  const [latest, setLatest] = useState(null);
  const [working, setWorking] = useState(false);

  const canActAsClient = useMemo(() => {
    return loadedEscrow && address && loadedEscrow.client === address;
  }, [loadedEscrow, address]);

  async function loadEscrowById() {
    const result = await getEscrow({ sourceAddress: address, escrowId });
    if (result.status !== 'success') {
      setLoadedEscrow(null);
      setLatest({ type: 'error', message: result.message || result.errorType || 'Load failed' });
      return false;
    }
    setLoadedEscrow(result.escrow);
    setLatest({ type: 'success', message: `Escrow ${escrowId} loaded.` });
    return true;
  }

  async function connectWallet() {
    try {
      setWorking(true);
      const pk = await connectFreighter();
      setAddress(pk);
      const xlm = await getXlmBalance(pk);
      setBalance(xlm);
      setLatest({ type: 'success', message: 'Freighter connected.' });
    } catch (err) {
      setLatest({ type: 'error', message: err.message || String(err) });
    } finally {
      setWorking(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    try {
      setWorking(true);
      const result = await createEscrow({
        clientAddress: address,
        freelancerAddress: freelancer,
        amountText: amount,
      });
      if (result.status !== 'success') {
        setLatest({
          type: 'error',
          message: `${result.message}`,
          hash: result.txHash,
          link: result.txUrl,
        });
        return;
      }

      setEscrowId(String(result.escrowId));
      setLatest({
        type: 'success',
        message: `Escrow created. Escrow ID: ${result.escrowId}`,
        hash: result.txHash,
        link: result.txUrl,
      });
    } catch (err) {
      setLatest({ type: 'error', message: err.message || String(err) });
    } finally {
      setWorking(false);
    }
  }

  async function handleLoadEscrow(event) {
    event.preventDefault();
    try {
      setWorking(true);
      await loadEscrowById();
    } catch (err) {
      setLatest({ type: 'error', message: err.message || String(err) });
    } finally {
      setWorking(false);
    }
  }

  async function handleRelease() {
    try {
      setWorking(true);
      const result = await releaseEscrow({ clientAddress: address, escrowId });
      if (result.status !== 'success') {
        setLatest({
          type: 'error',
          message: result.message || result.errorType || 'Release failed',
          hash: result.txHash,
          link: result.txUrl,
        });
        return;
      }
      setLatest({
        type: 'success',
        message: 'Escrow released successfully.',
        hash: result.txHash,
        link: result.txUrl,
      });
      await loadEscrowById();
    } catch (err) {
      setLatest({ type: 'error', message: err.message || String(err) });
    } finally {
      setWorking(false);
    }
  }

  async function handleRefund() {
    try {
      setWorking(true);
      const result = await refundEscrow({ clientAddress: address, escrowId });
      if (result.status !== 'success') {
        setLatest({
          type: 'error',
          message: result.message || result.errorType || 'Refund failed',
          hash: result.txHash,
          link: result.txUrl,
        });
        return;
      }
      setLatest({
        type: 'success',
        message: 'Escrow refunded successfully.',
        hash: result.txHash,
        link: result.txUrl,
      });
      await loadEscrowById();
    } catch (err) {
      setLatest({ type: 'error', message: err.message || String(err) });
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="escrow-shell">
      <header className="escrow-top">
        <div>
          <p className="crumb">
            <Link to="/">Home</Link> / Escrow
          </p>
          <h1>StellarFund Escrow Console</h1>
        </div>
        <button disabled={working} onClick={connectWallet} className="primary-btn" type="button">
          Connect Freighter
        </button>
      </header>

      <section className="info-grid">
        <article className="card">
          <h3>Wallet</h3>
          <p>
            <strong>Address:</strong> {address || 'Not connected'}
          </p>
          <p>
            <strong>XLM Balance:</strong> {balance || '-'}
          </p>
          <p>
            <strong>Contract ID:</strong> <code>{CONTRACT_ID}</code>
          </p>
          <a href={contractExplorerUrl()} target="_blank" rel="noreferrer">
            Open contract on Stellar Expert
          </a>
        </article>

        <article className="card">
          <h3>Create Escrow</h3>
          <form onSubmit={handleCreate} className="stack">
            <label>
              Freelancer Address
              <input
                required
                value={freelancer}
                onChange={(e) => setFreelancer(e.target.value)}
                placeholder="G..."
              />
            </label>
            <label>
              Amount (XLM)
              <input
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10.5"
              />
            </label>
            <button className="primary-btn" disabled={!address || working} type="submit">
              Create Escrow
            </button>
          </form>
        </article>
      </section>

      <section className="info-grid">
        <article className="card">
          <h3>Escrow Actions</h3>
          <form onSubmit={handleLoadEscrow} className="stack">
            <label>
              Escrow ID
              <input
                required
                value={escrowId}
                onChange={(e) => setEscrowId(e.target.value)}
                placeholder="1"
              />
            </label>
            <button className="secondary-btn" disabled={!address || working} type="submit">
              Load Escrow
            </button>
          </form>

          {loadedEscrow ? (
            <div className="escrow-data">
              <p>
                <strong>Status:</strong> {loadedEscrow.status}
              </p>
              <p>
                <strong>Client:</strong> {loadedEscrow.client}
              </p>
              <p>
                <strong>Freelancer:</strong> {loadedEscrow.freelancer}
              </p>
              <p>
                <strong>Amount:</strong> {loadedEscrow.amountXlm} XLM
              </p>
              {canActAsClient ? (
                <div className="row">
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={working}
                    onClick={handleRelease}
                  >
                    Release
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    disabled={working}
                    onClick={handleRefund}
                  >
                    Refund
                  </button>
                </div>
              ) : (
                <p className="muted">Only escrow client can release/refund.</p>
              )}
            </div>
          ) : null}
        </article>

        <article className="card">
          <h3>Latest Transaction</h3>
          <p className={latest?.type === 'error' ? 'error-text' : 'success-text'}>
            {latest?.message || 'No transactions yet.'}
          </p>
          {latest?.hash ? (
            <p>
              <strong>Hash:</strong> {latest.hash}
            </p>
          ) : null}
          {latest?.link ? (
            <a href={latest.link} target="_blank" rel="noreferrer">
              View on Stellar Expert
            </a>
          ) : null}
          <ul className="error-guide">
            <li>EscrowNotFound: invalid escrow ID.</li>
            <li>UnauthorizedClient: connected wallet is not escrow client.</li>
            <li>AlreadyCompleted: escrow already released or refunded.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
