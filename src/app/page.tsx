import { RoastForm } from "@/components/RoastForm";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-background selection:bg-primary/20">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Noise Texture (Optional, simulates film grain) */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        <RoastForm />
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-4 md:bottom-8 text-center text-sm text-muted-foreground/60 z-10">
        <p className="font-light tracking-widest hover:text-muted-foreground transition-colors cursor-default">
          POWERED BY AI
        </p>
      </footer>
    </main>
  );
}
