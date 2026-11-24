import { About } from "@/components/section/About";
import { Contact } from "@/components/section/Contact";
import { Home } from "@/components/section/Home";
import { Projects } from "@/components/section/Project";
import { Skills } from "@/components/section/Skill";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/navigation/Navbar"
import { ChatPanel } from "@/components/section/ChatPanel"
import { Toaster } from "react-hot-toast";


export function PortfolioContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="lg:pr-[380px] xl:pr-[420px] pb-28 md:pb-0">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
          <Home />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </div>
      </main>
      <ChatPanel />
      <Toaster
  position="bottom-center"
  toastOptions={{
    style: {
      background: "#18181b",
      color: "#fff",
      border: "1px solid #27272a",
    },
  }}
/>
    </div>
  );
}



