import rsaKeys from '../data/rsaKeys';

/**
 * RSAES-PKCS1-v1_5 encryption (public-key operation) with the same chunking as node-rsa,
 * so the 500 kB vendored node-rsa bundle is not needed on the request path.
 */

interface PublicKey {
  n: bigint;
  e: bigint;
  /** modulus length in bytes */
  size: number;
}

/** Read one DER TLV at `offset`, returning its content range and the offset just after it. */
function readTlv(der: Uint8Array, offset: number) {
  let length = der[offset + 1]!;
  let start = offset + 2;
  if (length & 0x80) {
    const lengthBytes = length & 0x7F;
    length = 0;
    for (let i = 0; i < lengthBytes; i++) {
      length = length * 256 + der[start + i]!;
    }
    start += lengthBytes;
  }
  return { tag: der[offset]!, start, end: start + length };
}

const bytesToBigInt = (bytes: Uint8Array) =>
  bytes.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);

/** Parse n and e from a PEM encoded SubjectPublicKeyInfo (RSA). */
function parsePublicKey(pem: string): PublicKey {
  const der = Uint8Array.from(atob(pem.replace(/-----[^-]+-----|\s/g, '')), (c) => c.charCodeAt(0));
  const spki = readTlv(der, 0);
  const algorithm = readTlv(der, spki.start);
  const bitString = readTlv(der, algorithm.end);
  // BIT STRING content starts with the "unused bits" byte, then RSAPublicKey SEQUENCE.
  const rsaKey = readTlv(der, bitString.start + 1);
  const modulus = readTlv(der, rsaKey.start);
  const exponent = readTlv(der, modulus.end);
  const modulusBytes = der.subarray(modulus.start, modulus.end);
  const n = bytesToBigInt(modulusBytes);
  return {
    n,
    e: bytesToBigInt(der.subarray(exponent.start, exponent.end)),
    size: Math.ceil(n.toString(2).length / 8),
  };
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  let b = base % modulus;
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % modulus;
    b = (b * b) % modulus;
    e >>= 1n;
  }
  return result;
}

/** Non-zero random bytes, as required by the PKCS#1 v1.5 type 2 padding string. */
function randomNonZeroBytes(length: number): Uint8Array {
  const out = new Uint8Array(length);
  let filled = 0;
  while (filled < length) {
    const batch = crypto.getRandomValues(new Uint8Array(length - filled));
    for (const byte of batch) {
      if (byte !== 0) out[filled++] = byte;
    }
  }
  return out;
}

function encryptBlock(block: Uint8Array, key: PublicKey): Uint8Array {
  const padded = new Uint8Array(key.size);
  padded[1] = 2;
  padded.set(randomNonZeroBytes(key.size - block.length - 3), 2);
  padded.set(block, key.size - block.length);
  const cipher = modPow(bytesToBigInt(padded), key.e, key.n);
  const out = new Uint8Array(key.size);
  let rest = cipher;
  for (let i = key.size - 1; i >= 0; i--) {
    out[i] = Number(rest & 0xFFn);
    rest >>= 8n;
  }
  return out;
}

let cachedKey: PublicKey | undefined;

const encryptRequestContent = (req: Record<string, any>): string => {
  const key = (cachedKey ??= parsePublicKey(rsaKeys.publicKey));
  const data = new TextEncoder().encode(JSON.stringify(req));
  const maxBlock = key.size - 11;
  // Same split as node-rsa: equal-sized chunks, as few as possible.
  const chunkCount = Math.ceil(data.length / maxBlock) || 1;
  const chunkSize = Math.ceil(data.length / chunkCount || 1);
  const out = new Uint8Array(chunkCount * key.size);
  for (let i = 0; i < chunkCount; i++) {
    out.set(encryptBlock(data.subarray(i * chunkSize, (i + 1) * chunkSize), key), i * key.size);
  }
  // Block by block: spreading the whole array overflows JSC's argument limit (iOS WebView) on large payloads.
  let binary = '';
  for (let i = 0; i < out.length; i += key.size) {
    binary += String.fromCharCode(...out.subarray(i, i + key.size));
  }
  return btoa(binary);
};
export default encryptRequestContent;
