import { RoastForm } from "@/components/RoastForm";
import { FlyingMessages } from "@/components/FlyingMessages";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-background selection:bg-pink-500/30 selection:text-pink-100">
      
      {/* Dynamic Background - Romantic Theme */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-red-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none"></div>
      </div>

      <FlyingMessages />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        <RoastForm />
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-4 md:bottom-8 text-center text-sm text-pink-200/40 z-10">
        <p className="font-light tracking-widest hover:text-pink-200/60 transition-colors cursor-default">
          MADE WITH ❤️ & AI
        </p>
      </footer>
    </main>
  );
}
