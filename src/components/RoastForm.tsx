"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, SendHorizontal, Loader2, Star, Flame, Calculator, Zap, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type RoastResponse = {
  roast: string
  score: number
  error?: string
}

function ProcessingAnimation() {
  const [score, setScore] = useState(5.0)
  const [phase, setPhase] = useState(0)
  
  const phases = [
    { text: "Skaneerin lantimislauset...", icon: Scan },
    { text: "Arvutan Rizz taset...", icon: Calculator },
    { text: "Konsulteerin Cupidoga...", icon: Heart },
    { text: "Genereerin hinnangut...", icon: Zap },
  ]

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore(Math.random() * 10)
    }, 50)

    const phaseInterval = setInterval(() => {
      setPhase((p) => (p + 1) % phases.length)
    }, 800)

    return () => {
      clearInterval(scoreInterval)
      clearInterval(phaseInterval)
    }
  }, [])

  const CurrentIcon = phases[phase].icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      className="glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-rose-500/20 my-4"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20 bg-rose-500 rounded-full" />
          <div className="w-20 h-20 rounded-full bg-black/40 border border-rose-500/30 flex items-center justify-center backdrop-blur-md">
            <CurrentIcon className="w-10 h-10 text-rose-400" />
          </div>
        </div>

        <div className="space-y-2">
          <motion.div 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-rose-200/80 font-mono text-sm uppercase tracking-widest"
          >
            {phases[phase].text}
          </motion.div>
          
          <div className="flex items-center justify-center gap-1 font-mono text-5xl font-bold text-white tabular-nums tracking-tighter">
            <span className="text-rose-500/50">&gt;</span>
            {score.toFixed(1)}
            <span className="animate-pulse text-rose-500">_</span>
          </div>
        </div>

        <div className="w-full max-w-[200px] h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-600 to-pink-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function RoastForm() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RoastResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupLine: input }),
      })
      const data = await res.json()
      setResult(data)
    } catch (_error) {
      setResult({ roast: "Ups, Cupidil sai vist nooled otsa. Proovi uuesti!", score: 0 })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 4) return "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]"
    if (score < 8) return "text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]"
    return "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 relative z-10 px-4">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4 mb-4"
      >
        <div className="inline-flex items-center justify-center gap-2 p-3 rounded-full bg-rose-500/10 backdrop-blur-sm border border-rose-500/20 mb-4 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-sm font-semibold text-rose-200 uppercase tracking-widest">Love Guru AI</span>
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 pb-2 drop-shadow-sm">
          Rizz Rater
        </h1>
        
        <p className="text-lg text-pink-200/70 font-light max-w-lg mx-auto leading-relaxed">
          Analüüsin sinu pickup line'i, et seda paremaks muuta!
        </p>
      </motion.div>

      {/* RESULT / PROCESSING SECTION */}
      <AnimatePresence mode="wait">
        {loading ? (
          <ProcessingAnimation key="processing" />
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="relative mt-4"
          >
            <div className="glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group border border-rose-500/10">
              
              {/* Decorative background gradients within card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-pink-500/20 transition-all duration-700" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-pink-200/50 flex items-center gap-2">
                    <Flame className="w-3 h-3 text-orange-500" />
                    Rizz Score
                    <Flame className="w-3 h-3 text-orange-500" />
                  </span>
                  <div className="flex items-center justify-center relative my-2">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                      className={`text-8xl md:text-9xl font-black tracking-tighter ${getScoreColor(result.score)}`}
                      style={{ textShadow: "0 0 40px currentColor" }}
                    >
                      {result.score}
                    </motion.div>
                    <span className="text-3xl text-pink-200/20 absolute -right-8 top-4 font-thin">/10</span>
                  </div>
                  
                  {/* Heart Rating Visual */}
                  <div className="flex gap-2 mt-2">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.05) }}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors duration-500 ${
                            i < result.score 
                              ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
                              : "text-rose-900/40"
                          }`} 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent my-4" />

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-pink-100 font-light leading-relaxed max-w-2xl mx-auto italic"
                >
                  &ldquo;{result.roast}&rdquo;
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* INPUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-panel border-0 overflow-hidden ring-1 ring-rose-500/20 shadow-[0_8px_32px_rgba(244,63,94,0.1)]">
          <CardContent className="p-1">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 p-2">
              <div className="relative flex-grow group">
                <Input
                  placeholder="Sisesta oma parim lantimislause..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-14 px-6 text-lg bg-black/40 border-transparent focus:border-rose-500/50 text-white placeholder:text-pink-200/30 rounded-xl transition-all focus:bg-black/60 focus-visible:ring-0 focus-visible:ring-offset-0 selection:bg-rose-500/30"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 border-t border-white/10"
                disabled={loading || !input.trim()}
              >
                {/* Asendasin laadija tavalise nupuga, sest animatsioon on nüüd keskel */}
                <div className="flex items-center gap-2">
                  <span>Hinda</span>
                  <Sparkles className="w-5 h-5 fill-white/20" />
                </div>
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  )
}
