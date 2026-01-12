"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, SendHorizontal, Loader2 } from "lucide-react"
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
    } catch (_error) {
      setResult({ roast: "Vabandust, tekkis tehniline viga. Proovi hiljem uuesti.", score: 0 })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    // Keep colors to show "quality" even if the text is mean
    if (score < 0) return "text-red-600"
    if (score < 5) return "text-orange-500"
    return "text-green-500"
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
          <Bot className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tight drop-shadow-sm">
            AI Abiline
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg mx-auto">
          Sinu isiklik ja professionaalne nõustaja. Küsi mida iganes.
        </p>
      </motion.div>

      {/* INPUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-white/5 border-white/10 shadow-xl backdrop-blur-md overflow-hidden relative">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <Input
                  placeholder="Kirjuta siia oma küsimus või tekst..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-14 px-6 text-lg bg-black/20 border-white/10 focus:border-blue-500/60 text-white placeholder:text-gray-500 rounded-lg transition-all shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium tracking-wide rounded-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analüüsin...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Saada</span>
                    <SendHorizontal className="w-5 h-5" />
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
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="bg-black/40 border border-white/10 rounded-xl p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
              
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Hinnang</span>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`text-6xl font-bold ${getScoreColor(result.score)}`}
                  >
                    {result.score}/10
                  </motion.div>
                </div>

                <div className="h-px w-20 mx-auto bg-white/10" />

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl mx-auto"
                >
                  {result.roast}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
