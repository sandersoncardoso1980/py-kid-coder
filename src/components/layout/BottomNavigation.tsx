import { Home, Book, MessageCircle, Code, Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Book, label: "Biblioteca", path: "/ebooks" },
  { icon: MessageCircle, label: "Professor", path: "/chat" },
  { icon: Code, label: "Código", path: "/playground" },
  { icon: Trophy, label: "Exercícios", path: "/exercises" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";
  
  if (isAuthPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10 scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}