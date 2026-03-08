import * as bip39 from 'bip39'
import { hmac } from '@noble/hashes/hmac.js'
import { sha512 } from '@noble/hashes/sha2.js'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import { DERIVATION_PATHS, type Chain } from './constants'

export function generateMnemonic(): string[] {
  const mnemonic = bip39.generateMnemonic()
  return mnemonic.split(' ')
}

export function getWordlist(): string[] {
  return bip39.wordlists.english
}

export function validateWord(word: string): boolean {
  return bip39.wordlists.english.includes(word.toLowerCase())
}

export function filterWordlist(prefix: string, max = 5): string[] {
  if (!prefix) return []
  const lower = prefix.toLowerCase()
  return bip39.wordlists.english
    .filter((w) => w.startsWith(lower))
    .slice(0, max)
}

export function mnemonicToSeed(words: string[], passphrase = ''): string {
  const mnemonic = words.join(' ')
  const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase)
  return Buffer.from(seed).toString('hex')
}

// SLIP-0010 / ed25519 HD key derivation (browser-compatible)
// Replaces ed25519-hd-key which depends on Node.js stream module
function deriveEd25519Path(path: string, seedHex: string): Uint8Array {
  const ED25519_CURVE = 'ed25519 seed'
  const HARDENED_OFFSET = 0x80000000

  // Parse path segments
  const segments = path
    .split('/')
    .slice(1) // remove 'm'
    .map((s) => {
      const hardened = s.endsWith("'")
      const index = parseInt(hardened ? s.slice(0, -1) : s, 10)
      return hardened ? index + HARDENED_OFFSET : index
    })

  // Master key from seed
  const seedBytes = hexToBytes(seedHex)
  let I = hmac(sha512, new TextEncoder().encode(ED25519_CURVE), seedBytes)
  let key = I.slice(0, 32)
  let chainCode = I.slice(32)

  // Derive child keys
  for (const index of segments) {
    const data = new Uint8Array(37)
    data[0] = 0x00
    data.set(key, 1)
    data[33] = (index >>> 24) & 0xff
    data[34] = (index >>> 16) & 0xff
    data[35] = (index >>> 8) & 0xff
    data[36] = index & 0xff

    I = hmac(sha512, chainCode, data)
    key = I.slice(0, 32)
    chainCode = I.slice(32)
  }

  return key
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

export function deriveKeypair(
  seedHex: string,
  chain: Chain = 'solana'
): { publicKey: string; publicKeyBytes: Uint8Array } {
  const path = DERIVATION_PATHS[chain]
  const key = deriveEd25519Path(path, seedHex)
  const keypair = Keypair.fromSeed(key)
  return {
    publicKey: bs58.encode(keypair.publicKey.toBytes()),
    publicKeyBytes: keypair.publicKey.toBytes(),
  }
}

export function truncateAddress(address: string): string {
  if (address.length <= 8) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function getMockAddress(chain: Chain): string {
  switch (chain) {
    case 'ethereum':
      return '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18'
    case 'bitcoin':
      return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    default:
      return ''
  }
}
