import nodeCrypto from "node:crypto"
import os from "node:os"

export function getDeviceFingerprint(as?: "string"): string
export function getDeviceFingerprint(as: "bigint"): bigint

export function getDeviceFingerprint(as: "bigint" | "string" = "bigint"): string | bigint {
  const data = [os.hostname(), os.platform(), os.arch(), os.machine()].join("|")

  const fingerprint = nodeCrypto.createHash("sha256").update(data).digest("hex").slice(0, 40)

  return as === "bigint" ? BigInt(`0x${fingerprint}`) : fingerprint
}
