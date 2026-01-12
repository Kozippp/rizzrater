"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const messages = [
  "Hey beautiful 👋",
  "Are you a magician? 🎩",
  "Do you believe in love at first sight? 👀",
  "Did it hurt when you fell from heaven? 😇",
  "Is your name Google? 🔍",
  "You must be a parking ticket 🎫",
  "Are you Wi-Fi? 📶",
  "Feeling lucky? 🍀",
  "10/10 Rizz 🔥",
  "Smooth operator 😎",
  "Heartbreaker 💔",
  "Call me 🤙",
  "Send nudes... jk... unless? 😳",
  "Netflix & Chill? 🎬",
  "I'm lost in your eyes 👁️",
  "Do you have a map? 🗺️",
  "Nice shoes 👟",
  "Your smile is contagious 😁",
]

interface FloatingMessage {
  id: number
  text: string
  x: number
  y: number
  duration: number
  delay: number
  scale: number
}

export function FlyingMessages() {
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([])

  useEffect(() => {
    // Generate initial messages
    const initialMessages = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      text: messages[Math.floor(Math.random() * messages.length)],
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      scale: 0.5 + Math.random() * 0.5,
    }))
    setFloatingMessages(initialMessages)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
      {floatingMessages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ 
            opacity: 0, 
            x: `${msg.x}vw`, 
            y: "110vh" 
          }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0], 
            y: "-10vh" 
          }}
          transition={{
            duration: msg.duration,
            repeat: Infinity,
            delay: msg.delay,
            ease: "linear",
          }}
          style={{
            scale: msg.scale,
          }}
          className="absolute whitespace-nowrap text-rose-300/40 font-bold text-2xl md:text-4xl select-none"
        >
          {msg.text}
        </motion.div>
      ))}
    </div>
  )
}
