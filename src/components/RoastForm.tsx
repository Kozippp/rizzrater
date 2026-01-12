"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, SendHorizontal, Loader2, Star } from "lucide-react"
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
    if (score < 3) return "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
    if (score < 7) return "text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
    return "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
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
        <div className="inline-flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
          <Bot className="w-6 h-6 text-indigo-400" />
          <span className="text-sm font-medium text-indigo-200/80 uppercase tracking-widest">AI Roast Master</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 pb-2">
          Roast My Line
        </h1>
        
        <p className="text-lg text-muted-foreground/80 font-light max-w-lg mx-auto leading-relaxed">
          Julge küsida, julge vastutada. Sinu isiklik AI kriitik ootab.
        </p>
      </motion.div>

      {/* INPUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-panel border-0 overflow-hidden ring-1 ring-white/10">
          <CardContent className="p-1">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 p-2">
              <div className="relative flex-grow group">
                <Input
                  placeholder="Kirjuta siia midagi..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-14 px-6 text-lg bg-black/40 border-transparent focus:border-indigo-500/50 text-white placeholder:text-gray-600 rounded-xl transition-all focus:bg-black/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-medium rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <SendHorizontal className="w-6 h-6" />
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
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="relative mt-4"
          >
            <div className="glass-panel rounded-2xl p-8 md:p-10 text-center relative overflow-hidden group">
              
              {/* Decorative background gradients within card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/20 transition-all duration-700" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Hinnang</span>
                  <div className="flex items-center justify-center relative">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                      className={`text-7xl md:text-8xl font-bold tracking-tighter ${getScoreColor(result.score)}`}
                    >
                      {result.score}
                    </motion.div>
                    <span className="text-2xl text-muted-foreground/40 absolute -right-6 top-2">/10</span>
                  </div>
                  
                  {/* Star Rating Visual */}
                  <div className="flex gap-1 mt-2">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.05) }}
                      >
                        <Star 
                          className={`w-3 h-3 ${i < result.score ? "fill-white text-white" : "text-white/10"}`} 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto italic"
                >
                  &ldquo;{result.roast}&rdquo;
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
