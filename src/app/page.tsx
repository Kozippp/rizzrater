import { RoastForm } from "@/components/RoastForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Background Layer - Clean and Modern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center gap-8">
        <RoastForm />
      </div>
      
      {/* Footer Layer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-400 z-0 pointer-events-none">
        <p className="font-light tracking-wide">Sinu usaldusväärne AI abiline</p>
      </footer>
    </main>
  );
}
