import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code, Sparkles } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Logo animado */}
        <div className="relative">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-float">
            <Code size={64} className="text-white animate-glow" />
            <Sparkles 
              size={24} 
              className="absolute -top-2 -right-2 text-warning animate-bounce-slow" 
            />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white animate-fade-in">
            Py<span className="text-warning">Kids</span>
          </h1>
          <p className="text-xl text-white/90 animate-fade-in">
            Aprendendo Python de forma divertida!
          </p>
        </div>

        {/* Loading */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}