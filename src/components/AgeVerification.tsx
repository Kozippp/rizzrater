"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, AlertTriangle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const AGE_VERIFIED_KEY = "rizz_rater_age_verified"

export function AgeVerification({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if already verified
    const verified = localStorage.getItem(AGE_VERIFIED_KEY)
    setIsVerified(verified === "true")
    setIsChecking(false)
  }, [])

  const handleVerify = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, "true")
    setIsVerified(true)
  }

  const handleDecline = () => {
    // Redirect to a safe page or show message
    window.location.href = "https://www.google.com"
  }

  // Show nothing while checking localStorage
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-rose-950/20 to-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-12 h-12 text-rose-500 fill-rose-500/50" />
        </motion.div>
      </div>
    )
  }

  // Show age gate if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-rose-950/20 to-zinc-950 overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-red-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full max-w-lg"
          >
            <Card className="glass-panel border-0 overflow-hidden ring-1 ring-rose-500/30 shadow-[0_8px_32px_rgba(244,63,94,0.2)]">
              <CardContent className="p-8 md:p-12 text-center">
                {/* Header Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6"
                >
                  <ShieldCheck className="w-10 h-10 text-rose-400" />
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 mb-4">
                  Age Verification
                </h1>

                {/* Description */}
                <p className="text-pink-200/70 text-lg mb-6 leading-relaxed">
                  This website contains content intended for adults only. Please confirm that you are 18 years of age or older.
                </p>

                {/* Disclaimer */}
                <div className="bg-black/30 rounded-xl p-4 mb-8 border border-rose-500/10">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-pink-200/60 text-left leading-relaxed">
                      <strong className="text-amber-400/90">Disclaimer:</strong> This website is for entertainment purposes only. The AI-generated roasts are meant to be humorous. We are not responsible for any hurt feelings, damaged egos, or existential crises that may result from using this service. Enter at your own risk!
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleVerify}
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 border-t border-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5 fill-white/30" />
                      I am 18 or older
                    </span>
                  </Button>
                  
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="flex-1 h-14 text-lg font-semibold bg-transparent border-rose-500/30 text-rose-200/70 hover:bg-rose-500/10 hover:text-rose-200 rounded-xl transition-all duration-300"
                  >
                    Leave
                  </Button>
                </div>

                {/* Footer note */}
                <p className="text-xs text-pink-200/30 mt-6">
                  By entering, you agree to our terms and acknowledge the disclaimer above.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Show main content if verified
  return <>{children}</>
}
