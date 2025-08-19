import { Trophy, Target, Clock, Star, Book, MessageCircle, Code, Award } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-banner.jpg";

export default function Dashboard() {
  const user = {
    name: "João Silva",
    age: 12,
    level: "Iniciante",
    avatar: "🧑‍💻",
    points: 850,
    lessonsCompleted: 15,
    totalLessons: 50,
    exercisesCompleted: 23,
    weeklyGoal: 5,
    currentStreak: 3
  };

  const progress = (user.lessonsCompleted / user.totalLessons) * 100;

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Falar com Professor",
      subtitle: "Tire suas dúvidas",
      variant: "primary" as const,
      path: "/chat"
    },
    {
      icon: Book,
      title: "Biblioteca",
      subtitle: "Explore recursos",
      variant: "secondary" as const,
      path: "/ebooks"
    },
    {
      icon: Code,
      title: "Playground",
      subtitle: "Pratique código",
      variant: "accent" as const,
      path: "/playground"
    },
    {
      icon: Trophy,
      title: "Exercícios",
      subtitle: "Teste conhecimentos",
      variant: "default" as const,
      path: "/exercises"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header com banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="PyKids Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Olá, {user.name}! 👋</h1>
            <p className="text-white/90">Vamos continuar aprendendo Python?</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-8 relative z-10">
        {/* Perfil do usuário */}
        <AnimatedCard className="bg-card/95 backdrop-blur-sm border-2">
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-bounce-slow">{user.avatar}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{user.age} anos</span>
                <Badge variant="secondary">{user.level}</Badge>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-warning mr-1" />
                  <span>{user.points} pontos</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatedCard variant="primary">
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
              <p className="text-2xl font-bold text-primary-foreground">{user.lessonsCompleted}</p>
              <p className="text-sm text-primary-foreground/80">Aulas</p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="secondary">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-secondary-foreground" />
              <p className="text-2xl font-bold text-secondary-foreground">{user.exercisesCompleted}</p>
              <p className="text-sm text-secondary-foreground/80">Exercícios</p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="accent">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-accent-foreground" />
              <p className="text-2xl font-bold text-accent-foreground">{user.currentStreak}</p>
              <p className="text-sm text-accent-foreground/80">Dias seguidos</p>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-warning text-warning-foreground">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{user.points}</p>
              <p className="text-sm opacity-80">Pontos</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Progresso */}
        <AnimatedCard>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Progresso Geral</h3>
              <span className="text-sm text-muted-foreground">{user.lessonsCompleted}/{user.totalLessons}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Você completou {Math.round(progress)}% do curso!
            </p>
          </div>
        </AnimatedCard>

        {/* Ações rápidas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">O que você quer fazer?</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <AnimatedCard 
                  key={index} 
                  variant={action.variant}
                  className="cursor-pointer"
                >
                  <div className="text-center space-y-2">
                    <Icon className="w-8 h-8 mx-auto" />
                    <h4 className="font-semibold">{action.title}</h4>
                    <p className="text-sm opacity-80">{action.subtitle}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>

        {/* Meta semanal */}
        <AnimatedCard>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Meta desta semana</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completar {user.weeklyGoal} lições</span>
                <span className="text-foreground">{user.currentStreak}/{user.weeklyGoal}</span>
              </div>
              <Progress value={(user.currentStreak / user.weeklyGoal) * 100} className="h-2" />
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}