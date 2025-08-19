import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedCard } from "@/components/ui/animated-card";
import professorImage from "@/assets/professor-sandero.jpg";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Eu sou o Professor Sandero! 🤖 Estou aqui para te ajudar a aprender Python de forma divertida! O que você gostaria de saber sobre programação?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Chamada para o Professor Sandero via GROQ API
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('professor-chat', {
        body: {
          message: currentInput,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        console.error('Erro ao chamar função:', error);
        throw new Error('Erro de conexão com o Professor Sandero');
      }

      const assistantMessage = data?.message || 'Desculpe, não consegui processar sua pergunta.';
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantMessage,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Erro no chat:', error);
      
      // Fallback em caso de erro
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Ops! 🤖 Estou com um probleminha técnico. Que tal tentar novamente? Adoro falar sobre Python!",
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={professorImage} alt="Professor Sandero" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Professor Sandero</h1>
            <p className="text-white/80 text-sm">Seu tutor de Python 🐍</p>
          </div>
          <Sparkles className="ml-auto text-warning animate-pulse" size={24} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <AnimatedCard className={`${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              } shadow-interactive`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={`text-xs mt-2 block ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </AnimatedCard>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot size={16} />
              </div>
              <AnimatedCard className="bg-card">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua pergunta sobre Python..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            className="bg-gradient-primary text-white"
            disabled={isTyping || !inputMessage.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ⚡ Professor Sandero responde apenas sobre Python e programação
        </p>
      </div>
    </div>
  );
}