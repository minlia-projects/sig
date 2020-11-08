

import { UVarInt } from "./varint"


/**
 * prefixed with bytes length
 * @category amino
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
export function encodeBinaryByteArray(bytes: Buffer): Buffer {
  const lenPrefix = bytes.length
  return Buffer.concat([UVarInt.encode(lenPrefix), bytes])
}

export * from "./varint"
