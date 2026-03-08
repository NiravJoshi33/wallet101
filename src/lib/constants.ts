export const PHASES = [
  'landing',
  'module1',
  'module2',
  'module3',
  'memorize',
  'type',
  'win',
  'fail',
] as const

export type Phase = (typeof PHASES)[number]

export const MEMORIZE_TIME_EASY = 30
export const MEMORIZE_TIME_HARD = 20

export const DERIVATION_PATHS = {
  solana: "m/44'/501'/0'/0'",
  ethereum: "m/44'/60'/0'/0'",
  bitcoin: "m/44'/0'/0'/0'",
} as const

export type Chain = keyof typeof DERIVATION_PATHS

export const SCENE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

export const FAKE_BALANCE_SOL = 12847.5
export const SOL_PRICE_USD = 100

export const PHASE_ROUTES: Record<Phase, string> = {
  landing: '/',
  module1: '/module1',
  module2: '/module2',
  module3: '/module3',
  memorize: '/memorize',
  type: '/type',
  win: '/win',
  fail: '/fail',
}
