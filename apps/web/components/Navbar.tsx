import { Ticket, Search, User } from "lucide-react";
import { Button } from "@titickets/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-white" />
            <span className="text-xl font-bold tracking-tight text-white">Titickets</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Eventos</a>
            <a href="#" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Organizações</a>
            <a href="#" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Ajuda</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="secondary" className="gap-2 hidden sm:flex">
              <User className="h-4 w-4" />
              Entrar
            </Button>
            <Button className="hidden sm:flex">Criar Evento</Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
