"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, ChevronRight, Filter } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Input } from "@titickets/ui/input";
import { Button } from "@titickets/ui/button";
import { Card, CardContent } from "@titickets/ui/card";
import { Skeleton } from "@titickets/ui/skeleton";
import { Badge } from "@titickets/ui/badge";
import { ImageWithFallback } from "../components/ImageWithFallback";

const CATEGORIES = ["Todos", "Música", "Tecnologia", "Teatro", "Comédia", "Esportes", "Workshops"];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Festival de Música Indie 2026",
    date: "18 Jun 2026 • 18:00",
    location: "São Paulo, SP",
    price: "R$ 150,00",
    category: "Música",
    image: "https://images.unsplash.com/photo-1665035212282-3e117d618b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Confirmado"
  },
  {
    id: 2,
    title: "Tech Summit Brasil",
    date: "25 Jun 2026 • 09:00",
    location: "Rio de Janeiro, RJ",
    price: "R$ 499,00",
    category: "Tecnologia",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Últimos ingressos"
  },
  {
    id: 3,
    title: "O Fantasma da Ópera - O Musical",
    date: "02 Jul 2026 • 20:00",
    location: "Teatro Municipal, SP",
    price: "R$ 220,00",
    category: "Teatro",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Confirmado"
  },
  {
    id: 4,
    title: "Noite de Stand-up: Especial",
    date: "10 Jul 2026 • 21:00",
    location: "Curitiba, PR",
    price: "R$ 80,00",
    category: "Comédia",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Esgotando"
  },
  {
    id: 5,
    title: "Workshop de Design Systems",
    date: "15 Jul 2026 • 14:00",
    location: "Online",
    price: "Gratuito",
    category: "Workshops",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Confirmado"
  },
  {
    id: 6,
    title: "Jazz Festival Ao Ar Livre",
    date: "20 Jul 2026 • 16:00",
    location: "Belo Horizonte, MG",
    price: "R$ 120,00",
    category: "Música",
    image: "https://images.unsplash.com/photo-1665035212282-3e117d618b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "Confirmado"
  }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-50 font-sans pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.05] via-[#050505] to-[#050505] -z-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Descubra eventos <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-500">
              inesquecíveis
            </span>
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            A plataforma definitiva para encontrar e garantir seu lugar nos melhores shows, conferências e peças de teatro.
          </p>

          {/* Search Bar */}
          <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto backdrop-blur-xl shadow-2xl">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-neutral-400" />
              <Input 
                placeholder="Qual evento você procura?" 
                className="pl-12 border-0 bg-transparent h-14 text-lg focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:block w-px bg-white/10 my-2" />
            <div className="relative flex-1 flex items-center hidden sm:flex">
              <MapPin className="absolute left-4 h-5 w-5 text-neutral-400" />
              <Input 
                placeholder="Qualquer lugar" 
                className="pl-12 border-0 bg-transparent h-14 text-lg focus:ring-0"
              />
            </div>
            <Button size="lg" className="h-14 px-8 rounded-xl w-full sm:w-auto text-base">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h2 className="text-2xl font-semibold">Próximos Eventos</h2>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide mask-fade-edges">
            <Button variant="outline" size="sm" className="shrink-0 gap-2">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
            <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
            {CATEGORIES.map(category => (
              <Button 
                key={category} 
                variant={activeCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="shrink-0 rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="border-white/5 bg-white/[0.02]">
                <div className="aspect-[4/3] w-full p-2">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
                <CardContent className="pt-4 space-y-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Card key={event.id} className="group border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 cursor-pointer">
                <div className="relative aspect-[4/3] w-full p-2 overflow-hidden rounded-xl">
                  <ImageWithFallback 
                    src={event.image} 
                    alt={event.title}
                    className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/10">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="default" className="bg-white text-black font-semibold">
                      {event.price}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="pt-4 flex flex-col h-[180px]">
                  <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <span>{event.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-white text-neutral-100 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                    <span className="text-neutral-500 font-medium group-hover:text-white transition-colors flex items-center gap-1">
                      Comprar <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <Search className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
              <p className="text-neutral-400">Tente buscar por outros termos ou limpar os filtros.</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Todos");
                }}
              >
                Limpar busca
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button variant="secondary" size="lg" className="px-8">
              Carregar mais eventos
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
