import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Video, ExternalLink, Search, Filter, BookOpen } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'video';
  url: string;
  category: string;
  difficulty: string;
  thumbnail_url?: string;
}

export default function EbooksScreen() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      fetchLibraryItems();
    }
  }, [user, authLoading, navigate]);

  const fetchLibraryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []).map(item => ({
        ...item,
        type: item.type as 'book' | 'video'
      })));
    } catch (error) {
      console.error('Error fetching library items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesDifficulty = filterDifficulty === "all" || item.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleItemClick = async (item: LibraryItem) => {
    try {
      await supabase
        .from('user_library_progress')
        .upsert({
          user_id: user?.id,
          library_item_id: item.id,
          last_accessed: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating progress:', error);
    }

    window.open(item.url, '_blank');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">📚 Biblioteca PyKids</h1>
        <p className="text-muted-foreground">Explore nossos recursos de aprendizado</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="book">📖 Livros</SelectItem>
              <SelectItem value="video">🎥 Vídeos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Iniciante">Iniciante</SelectItem>
              <SelectItem value="Intermediário">Intermediário</SelectItem>
              <SelectItem value="Avançado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <AnimatedCard 
            key={item.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleItemClick(item)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {item.type === 'book' ? (
                    <Book className="w-5 h-5 text-primary" />
                  ) : (
                    <Video className="w-5 h-5 text-secondary" />
                  )}
                  <Badge variant={item.type === 'book' ? 'default' : 'secondary'}>
                    {item.type === 'book' ? '📖 Livro' : '🎥 Vídeo'}
                  </Badge>
                </div>
                <Badge variant="outline">{item.difficulty}</Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                {item.category && (
                  <Badge variant="secondary" className="mb-3">
                    {item.category}
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {item.type === 'book' ? 'Ler agora' : 'Assistir agora'}
              </Button>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" || filterDifficulty !== "all" 
              ? "Tente ajustar os filtros de busca" 
              : "Ainda não há itens na biblioteca"}
          </p>
        </div>
      )}
    </div>
  );
}