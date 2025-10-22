import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const AUDIT_PATH = path.join(process.cwd(), "content", "audit-log.json");

export type AuditEntry = {
  id: string;
  resource: string;
  action: "create" | "update" | "delete";
  userId: string;
  before?: unknown;
  after?: unknown;
  timestamp: string;
};

async function ensureAuditFile() {
  try {
    await fs.access(AUDIT_PATH);
  } catch {
    await fs.mkdir(path.dirname(AUDIT_PATH), { recursive: true });
    await fs.writeFile(AUDIT_PATH, "[]\n", "utf8");
  }
}

export async function appendAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">) {
  await ensureAuditFile();
  const file = await fs.readFile(AUDIT_PATH, "utf8");
  const data = JSON.parse(file) as AuditEntry[];
  const payload: AuditEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  data.unshift(payload);
  await fs.writeFile(AUDIT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readAuditLog(limit = 100) {
  try {
    await ensureAuditFile();
    const file = await fs.readFile(AUDIT_PATH, "utf8");
    const data = JSON.parse(file) as AuditEntry[];
    return data.slice(0, limit);
  } catch {
    return [];
  }
}
