import { randomUUID } from "node:crypto";
import { open, readFile, rename, rm } from "node:fs/promises";
import { dirname } from "node:path";
import type { Snapshot } from "./github.ts";

export type PendingDelivery = { token: string; output: string; exitCode: number; snapshot: Snapshot };
export type DeliveryState = {
  schemaVersion: 2;
  prUrl: string;
  previous: Snapshot | null;
  pending: PendingDelivery | null;
  lastAcknowledged: string | null;
};
type SnapshotParser = (value: unknown) => Snapshot;

function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid delivery state");
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) throw new Error("Invalid delivery state string");
  return value;
}
function boundSnapshot(value: unknown, expectedUrl: string, parse: SnapshotParser): Snapshot {
  const snapshot = parse(value);
  if (snapshot.facts.url.toLowerCase() !== expectedUrl.toLowerCase()) throw new Error("State file belongs to another PR");
  return snapshot;
}
function deliveryEvent(value: unknown, expectedUrl: string): Record<string, unknown> {
  const event = record(value);
  if (event.schemaVersion !== 1 || !["SNAPSHOT", "ACTIVITY", "READY", "CLOSED"].includes(String(event.kind)) ||
    !Array.isArray(event.reasons) || !event.reasons.every((reason) => typeof reason === "string"))
    throw new Error("Invalid pending delivery event");
  const snapshot = record(event.snapshot);
  if (snapshot.schemaVersion !== 1 || text(record(snapshot.facts).url).toLowerCase() !== expectedUrl.toLowerCase())
    throw new Error("Pending output belongs to another PR");
  return event;
}
async function save(path: string, state: DeliveryState): Promise<void> {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    const file = await open(temporary, "wx", 0o600);
    try {
      await file.writeFile(`${JSON.stringify(state)}\n`);
      await file.sync();
    } finally { await file.close(); }
    await rename(temporary, path);
    const directory = await open(dirname(path), "r");
    try { await directory.sync(); } finally { await directory.close(); }
  } finally { await rm(temporary, { force: true }); }
}

// One watcher owns each state file. Acknowledgment and the next wait use one invocation.
export async function loadDelivery(
  path: string, expectedUrl: string, parse: SnapshotParser, acknowledgment?: string,
): Promise<DeliveryState> {
  let value: unknown;
  try { value = JSON.parse(await readFile(path, "utf8")); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    if (acknowledgment !== undefined) throw new Error("Cannot acknowledge an event without saved state");
    return { schemaVersion: 2, prUrl: expectedUrl, previous: null, pending: null, lastAcknowledged: null };
  }
  const row = record(value);
  let state: DeliveryState;
  if (row.schemaVersion === 1) {
    // Legacy snapshots have already been consumed; retain their cursor on upgrade.
    state = { schemaVersion: 2, prUrl: expectedUrl, previous: boundSnapshot(value, expectedUrl, parse), pending: null, lastAcknowledged: null };
  } else {
    if (row.schemaVersion !== 2) throw new Error("Unsupported delivery state schema");
    if (text(row.prUrl).toLowerCase() !== expectedUrl.toLowerCase()) throw new Error("State file belongs to another PR");
    let pending: PendingDelivery | null = null;
    if (row.pending !== null) {
      const p = record(row.pending);
      const output = text(p.output), token = text(p.token);
      const event = deliveryEvent(JSON.parse(output), expectedUrl);
      if (event.deliveryToken !== token || p.exitCode !== 0)
        throw new Error("Invalid pending delivery");
      pending = { output, token, exitCode: 0, snapshot: boundSnapshot(p.snapshot, expectedUrl, parse) };
    }
    state = {
      schemaVersion: 2, prUrl: expectedUrl,
      previous: row.previous === null ? null : boundSnapshot(row.previous, expectedUrl, parse),
      pending, lastAcknowledged: row.lastAcknowledged === null ? null : text(row.lastAcknowledged),
    };
    if (pending !== null && pending.token === state.lastAcknowledged) throw new Error("Invalid reused delivery token");
  }
  if (acknowledgment !== undefined) {
    if (state.pending?.token === acknowledgment) {
      state = { ...state, previous: state.pending.snapshot, pending: null, lastAcknowledged: acknowledgment };
      await save(path, state);
    } else if (state.lastAcknowledged !== acknowledgment) {
      throw new Error("Acknowledgment does not match the pending event");
    }
  }
  return state;
}

export async function stageDelivery(
  path: string, state: DeliveryState, snapshot: Snapshot, renderedJson: string, exitCode = 0,
): Promise<PendingDelivery> {
  if (state.pending !== null) throw new Error("A pending event must be acknowledged before staging another");
  if (snapshot.facts.url.toLowerCase() !== state.prUrl.toLowerCase()) throw new Error("Snapshot belongs to another PR");
  const value = record(JSON.parse(renderedJson));
  if (value.kind === "TIMEOUT" || exitCode !== 0)
    throw new Error("Only snapshot events can be staged for delivery");
  const event = deliveryEvent(value, state.prUrl);
  const token = randomUUID();
  const pending = { token, output: JSON.stringify({ ...event, deliveryToken: token }), exitCode, snapshot };
  await save(path, { ...state, pending });
  return pending;
}
