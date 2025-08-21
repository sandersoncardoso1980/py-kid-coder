import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, CheckCircle, XCircle, RotateCcw, Star, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export default function ExercisesScreen() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      fetchExercises();
    }
  }, [user, authLoading, navigate]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os exercícios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exercise = exercises[currentExercise];
  const progress = exercises.length > 0 ? ((currentExercise + 1) / exercises.length) * 100 : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !exercise) return;

    const isCorrect = selectedAnswer === exercise.content.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (!exercise || !user) return;

    // Save answer to database
    try {
      const isCorrect = selectedAnswer === exercise.content.correctAnswer;
      const pointsEarned = isCorrect ? exercise.points : 0;

      await supabase
        .from('user_exercise_answers')
        .insert({
          user_id: user.id,
          exercise_id: exercise.id,
          answer: selectedAnswer?.toString() || '',
          is_correct: isCorrect,
          points_earned: pointsEarned
        });

      // Update profile points and exercises completed
      if (isCorrect && profile) {
        await updateProfile({
          points: profile.points + pointsEarned,
          exercises_completed: profile.exercises_completed + 1
        });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }

    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentExercise(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getScoreColor = () => {
    if (exercises.length === 0) return "text-muted-foreground";
    const percentage = (score / exercises.length) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getMotivationalMessage = () => {
    if (exercises.length === 0) return "Sem exercícios disponíveis";
    const percentage = (score / exercises.length) * 100;
    if (percentage >= 80) return "🎉 Excelente! Você é um Python Master!";
    if (percentage >= 60) return "👏 Muito bem! Continue praticando!";
    return "💪 Não desista! Pratique mais e você consegue!";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
      case "iniciante": 
        return "bg-success/20 text-success";
      case "médio":
      case "intermediário": 
        return "bg-warning/20 text-warning";
      case "difícil":
      case "avançado": 
        return "bg-destructive/20 text-destructive";
      default: 
        return "bg-muted/20 text-muted-foreground";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Trophy size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Carregando exercícios...</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum exercício disponível</h3>
          <p className="text-muted-foreground">
            Os exercícios ainda estão sendo preparados.
          </p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / exercises.length) * 100);
    
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
                {score} de {exercises.length} questões corretas
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
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              <Target className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
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
              Questão {currentExercise + 1} de {exercises.length}
            </span>
            <span className="text-foreground font-medium">
              Pontuação: {score}/{exercises.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatedCard className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {exercise.points} pontos
                </span>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-foreground leading-relaxed">
              {exercise.content.question}
            </h2>
          </div>
        </AnimatedCard>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {exercise.content.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 border-2 transition-all duration-200";
            
            if (showResult) {
              if (index === exercise.content.correctAnswer) {
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
                  {showResult && index === exercise.content.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                  {showResult && index === selectedAnswer && index !== exercise.content.correctAnswer && (
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
            selectedAnswer === exercise.content.correctAnswer 
              ? "bg-success/10 border-success/20" 
              : "bg-destructive/10 border-destructive/20"
          }`}>
            <div className="flex items-start space-x-3">
              {selectedAnswer === exercise.content.correctAnswer ? (
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              )}
              <div>
                <h3 className="font-semibold mb-1">
                  {selectedAnswer === exercise.content.correctAnswer ? "Correto! 🎉" : "Incorreto 😅"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {exercise.content.explanation}
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
              {currentExercise < exercises.length - 1 ? "Próxima Questão" : "Ver Resultado"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}