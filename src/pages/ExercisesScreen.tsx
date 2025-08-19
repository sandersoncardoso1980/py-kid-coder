import { useState } from "react";
import { Trophy, CheckCircle, XCircle, RotateCcw, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

const questions: Question[] = [
  {
    id: "1",
    question: "Qual comando usamos para imprimir algo na tela em Python?",
    options: ["show()", "print()", "write()", "display()"],
    correctAnswer: 1,
    explanation: "A função print() é usada para exibir texto na tela em Python!",
    difficulty: "Fácil"
  },
  {
    id: "2",
    question: "Como criamos uma variável chamada 'nome' com o valor 'João'?",
    options: ["nome = João", "nome = 'João'", "var nome = João", "let nome = 'João'"],
    correctAnswer: 1,
    explanation: "Em Python, strings devem estar entre aspas: nome = 'João'",
    difficulty: "Fácil"
  },
  {
    id: "3",
    question: "Qual estrutura usamos para repetir um código várias vezes?",
    options: ["if", "for", "def", "import"],
    correctAnswer: 1,
    explanation: "O loop 'for' nos permite repetir código várias vezes!",
    difficulty: "Médio"
  },
  {
    id: "4",
    question: "Como verificamos se um número é maior que 10?",
    options: ["if numero > 10:", "if numero == 10:", "if numero < 10:", "for numero > 10:"],
    correctAnswer: 0,
    explanation: "Usamos 'if numero > 10:' para verificar se é maior que 10!",
    difficulty: "Médio"
  },
  {
    id: "5",
    question: "Qual é o tipo de dados para números com casas decimais?",
    options: ["int", "float", "str", "bool"],
    correctAnswer: 1,
    explanation: "O tipo 'float' é usado para números decimais como 3.14!",
    difficulty: "Difícil"
  }
];

export default function ExercisesScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getMotivationalMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🎉 Excelente! Você é um Python Master!";
    if (percentage >= 60) return "👏 Muito bem! Continue praticando!";
    return "💪 Não desista! Pratique mais e você consegue!";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-success/20 text-success";
      case "Médio": return "bg-warning/20 text-warning";
      case "Difícil": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <AnimatedCard className="w-full max-w-md text-center space-y-6">
          <div className="space-y-4">
            <Trophy className={`w-16 h-16 mx-auto ${getScoreColor()}`} />
            <h1 className="text-2xl font-bold text-foreground">Quiz Concluído!</h1>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {score} de {questions.length} questões corretas
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={percentage} className="h-3" />
              <p className="text-sm font-medium text-foreground">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRestartQuiz} 
              className="w-full bg-gradient-primary text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button variant="outline" className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Ver Outros Exercícios
            </Button>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="bg-gradient-accent p-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">🏆 Exercícios Python</h1>
          <p className="text-white/90">Teste seus conhecimentos!</p>
        </div>
      </div>

      <div className="p-6">
        {/* Progress */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Questão {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-foreground font-medium">
              Pontuação: {score}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatedCard className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {question.difficulty === "Fácil" ? "10" : question.difficulty === "Médio" ? "20" : "30"} pontos
                </span>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-foreground leading-relaxed">
              {question.question}
            </h2>
          </div>
        </AnimatedCard>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 border-2 transition-all duration-200";
            
            if (showResult) {
              if (index === question.correctAnswer) {
                buttonClass += " bg-success/20 border-success text-success";
              } else if (index === selectedAnswer) {
                buttonClass += " bg-destructive/20 border-destructive text-destructive";
              } else {
                buttonClass += " bg-muted/50 border-muted text-muted-foreground";
              }
            } else {
              if (index === selectedAnswer) {
                buttonClass += " bg-primary/20 border-primary text-primary";
              } else {
                buttonClass += " bg-card border-border text-foreground hover:bg-muted/50 hover:border-muted-foreground";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`${buttonClass} rounded-lg`}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {showResult && (
          <AnimatedCard className={`mb-6 ${
            selectedAnswer === question.correctAnswer 
              ? "bg-success/10 border-success/20" 
              : "bg-destructive/10 border-destructive/20"
          }`}>
            <div className="flex items-start space-x-3">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              )}
              <div>
                <h3 className="font-semibold mb-1">
                  {selectedAnswer === question.correctAnswer ? "Correto! 🎉" : "Incorreto 😅"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            </div>
          </AnimatedCard>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-primary text-white"
            >
              Confirmar Resposta
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-secondary text-white"
            >
              {currentQuestion < questions.length - 1 ? "Próxima Questão" : "Ver Resultado"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}