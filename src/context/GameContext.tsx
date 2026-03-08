import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { generateMnemonic, mnemonicToSeed, deriveKeypair } from '@/lib/crypto'
import type { Phase, Chain } from '@/lib/constants'

interface GameState {
  phase: Phase
  seedPhrase: string[]
  userInput: string[]
  derivedAddress: string
  masterSeed: string
  passphrase: string
  timeSpent: number
  difficulty: 'easy' | 'hard'
  attempts: number
  selectedChain: Chain
  startTime: number | null
}

interface GameActions {
  generateSeedPhrase: () => void
  setPhase: (phase: Phase) => void
  setUserWord: (index: number, word: string) => void
  clearUserInput: () => void
  setPassphrase: (passphrase: string) => void
  setDifficulty: (difficulty: 'easy' | 'hard') => void
  setSelectedChain: (chain: Chain) => void
  incrementAttempts: () => void
  startTimer: () => void
  stopTimer: () => void
  checkAnswer: () => boolean
  resetGame: () => void
}

type GameContextValue = GameState & GameActions

const GameContext = createContext<GameContextValue | null>(null)

type Action =
  | { type: 'GENERATE_SEED'; seedPhrase: string[]; masterSeed: string; derivedAddress: string }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_USER_WORD'; index: number; word: string }
  | { type: 'CLEAR_USER_INPUT' }
  | { type: 'SET_PASSPHRASE'; passphrase: string; masterSeed: string; derivedAddress: string }
  | { type: 'SET_DIFFICULTY'; difficulty: 'easy' | 'hard' }
  | { type: 'SET_CHAIN'; chain: Chain; derivedAddress: string }
  | { type: 'INCREMENT_ATTEMPTS' }
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER'; timeSpent: number }
  | { type: 'RESET' }

const initialState: GameState = {
  phase: 'landing',
  seedPhrase: [],
  userInput: Array(12).fill(''),
  derivedAddress: '',
  masterSeed: '',
  passphrase: '',
  timeSpent: 0,
  difficulty: 'easy',
  attempts: 0,
  selectedChain: 'solana',
  startTime: null,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GENERATE_SEED':
      return {
        ...state,
        seedPhrase: action.seedPhrase,
        masterSeed: action.masterSeed,
        derivedAddress: action.derivedAddress,
        userInput: Array(12).fill(''),
      }
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'SET_USER_WORD': {
      const userInput = [...state.userInput]
      userInput[action.index] = action.word
      return { ...state, userInput }
    }
    case 'CLEAR_USER_INPUT':
      return { ...state, userInput: Array(12).fill('') }
    case 'SET_PASSPHRASE':
      return {
        ...state,
        passphrase: action.passphrase,
        masterSeed: action.masterSeed,
        derivedAddress: action.derivedAddress,
      }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty }
    case 'SET_CHAIN':
      return { ...state, selectedChain: action.chain, derivedAddress: action.derivedAddress }
    case 'INCREMENT_ATTEMPTS':
      return { ...state, attempts: state.attempts + 1 }
    case 'START_TIMER':
      return { ...state, startTime: Date.now() }
    case 'STOP_TIMER':
      return { ...state, timeSpent: action.timeSpent, startTime: null }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const generateSeedPhraseAction = useCallback(() => {
    const seedPhrase = generateMnemonic()
    const masterSeed = mnemonicToSeed(seedPhrase, '')
    const { publicKey } = deriveKeypair(masterSeed, 'solana')
    dispatch({
      type: 'GENERATE_SEED',
      seedPhrase,
      masterSeed,
      derivedAddress: publicKey,
    })
  }, [])

  const setPhase = useCallback((phase: Phase) => {
    dispatch({ type: 'SET_PHASE', phase })
  }, [])

  const setUserWord = useCallback((index: number, word: string) => {
    dispatch({ type: 'SET_USER_WORD', index, word })
  }, [])

  const clearUserInput = useCallback(() => {
    dispatch({ type: 'CLEAR_USER_INPUT' })
  }, [])

  const setPassphrase = useCallback(
    (passphrase: string) => {
      const masterSeed = mnemonicToSeed(state.seedPhrase, passphrase)
      const { publicKey } = deriveKeypair(masterSeed, state.selectedChain)
      dispatch({
        type: 'SET_PASSPHRASE',
        passphrase,
        masterSeed,
        derivedAddress: publicKey,
      })
    },
    [state.seedPhrase, state.selectedChain]
  )

  const setDifficulty = useCallback((difficulty: 'easy' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty })
  }, [])

  const setSelectedChain = useCallback(
    (chain: Chain) => {
      const { publicKey } = deriveKeypair(state.masterSeed, chain)
      dispatch({ type: 'SET_CHAIN', chain, derivedAddress: publicKey })
    },
    [state.masterSeed]
  )

  const incrementAttempts = useCallback(() => {
    dispatch({ type: 'INCREMENT_ATTEMPTS' })
  }, [])

  const startTimer = useCallback(() => {
    dispatch({ type: 'START_TIMER' })
  }, [])

  const stopTimer = useCallback(() => {
    const timeSpent = state.startTime
      ? Math.round((Date.now() - state.startTime) / 1000)
      : 0
    dispatch({ type: 'STOP_TIMER', timeSpent })
  }, [state.startTime])

  const checkAnswer = useCallback((): boolean => {
    return state.seedPhrase.every(
      (word, i) => word === state.userInput[i]?.toLowerCase().trim()
    )
  }, [state.seedPhrase, state.userInput])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      generateSeedPhrase: generateSeedPhraseAction,
      setPhase,
      setUserWord,
      clearUserInput,
      setPassphrase,
      setDifficulty,
      setSelectedChain,
      incrementAttempts,
      startTimer,
      stopTimer,
      checkAnswer,
      resetGame,
    }),
    [
      state,
      generateSeedPhraseAction,
      setPhase,
      setUserWord,
      clearUserInput,
      setPassphrase,
      setDifficulty,
      setSelectedChain,
      incrementAttempts,
      startTimer,
      stopTimer,
      checkAnswer,
      resetGame,
    ]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
