# SeedSchool — Product Requirements Document

**Version:** 1.0  
**Date:** March 2026  
**Author:** TBD  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

SeedSchool is an interactive, animation-driven web app that teaches users how crypto wallets work — from seed phrase generation to address derivation — using a Keychron K2-inspired keyboard UI (Keyb component) as the primary interaction medium. It is simultaneously a learning tool, a memory drill, and a shareable experience.

### 1.2 Problem Statement

Most crypto newcomers don't understand what a seed phrase is, why it matters, or how it becomes a wallet address. Existing resources are either too shallow (YouTube explainers) or too deep (BIPs and whitepapers). Nobody has built an interactive, visual, hands-on journey through this flow.

### 1.3 Goals

- Teach the full journey: Seed Phrase → Master Seed → Private Key → Public Key → Wallet Address
- Make every step interactive and tactile using the Keyb keyboard component
- Create a "fail state" dramatic enough to be shared on X/Twitter
- Be Solana-first, with architecture that supports other chains later
- Serve as a trust-building tool in the Seedpay ecosystem

### 1.4 Non-Goals

- Not a real wallet — no real keys, no blockchain interaction
- Not a password manager or seed phrase storage tool
- No backend, no user accounts, no data collection

---

## 2. Target Users

| Persona                     | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| **Crypto Newcomer**         | Bought their first token, doesn't understand custody or seed phrases   |
| **Self-Custody Learner**    | Moving from exchange to self-custody, wants to understand the risk     |
| **Developer Onboarding**    | New Solana dev who needs to grok wallet derivation                     |
| **Security-Conscious User** | Wants to practice seed phrase recall without risking their real phrase |

---

## 3. Core User Journey

```
Landing → Module 1: What is a Seed Phrase?
       → Module 2: Phrase to Master Seed (visual derivation)
       → Module 3: Master Seed to Wallet Address (Solana)
       → Module 4: Memory Drill (type it back)
       → Win State / Fail State
       → Share Score / Restart
```

Each module is a full-screen "scene" with animated transitions between them.

---

## 4. Modules — Detailed Specs

### Module 0 — Landing / Hook Screen

**Goal:** Instantly communicate what this is and why it matters.

**UI:**

- Dark background, cinematic entrance animation
- Headline: _"12 words. Your entire crypto life."_
- Subtext: _"Do you actually understand what that means?"_
- Animated Keyb keyboard fades in below the headline, keys lighting up one by one spelling out a sample seed word
- CTA button: **"Find out →"**

**Animations:**

- `framer-motion` page entrance with staggered text reveal
- Keyb keys light up sequentially using `useEffect` + state loop
- Subtle particle background using `tsparticles` or `@react-three/fiber` fog effect

---

### Module 1 — What is a Seed Phrase?

**Goal:** User understands what a seed phrase is, its source (BIP-39), and its weight.

**UI:**

- A "hardware wallet card" styled component slides in with 12 blank word slots
- Words reveal one by one with a typewriter animation
- Each word has a tooltip: _"Word 4 of 2048 possible BIP-39 words"_
- User must **type each word** on the Keyb keyboard to "accept" the phrase
- Paste disabled (`onPaste`, `onDrop` blocked)
- Progress bar at top

**Animations:**

- `framer-motion` `AnimatePresence` for word slot reveals
- Keyb key press triggers a ripple/glow on the active key
- Correct word typed → slot turns green with a satisfying checkmark pop (`spring` animation)
- Wrong letter → key shakes (`keyframes` with `framer-motion`)

**Libraries:** `bip39`, `framer-motion`

**What user learns:**

- Seed phrases come from a fixed 2048-word list
- The order of words matters
- These words are your wallet — not a password, the actual key

---

### Module 2 — Phrase → Master Seed (The Magic)

**Goal:** Show the cryptographic transformation visually. No typing — pure animation.

**UI:**

- Split screen: left shows the 12 words, right shows the output hex string
- Animated "hashing" visual — words flow into a blender-like animation and emerge as a 128-character hex string
- Labels explain: _"PBKDF2 + HMAC-SHA512 + 2048 iterations = your 512-bit master seed"_
- A slider lets user change the optional passphrase field → hex string updates live, teaching that even one extra character = completely different wallet

**Animations:**

- Words dissolve into particles using `framer-motion` custom path animations
- Hex characters count up in a scramble effect (`react-scramble` or custom hook)
- Passphrase slider input causes a ripple re-scramble of the hex output
- Background shifts from dark blue → deep purple to signal "we're going deeper"

**Libraries:** `framer-motion`, `bip39`, `@noble/hashes` (for live PBKDF2 demo)

**What user learns:**

- Deterministic derivation: same words → always same seed
- Optional passphrase = 25th word, creates entirely different wallet
- Why "brain wallet" passphrases are dangerous if weak

---

### Module 3 — Master Seed → Solana Wallet Address

**Goal:** Show the full derivation path to a real-looking Solana address.

**UI:**

- Animated "path tree" visualization — a branching diagram showing:
  - Master seed at root
  - Derivation path: `m/44'/501'/0'/0'`
  - Each level of the path labeled (purpose / coin type / account / change)
  - Ed25519 curve label with a tooltip explanation
  - Final leaf: the Base58 Solana public address
- User "clicks" each node on the path tree using the keyboard (arrow keys) to reveal the next step
- Address is displayed styled like a Phantom wallet — identicon + truncated address

**Animations:**

- Path tree draws itself with `framer-motion` SVG path animation (`pathLength`)
- Each node pulses when active
- Final address "assembles" character by character with a typewriter + glow effect
- Chain selector (Solana / Ethereum / Bitcoin) morphs the path and address format using layout animations

**Libraries:** `framer-motion`, `@solana/web3.js`, `ed25519-hd-key`, `bs58`

**What user learns:**

- Derivation paths determine which address you get
- Solana uses ed25519, not secp256k1 like ETH/BTC
- Same seed → different address on different chains
- Public address is safe to share; the path that generated it is not secret either

---

### Module 4 — The Memory Drill

**Goal:** Test recall. Make it feel real. Make failure hurt emotionally.

#### 4a — Memorize Phase

**UI:**

- The seed phrase displayed on a styled "paper wallet" card
- Large countdown timer (30 seconds default, 20s on hard mode)
- Timer bar depletes with color shift: green → yellow → red
- Pulsing urgency animation in final 10 seconds
- _"I've memorized it"_ button to proceed early
- At 0 seconds — card flips over and is gone

**Animations:**

- `framer-motion` card flip on timeout (3D `rotateY`)
- Timer bar uses `motion` with `transition: { duration: 30, ease: "linear" }`
- Final 5 seconds: screen edges pulse red (`box-shadow` animation)

#### 4b — Type Phase

**UI:**

- 12 blank slots, one per word
- User types using Keyb keyboard — it's the primary input, not native keyboard (or both synced)
- Active slot highlighted
- BIP-39 autocomplete dropdown (max 5 suggestions filtered from wordlist)
- No paste, no drag-drop
- Submit button only active when all 12 slots filled

**Animations:**

- Active Keyb key glows on each press
- Correct word → green fill + bounce
- Slot focus transition is smooth spring
- Autocomplete dropdown slides in with `AnimatePresence`

#### 4c — Win State

**UI:**

- Screen floods with a warm gold glow
- Headline: _"Your wallet is safe."_
- Subtext: _"You're in the 1% of crypto users who actually know their seed phrase."_
- Stats card: time taken, difficulty, attempts
- Confetti burst using `canvas-confetti`
- CTAs: **"Try 24 words"** | **"Share your score"** | **"Learn more about Solana wallets"**

**Animations:**

- `framer-motion` scale + opacity entrance for all elements with stagger
- `canvas-confetti` burst on mount
- Stats card flips in one by one

#### 4d — Fail State (The Viral Moment)

**UI:**

- Screen cuts to black with a 200ms delay (the pause before the horror)
- Red text fades in: _"Wallet access lost."_
- Below it, a fake blockchain explorer card:
  - Wallet address (the one from Module 3)
  - Transaction: _"All funds transferred. 2 minutes ago."_
  - Random dramatic balance: _"◎ 12,847.50 SOL — $1,284,750"_
- Small print at bottom: _"This is a simulation. But this is exactly what happens when you forget."_
- Restart button: **"Practice again →"**

**Animations:**

- Screen flash to black: `framer-motion` `opacity: [1, 0]` over 200ms
- Red text glitches in using a custom CSS glitch keyframe animation
- Fake explorer card slides up from bottom, rows populate one by one
- Balance number counts up dramatically using `react-countup`
- Subtle scanline/CRT overlay using CSS for the hacker terminal feel

**Libraries:** `framer-motion`, `canvas-confetti`, `react-countup`

---

## 5. Animation System — Global Principles

| Principle                              | Implementation                                                      |
| -------------------------------------- | ------------------------------------------------------------------- |
| **Every transition is a scene change** | Full-screen `AnimatePresence` with slide/fade between modules       |
| **Keyboard is always alive**           | Keyb component persists across modules, adapts per context          |
| **Sound reinforces action**            | Keyb's `enableSound` + `enableHaptics` on throughout                |
| **Color tells the story**              | Dark blue (learn) → purple (derive) → black/red (fail) → gold (win) |
| **Nothing is instant**                 | Minimum 300ms for any state change, users should feel each step     |

---

## 6. Technical Architecture

### 6.1 Stack

| Layer        | Choice                                                                |
| ------------ | --------------------------------------------------------------------- |
| Framework    | React 18 + Vite                                                       |
| Styling      | Tailwind CSS                                                          |
| Animations   | `framer-motion` (primary), CSS keyframes (glitch effects)             |
| Keyboard UI  | `keyb` (Keychron K2 component from keyb.vercel.app)                   |
| Crypto       | `bip39`, `@solana/web3.js`, `ed25519-hd-key`, `@noble/hashes`, `bs58` |
| Particles/FX | `tsparticles` or `@react-three/fiber`                                 |
| Confetti     | `canvas-confetti`                                                     |
| Counters     | `react-countup`                                                       |
| Routing      | `react-router-dom` (hash router, no backend needed)                   |

### 6.2 Key Libraries

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "bip39": "^3.x",
    "@solana/web3.js": "^1.x",
    "ed25519-hd-key": "^1.x",
    "@noble/hashes": "^1.x",
    "bs58": "^5.x",
    "canvas-confetti": "^1.x",
    "react-countup": "^6.x",
    "tsparticles": "^3.x",
    "tailwindcss": "^3.x"
  }
}
```

### 6.3 State Management

Simple React context — no Redux needed. One `GameContext` that holds:

```ts
type GameState = {
  phase:
    | "landing"
    | "module1"
    | "module2"
    | "module3"
    | "memorize"
    | "type"
    | "win"
    | "fail";
  seedPhrase: string[]; // generated BIP-39 phrase
  userInput: string[]; // user's typed words
  derivedAddress: string; // Solana public address
  timeSpent: number; // seconds taken
  difficulty: "easy" | "hard"; // 30s vs 20s memorize window
  attempts: number; // how many tries
};
```

### 6.4 Security & Privacy

- All cryptographic operations run **100% client-side**
- No seed phrase, private key, or derived address ever leaves the browser
- Prominent disclaimer on landing: _"This app generates fake wallets for learning. Never enter your real seed phrase anywhere online."_
- No analytics that capture input data

---

## 7. Component Tree

```
App
├── GameProvider (context)
├── Router
│   ├── LandingScene
│   │   └── AnimatedKeyb
│   ├── Module1Scene
│   │   ├── SeedCard
│   │   ├── WordSlots
│   │   └── KeybWrapper
│   ├── Module2Scene
│   │   ├── HashingVisual
│   │   ├── HexDisplay
│   │   └── PassphraseSlider
│   ├── Module3Scene
│   │   ├── DerivationPathTree (SVG + framer)
│   │   ├── WalletAddressCard
│   │   └── ChainSelector
│   ├── MemorizeScene
│   │   ├── SeedCard
│   │   └── CountdownTimer
│   ├── TypeScene
│   │   ├── WordSlots
│   │   ├── KeybWrapper
│   │   └── BIP39Autocomplete
│   ├── WinScene
│   │   └── StatsCard
│   └── FailScene
│       └── FakeExplorerCard
└── GlobalAudioManager
```

---

## 8. Scope & Milestones

| Milestone           | Scope                                                     | Est. Time   |
| ------------------- | --------------------------------------------------------- | ----------- |
| **M1 — Core Shell** | Routing, GameContext, scene transitions, Keyb integration | 1 day       |
| **M2 — Module 1**   | BIP-39 generation, word slots, typing flow                | 1 day       |
| **M3 — Module 2**   | Hashing visual, hex scramble, passphrase slider           | 1.5 days    |
| **M4 — Module 3**   | Derivation path tree SVG, address generation              | 1.5 days    |
| **M5 — Drill**      | Memorize timer, type phase, win/fail states               | 1 day       |
| **M6 — Polish**     | Animations pass, sound tuning, mobile responsiveness      | 1 day       |
| **Total**           |                                                           | **~7 days** |

---

## 9. Success Metrics

| Metric                       | Target                                    |
| ---------------------------- | ----------------------------------------- |
| Module completion rate       | >60% reach Module 4                       |
| Fail state screenshot shares | Organic X/Twitter posts within first week |
| Time on site                 | >3 minutes average                        |
| Return visits                | Users come back to beat their score       |

---

## 10. Future Scope (v2)

- **Multi-chain support** — Ethereum (`m/44'/60'`), Bitcoin (`m/44'/0'`) with visual diff
- **24-word hard mode** — more words, shorter memorize window
- **Leaderboard** — scores stored on Solana as compressed state (no PII)
- **Seedpay integration** — CTA to Seedpay after completion
- **Mobile app** — React Native port with native haptics

---

## 11. Open Questions

1. Should Module 2 (hashing) be skippable for non-technical users?
2. Do we want a "beginner mode" that skips Module 2 and 3 entirely?
3. Should the fail state show a real Solana devnet transaction as extra drama?
4. Name: **SeedSchool**, **Wallet101**, **SeedDrill**, or something else?

---

_This document is a living spec. Update as decisions are made._
