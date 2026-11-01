import { Buffer as BufferPolyfill } from 'buffer/';
import { describe, expect, it, vi } from 'vitest';
import rsaKeys from '../src/data/rsaKeys';
import encryptRequestContent from '../src/utils/encryptRequestContent';

// The vendored node-rsa expects the `buffer` package's Buffer (the app injects it at build time).
vi.stubGlobal('Buffer', BufferPolyfill);
const { default: NodeRSA } = await import('../src/utils/nodeRSA');
const { default: decryptRequestContent } = await import('../src/utils/decryptRequestContent');

/** Decrypt with the vendored node-rsa (the original implementation), returning the raw plaintext. */
function legacyDecrypt(cipher: string): string {
  const rsa = new NodeRSA(rsaKeys.privateKey);
  rsa.setOptions({ encryptionScheme: 'pkcs1' });
  return rsa.decrypt(cipher, 'utf8');
}

describe('encryptRequestContent', () => {
  const payloads: Record<string, unknown>[] = [
    {},
    { code: '' },
    { token: 'abc', stuNumber: '2020123456', schoolId: '12', campusId: '3' },
    // multi-byte characters
    { pointName: '测试路线·南京', note: 'é😀' },
    // exactly around the 117 byte single-block limit
    { a: 'x'.repeat(117 - 8) },
    { a: 'x'.repeat(117 - 7) },
    // multi-block payloads
    { a: 'y'.repeat(300) },
    { list: Array.from({ length: 80 }, (_, i) => ({ longitude: `118.79${i}`, latitude: `32.04${i}` })) },
  ];

  it.each(payloads.map((p, i) => [i, p] as const))('round-trips payload %i through node-rsa', (_i, payload) => {
    const cipher = encryptRequestContent(payload);
    expect(legacyDecrypt(cipher)).toBe(JSON.stringify(payload));
  });

  it('produces the same ciphertext length as node-rsa for the same payload', () => {
    const rsa = new NodeRSA(rsaKeys.privateKey);
    rsa.setOptions({ encryptionScheme: 'pkcs1' });
    for (const payload of payloads) {
      const legacy = rsa.encrypt(JSON.stringify(payload), 'base64');
      expect(encryptRequestContent(payload)).toHaveLength(legacy.length);
    }
  });

  it('encodes ciphertext larger than the engine argument limit', () => {
    const json = JSON.stringify({ a: 'z'.repeat(1_000_000) });
    const blocks = Math.ceil(json.length / 117);
    expect(encryptRequestContent({ a: 'z'.repeat(1_000_000) })).toHaveLength(Math.ceil((blocks * 128) / 3) * 4);
  });

  it('is randomized like PKCS#1 v1.5 type 2 padding', () => {
    expect(encryptRequestContent({ a: 1 })).not.toBe(encryptRequestContent({ a: 1 }));
  });

  it('round-trips through the in-app decoder', () => {
    const payload = { token: 't', n: 1 };
    expect(decryptRequestContent(encryptRequestContent(payload))).toEqual(payload);
  });
});
