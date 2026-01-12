import { RoastForm } from "@/components/RoastForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Layer - Fixed position, no pointer events */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-70" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center gap-8">
        <RoastForm />
      </div>
      
      {/* Footer Layer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500/70 z-0 pointer-events-none">
        <p className="font-light tracking-wide">Built for the heartbroken. Powered by AI.</p>
      </footer>
    </main>
  );
}
