import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { GameProvider } from '@/context/GameContext'
import { GlobalAudioManager } from '@/audio/GlobalAudioManager'
import { RequireGameState } from '@/components/layout/RequireGameState'
import { LandingScene } from '@/scenes/LandingScene'
import { Module1Scene } from '@/scenes/Module1Scene'
import { Module2Scene } from '@/scenes/Module2Scene'
import { Module3Scene } from '@/scenes/Module3Scene'
import { MemorizeScene } from '@/scenes/MemorizeScene'
import { TypeScene } from '@/scenes/TypeScene'
import { WinScene } from '@/scenes/WinScene'
import { FailScene } from '@/scenes/FailScene'

function Protected({ children }: { children: React.ReactNode }) {
  return <RequireGameState>{children}</RequireGameState>
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingScene />} />
        <Route path="/module1" element={<Protected><Module1Scene /></Protected>} />
        <Route path="/module2" element={<Protected><Module2Scene /></Protected>} />
        <Route path="/module3" element={<Protected><Module3Scene /></Protected>} />
        <Route path="/memorize" element={<Protected><MemorizeScene /></Protected>} />
        <Route path="/type" element={<Protected><TypeScene /></Protected>} />
        <Route path="/win" element={<Protected><WinScene /></Protected>} />
        <Route path="/fail" element={<Protected><FailScene /></Protected>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GlobalAudioManager />
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </GameProvider>
  )
}
