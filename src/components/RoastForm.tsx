"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, SendHorizonal, Skull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type RoastResponse = {
  roast: string
  score: number
  error?: string
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
    } catch (error) {
      setResult({ roast: "My connection to the dark side is broken.", score: 0 })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 0) return "text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
    if (score < 5) return "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]"
    return "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]"
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10 relative z-10">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center gap-3">
          <Flame className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-2xl">
            Velvet Roast
          </h1>
          <Flame className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-md mx-auto">
          Submit your best pickup line. Prepare to be destroyed.
        </p>
      </motion.div>

      {/* INPUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-neutral-900/95 border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
          <CardContent className="p-6 md:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <Input
                  placeholder="e.g. Do you believe in love at first sight?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-16 px-6 text-lg md:text-xl bg-black/70 border-white/10 focus:border-primary/60 text-white placeholder:text-gray-500 rounded-xl transition-all shadow-lg focus:shadow-[0_0_30px_rgba(220,38,38,0.2)] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full bg-primary hover:bg-primary/90 text-white text-lg font-semibold tracking-wide rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all hover:shadow-[0_0_35px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Skull className="w-5 h-5" />
                    </motion.div>
                    <span>Judging...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Roast Me</span>
                    <SendHorizonal className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* RESULT SECTION */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
            <div className="bg-black/90 border border-white/20 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm uppercase tracking-[0.3em] text-gray-500 font-medium">Verdict</span>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className={`text-7xl md:text-9xl font-black font-serif ${getScoreColor(result.score)}`}
                  >
                    {result.score}/10
                  </motion.div>
                </div>

                <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-200 font-serif italic leading-relaxed max-w-lg mx-auto"
                >
                  "{result.roast}"
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
