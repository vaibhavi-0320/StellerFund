/**
 * stellar.js — StellarFund SDK helpers
 *
 * BUGS FIXED IN THIS VERSION:
 *
 * 1. "Bad union switch: 4"
 *    Freighter API v2 signTransaction() returns { signedTxXdr: string },
 *    NOT a plain string. Passing the object to TransactionBuilder.fromXDR()
 *    corrupts the XDR union discriminant → "Bad union switch: 4".
 *    Fix: extract signedXdr = result?.signedTxXdr ?? result
 *
 * 2. "XDR Write Error: invalid u32 value"
 *    The tx hash (hex string) was being pasted into the Escrow ID field.
 *    parseInt("ee16c5...") → NaN → nativeToScVal(NaN, {type:"u32"}) crashes.
 *    Fix: validate ID is a positive integer before building any transaction.
 *
 * 3. Escrow ID shows #?
 *    stellar-sdk v11 ScVal u32 accessor differs by build.
 *    Fix: try every known accessor + raw XDR re-parse fallback.
 *
 * 4. Error(Contract, #2) = UnauthorizedClient
 *    The connected wallet was NOT the client that created the escrow.
 *    Fix: user must redeploy contract and create escrows with their own wallet.
 *    Frontend now shows a clear warning if wallet mismatches.
 */

import {
  getPublicKey,
  signTransaction,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";

import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Address,
  SorobanRpc,
  xdr,
} from "stellar-sdk";

// ── Config — UPDATE CONTRACT_ID after redeploying ─────────────────────────────
export const CONTRACT_ID   = "CBMWJRPO32QCOEAUJQHGRCDEJVNIFJALUUWD7KDCBLIUOSMN35Y7MRKF";
export const NETWORK_PASS  = Networks.TESTNET;
export const RPC_URL       = "https://soroban-testnet.stellar.org";
export const EXPLORER_BASE = "https://stellar.expert/explorer/testnet";

export const txLink       = (h) => `${EXPLORER_BASE}/tx/${h}`;
export const contractLink = ()  => `${EXPLORER_BASE}/contract/${CONTRACT_ID}`;
export const accountLink  = (a) => `${EXPLORER_BASE}/account/${a}`;
export const shortAddr    = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
export const stroopsFromXlm = (x) =>
  BigInt(Math.round(parseFloat(x) * 10_000_000));

// ── Wallet ────────────────────────────────────────────────────────────────────
export async function connectWallet() {
  const check = await isConnected();
  // v1 → boolean, v2 → { isConnected: boolean }
  const connected =
    typeof check === "object" ? check?.isConnected : check;

  if (!connected) {
    throw new Error(
      "Freighter wallet not found. Please install the Freighter extension from freighter.app, then reload this page."
    );
  }

  await requestAccess();
  const res = await getPublicKey();
  // v1 → string, v2 → { publicKey: string }
  const pk = typeof res === "object" ? (res?.publicKey ?? res) : res;

  if (!pk || typeof pk !== "string" || pk.length < 50) {
    throw new Error("Could not get public key from Freighter. Make sure you are logged in.");
  }
  return pk;
}

export async function getXlmBalance(pk) {
  try {
    const server = new SorobanRpc.Server(RPC_URL);
    const acct   = await server.getAccount(pk);
    const native = acct.balances.find((b) => b.asset_type === "native");
    return native ? parseFloat(native.balance).toFixed(2) : "0.00";
  } catch {
    return "0.00";
  }
}

// ── Escrow ID validation ──────────────────────────────────────────────────────
// This catches the "#2 XDR Write Error: invalid u32 value" error.
// Happens when a tx hash string is pasted into the Escrow ID field.
export function parseEscrowId(raw) {
  const str = String(raw ?? "").trim();

  if (!str || str === "?" || str === "") {
    throw new Error(
      "Enter an escrow ID number (e.g. 1, 2, 3). " +
      "Your escrow ID is shown after you create an escrow."
    );
  }

  // Detect if a Stellar address was pasted by mistake
  if (/^G[A-Z2-7]{10,}/.test(str)) {
    throw new Error(
      "That looks like a Stellar address, not an escrow ID. " +
      "The escrow ID is a short number like 1, 2, or 3. " +
      "Check the Transaction History section for your escrow ID."
    );
  }

  // Detect if a tx hash was pasted (64-char hex)
  if (/^[0-9a-f]{20,}/i.test(str)) {
    throw new Error(
      "That looks like a transaction hash, not an escrow ID. " +
      "The escrow ID is a short number like 1, 2, or 3. " +
      "It was shown in the green success card when you created the escrow."
    );
  }

  const n = parseInt(str, 10);
  if (isNaN(n) || n < 1 || !Number.isInteger(n)) {
    throw new Error(
      `"${str}" is not a valid escrow ID. Enter a positive integer like 1, 2, or 3.`
    );
  }
  return n;
}

// ── Extract u32 escrow ID from Soroban return value ───────────────────────────
// stellar-sdk v11 stores ScVal in different internal shapes.
// We try every known accessor + raw XDR re-parse as fallback.
export function extractU32(scVal) {
  if (!scVal) return null;

  // Method 1: .u32() function (most common in stellar-sdk v11)
  try {
    if (typeof scVal.u32 === "function") {
      const v = scVal.u32();
      if (typeof v === "number" && !isNaN(v)) return v;
    }
  } catch {}

  // Method 2: ._value (internal property)
  try {
    if (typeof scVal._value === "number" && !isNaN(scVal._value)) {
      return scVal._value;
    }
  } catch {}

  // Method 3: .value() method
  try {
    if (typeof scVal.value === "function") {
      const v = scVal.value();
      if (typeof v === "number" && !isNaN(v)) return v;
    }
  } catch {}

  // Method 4: Re-parse the raw XDR bytes
  try {
    const hex    = scVal.toXDR("hex");
    const parsed = xdr.ScVal.fromXDR(hex, "hex");
    if (parsed.switch().name === "scvU32") {
      return parsed.u32();
    }
  } catch {}

  // Method 5: Check if it wraps an Ok result (Result<u32, Error>)
  try {
    const inner = scVal._value?._value;
    if (typeof inner === "number" && !isNaN(inner)) return inner;
  } catch {}

  return null;
}

// ── Core transaction: build → simulate → assemble → sign → send → confirm ─────
async function buildSignSend(publicKey, operation) {
  const server  = new SorobanRpc.Server(RPC_URL);
  const account = await server.getAccount(publicKey);

  // 1. Build unsigned transaction
  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASS,
  })
    .addOperation(operation)
    .setTimeout(60)
    .build();

  // 2. Simulate to get Soroban resource footprint + auth entries
  const sim = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    // Parse friendly contract errors from the simulation log
    const raw = sim.error ?? "";
    if (raw.includes("Error(Contract, #2)") || raw.includes("UnauthorizedClient")) {
      throw new Error(
        "Unauthorised: Your connected wallet is not the client who created this escrow. " +
        "You must use the same wallet address that was used to create escrow. " +
        "Create a fresh escrow first with this wallet."
      );
    }
    if (raw.includes("Error(Contract, #1)") || raw.includes("EscrowNotFound")) {
      throw new Error(
        "Escrow not found: No escrow exists with that ID. " +
        "Double-check the number. Your escrow IDs are shown in Transaction History."
      );
    }
    if (raw.includes("Error(Contract, #3)") || raw.includes("AlreadyCompleted")) {
      throw new Error(
        "This escrow is already completed (Released or Refunded). " +
        "It cannot be acted on again."
      );
    }
    throw new Error(`Simulation failed: ${raw}`);
  }

  // 3. Assemble — injects soroban data, resource fees, and auth entries
  tx = SorobanRpc.assembleTransaction(tx, sim).build();

  // 4. Sign with Freighter
  // ── FIX #1: "Bad union switch: 4" ──────────────────────────────────────────
  // Freighter v2 returns { signedTxXdr: "..." } NOT a plain string.
  // Passing the object to fromXDR() corrupts the XDR union → crash.
  const signResult = await signTransaction(tx.toXDR(), {
    network: "TESTNET",
    networkPassphrase: NETWORK_PASS,
  });

  const signedXdr =
    typeof signResult === "string"
      ? signResult
      : (signResult?.signedTxXdr ?? signResult?.xdr ?? null);

  if (!signedXdr || typeof signedXdr !== "string") {
    throw new Error(
      "Transaction signing was cancelled or Freighter did not return a signed transaction. " +
      "Please try again and approve the transaction in Freighter."
    );
  }
  // ───────────────────────────────────────────────────────────────────────────

  // 5. Submit
  const finalTx    = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASS);
  const sendResult = await server.sendTransaction(finalTx);

  if (sendResult.status === "ERROR") {
    throw new Error(
      "Transaction was rejected by the network: " +
      (sendResult.errorResult?.toString() ?? "unknown error")
    );
  }

  // 6. Poll for confirmation (up to 30 seconds)
  const hash = sendResult.hash;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const r = await server.getTransaction(hash);
    if (r.status === "SUCCESS") {
      return { hash, result: r.returnValue };
    }
    if (r.status === "FAILED") {
      throw new Error(
        "Transaction was accepted but failed on-chain. Check Stellar Expert for details."
      );
    }
    // status === "NOT_FOUND" means still pending — keep polling
  }

  throw new Error(
    "Timeout waiting for confirmation (30s). " +
    "Your transaction may still confirm — check Stellar Expert: " +
    txLink(hash)
  );
}

// ── Contract call wrappers ────────────────────────────────────────────────────

export async function createEscrow(publicKey, freelancer, amountXlm) {
  if (!freelancer || !/^G[A-Z2-7]{55}$/.test(freelancer)) {
    throw new Error(
      "Invalid freelancer address. Must be a 56-character Stellar address starting with G."
    );
  }

  const xlm = parseFloat(amountXlm);
  if (isNaN(xlm) || xlm <= 0) {
    throw new Error("Amount must be a positive number (e.g. 10).");
  }

  const op = new Contract(CONTRACT_ID).call(
    "create_escrow",
    new Address(publicKey).toScVal(),
    new Address(freelancer).toScVal(),
    nativeToScVal(stroopsFromXlm(xlm), { type: "i128" })
  );

  const { hash, result } = await buildSignSend(publicKey, op);

  // ── FIX #3: extract the returned u32 escrow ID reliably ────────────────────
  const escrowId = extractU32(result);
  // ───────────────────────────────────────────────────────────────────────────

  return { hash, escrowId };
}

export async function releaseEscrow(publicKey, escrowIdRaw) {
  // ── FIX #2: validate before building XDR ───────────────────────────────────
  const id = parseEscrowId(escrowIdRaw);
  // ───────────────────────────────────────────────────────────────────────────

  const op = new Contract(CONTRACT_ID).call(
    "release",
    new Address(publicKey).toScVal(),
    nativeToScVal(id, { type: "u32" })
  );

  return buildSignSend(publicKey, op);
}

export async function refundEscrow(publicKey, escrowIdRaw) {
  const id = parseEscrowId(escrowIdRaw);

  const op = new Contract(CONTRACT_ID).call(
    "refund",
    new Address(publicKey).toScVal(),
    nativeToScVal(id, { type: "u32" })
  );

  return buildSignSend(publicKey, op);
}

// Balance cache — avoids hammering RPC (30s TTL)
const _cache = {};
export async function getCachedBalance(pk) {
  const now = Date.now();
  if (_cache[pk] && now - _cache[pk].t < 30_000) return _cache[pk].v;
  const v = await getXlmBalance(pk);
  _cache[pk] = { v, t: now };
  return v;
}
