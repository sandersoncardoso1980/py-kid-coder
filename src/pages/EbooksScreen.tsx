import { useState } from "react";
import { Book, Play, Download, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  type: "book" | "video";
  description: string;
  rating: number;
  duration?: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  thumbnail: string;
}

const logicConcepts = [
  { title: "Variáveis", description: "Guardando informações", icon: "📦" },
  { title: "Condicionais", description: "Tomando decisões", icon: "🤔" },
  { title: "Loops", description: "Repetindo ações", icon: "🔄" },
  { title: "Funções", description: "Organizando código", icon: "⚙️" },
  { title: "Listas", description: "Coleções de dados", icon: "📋" },
  { title: "Dicionários", description: "Dados estruturados", icon: "📖" },
  { title: "Classes", description: "Programação orientada", icon: "🏗️" },
  { title: "Módulos", description: "Reutilizando código", icon: "📚" },
  { title: "Debugging", description: "Encontrando erros", icon: "🐛" },
  { title: "Algoritmos", description: "Resolvendo problemas", icon: "🧩" }
];

export default function EbooksScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const resources: Resource[] = [
    {
      id: "1",
      title: "Python para Crianças",
      type: "book",
      description: "Introdução divertida ao Python com exemplos práticos",
      rating: 4.8,
      difficulty: "Iniciante",
      thumbnail: "📘"
    },
    {
      id: "2",
      title: "Jogos com Python",
      type: "video",
      description: "Aprenda criando jogos incríveis",
      rating: 4.9,
      duration: "45 min",
      difficulty: "Intermediário",
      thumbnail: "🎮"
    },
    {
      id: "3",
      title: "Lógica de Programação",
      type: "book",
      description: "Fundamentos essenciais da programação",
      rating: 4.7,
      difficulty: "Iniciante",
      thumbnail: "🧠"
    },
    {
      id: "4",
      title: "Projetos Divertidos",
      type: "video",
      description: "Construa projetos reais com Python",
      rating: 4.9,
      duration: "60 min",
      difficulty: "Intermediário",
      thumbnail: "🚀"
    },
    {
      id: "5",
      title: "Python Avançado",
      type: "book",
      description: "Técnicas avançadas e boas práticas",
      rating: 4.6,
      difficulty: "Avançado",
      thumbnail: "🔥"
    },
    {
      id: "6",
      title: "Web com Python",
      type: "video",
      description: "Criando sites com Python",
      rating: 4.8,
      duration: "90 min",
      difficulty: "Avançado",
      thumbnail: "🌐"
    }
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const currentResources = resources.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % logicConcepts.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + logicConcepts.length) % logicConcepts.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-success/20 text-success";
      case "Intermediário": return "bg-warning/20 text-warning";
      case "Avançado": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="bg-gradient-secondary p-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">📚 Biblioteca Digital</h1>
          <p className="text-white/90">Explore recursos educacionais incríveis!</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Carrossel de Conceitos */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">🧩 Conceitos de Lógica</h2>
          <div className="relative">
            <AnimatedCard className="bg-gradient-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevCarousel}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <div className="text-center flex-1">
                  <div className="text-4xl mb-2">{logicConcepts[carouselIndex].icon}</div>
                  <h3 className="text-lg font-bold">{logicConcepts[carouselIndex].title}</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {logicConcepts[carouselIndex].description}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextCarousel}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
              
              <div className="flex justify-center mt-4 space-x-1">
                {logicConcepts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === carouselIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Grid de Recursos */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">📖 Recursos Educacionais</h2>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                  className="w-8 h-8 p-0"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentResources.map((resource) => (
              <AnimatedCard key={resource.id} className="cursor-pointer">
                <div className="flex space-x-4">
                  <div className="text-6xl flex-shrink-0">{resource.thumbnail}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-foreground">{resource.title}</h3>
                      <div className="flex items-center space-x-1">
                        {resource.type === "book" ? <Book size={16} /> : <Play size={16} />}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                      
                      {resource.duration && (
                        <Badge variant="outline" className="text-xs">
                          {resource.duration}
                        </Badge>
                      )}
                      
                      <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="bg-gradient-primary text-white">
                        {resource.type === "book" ? (
                          <>
                            <Book className="w-4 h-4 mr-1" />
                            Ler
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Assistir
                          </>
                        )}
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Navegação de páginas */}
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}