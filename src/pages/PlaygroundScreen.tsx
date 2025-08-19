import { useState } from "react";
import { Copy, Play, Book, Lightbulb, Code2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  icon: string;
}

const codeExamples: CodeExample[] = [
  {
    id: "1",
    title: "Olá, Mundo!",
    description: "Seu primeiro programa Python",
    code: `# Meu primeiro programa Python
print("Olá, mundo!")
print("Bem-vindos ao PyKids!")`,
    explanation: "Este é o programa mais famoso! A função print() mostra texto na tela.",
    difficulty: "Iniciante",
    icon: "👋"
  },
  {
    id: "2",
    title: "Calculadora Simples",
    description: "Fazendo contas básicas",
    code: `# Calculadora básica
numero1 = 10
numero2 = 5

soma = numero1 + numero2
subtracao = numero1 - numero2
multiplicacao = numero1 * numero2
divisao = numero1 / numero2

print(f"Soma: {soma}")
print(f"Subtração: {subtracao}")
print(f"Multiplicação: {multiplicacao}")
print(f"Divisão: {divisao}")`,
    explanation: "Aqui aprendemos sobre variáveis e operações matemáticas básicas!",
    difficulty: "Iniciante",
    icon: "🧮"
  },
  {
    id: "3",
    title: "Jogo de Adivinhação",
    description: "Adivinhe o número secreto!",
    code: `import random

# Número secreto entre 1 e 10
numero_secreto = random.randint(1, 10)
tentativas = 3

print("🎮 Jogo de Adivinhação!")
print("Tente adivinhar o número de 1 a 10")

for i in range(tentativas):
    palpite = int(input("Qual é seu palpite? "))
    
    if palpite == numero_secreto:
        print("🎉 Parabéns! Você acertou!")
        break
    elif palpite < numero_secreto:
        print("📈 Muito baixo! Tente um número maior")
    else:
        print("📉 Muito alto! Tente um número menor")
else:
    print(f"😅 Que pena! O número era {numero_secreto}")`,
    explanation: "Este jogo usa loops, condicionais e entrada do usuário. Muito divertido!",
    difficulty: "Intermediário",
    icon: "🎲"
  },
  {
    id: "4",
    title: "Gato Virtual",
    description: "Seu pet digital em Python",
    code: `class GatoVirtual:
    def __init__(self, nome):
        self.nome = nome
        self.fome = 50
        self.felicidade = 50
        self.energia = 50
    
    def alimentar(self):
        self.fome = max(0, self.fome - 30)
        self.felicidade += 10
        print(f"🍽️ {self.nome} comeu e está satisfeito!")
    
    def brincar(self):
        self.felicidade += 20
        self.energia -= 15
        print(f"🎾 {self.nome} se divertiu brincando!")
    
    def dormir(self):
        self.energia = 100
        self.fome += 10
        print(f"😴 {self.nome} dormiu e está descansado!")
    
    def status(self):
        print(f"\\n🐱 Status do {self.nome}:")
        print(f"Fome: {self.fome}/100")
        print(f"Felicidade: {self.felicidade}/100")
        print(f"Energia: {self.energia}/100")

# Criando um gato
meu_gato = GatoVirtual("Mimi")
meu_gato.status()
meu_gato.alimentar()
meu_gato.brincar()
meu_gato.dormir()
meu_gato.status()`,
    explanation: "Este exemplo mostra programação orientada a objetos de forma divertida!",
    difficulty: "Avançado",
    icon: "🐱"
  },
  {
    id: "5",
    title: "Lista de Tarefas",
    description: "Organize suas atividades",
    code: `# Lista de tarefas simples
tarefas = []

def adicionar_tarefa(tarefa):
    tarefas.append(tarefa)
    print(f"✅ Tarefa '{tarefa}' adicionada!")

def listar_tarefas():
    print("\\n📋 Suas tarefas:")
    if not tarefas:
        print("Nenhuma tarefa pendente! 🎉")
    else:
        for i, tarefa in enumerate(tarefas, 1):
            print(f"{i}. {tarefa}")

def concluir_tarefa(indice):
    if 0 <= indice < len(tarefas):
        tarefa = tarefas.pop(indice)
        print(f"🎯 Tarefa '{tarefa}' concluída!")
    else:
        print("❌ Tarefa não encontrada!")

# Exemplo de uso
adicionar_tarefa("Estudar Python")
adicionar_tarefa("Fazer exercícios")
adicionar_tarefa("Brincar no playground")
listar_tarefas()
concluir_tarefa(0)
listar_tarefas()`,
    explanation: "Aqui aprendemos sobre listas, funções e organização de código!",
    difficulty: "Intermediário",
    icon: "📝"
  }
];

export default function PlaygroundScreen() {
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null);
  const { toast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado! 📋",
      description: "Cole no seu editor Python favorito!",
    });
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
      <div className="bg-gradient-accent p-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">💻 Playground Python</h1>
          <p className="text-white/90">Exemplos de código para praticar!</p>
        </div>
      </div>

      <div className="p-6">
        {selectedExample ? (
          /* Visualização detalhada do exemplo */
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedExample(null)}
              className="mb-4"
            >
              ← Voltar aos exemplos
            </Button>

            <AnimatedCard>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedExample.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedExample.title}</h2>
                      <p className="text-muted-foreground">{selectedExample.description}</p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(selectedExample.difficulty)}>
                    {selectedExample.difficulty}
                  </Badge>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Python</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(selectedExample.code)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                    {selectedExample.code}
                  </pre>
                </div>

                <AnimatedCard className="bg-primary/5 border-primary/20">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Explicação:</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedExample.explanation}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-gradient-primary text-white"
                    onClick={() => handleCopyCode(selectedExample.code)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Executar no Python
                  </Button>
                  <Button variant="outline">
                    <Book className="w-4 h-4 mr-2" />
                    Saber Mais
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </div>
        ) : (
          /* Grid de exemplos */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Escolha um exemplo para começar! 🚀
              </h2>
              <p className="text-muted-foreground">
                Clique em qualquer exemplo para ver o código completo
              </p>
            </div>

            <div className="grid gap-4">
              {codeExamples.map((example) => (
                <AnimatedCard 
                  key={example.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedExample(example)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{example.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-foreground">{example.title}</h3>
                        <Badge className={getDifficultyColor(example.difficulty)}>
                          {example.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {example.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Code2 className="w-3 h-3 mr-1" />
                            Python
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Testado
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          Ver Código →
                        </Button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            <AnimatedCard className="bg-gradient-secondary text-secondary-foreground text-center">
              <div className="space-y-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Dica do Professor Sandero</h3>
                  <p className="text-sm opacity-90">
                    Copie os códigos e execute no seu computador! 
                    Experimente modificá-los para ver o que acontece. 
                    A melhor forma de aprender é praticando! 💪
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        )}
      </div>
    </div>
  );
}