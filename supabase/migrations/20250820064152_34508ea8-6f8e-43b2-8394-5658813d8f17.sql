-- Atualizar tabela profiles para incluir dados do cadastro
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS birth_date,
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS full_name,
ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS school_grade TEXT,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lessons_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exercises_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Iniciante',
ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '🧑‍💻',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar tabela de exercícios
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'Iniciante',
  points INTEGER DEFAULT 10,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de respostas de exercícios dos usuários
CREATE TABLE IF NOT EXISTS public.user_exercise_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  answer TEXT,
  is_correct BOOLEAN DEFAULT false,
  points_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Criar tabela de biblioteca (livros e vídeos)
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('book', 'video')),
  url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'Iniciante',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de progresso do usuário em itens da biblioteca
CREATE TABLE IF NOT EXISTS public.user_library_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  library_item_id UUID NOT NULL REFERENCES public.library_items(id),
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, library_item_id)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.user_exercise_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_exercise_answers
CREATE POLICY "Usuários podem ver suas próprias respostas" 
ON public.user_exercise_answers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias respostas" 
ON public.user_exercise_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias respostas" 
ON public.user_exercise_answers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas RLS para library_items (todos podem ver)
CREATE POLICY "Todos podem ver itens da biblioteca" 
ON public.library_items 
FOR SELECT 
USING (true);

-- Políticas RLS para user_library_progress
CREATE POLICY "Usuários podem ver seu próprio progresso" 
ON public.user_library_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso" 
ON public.user_library_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso" 
ON public.user_library_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas RLS para exercises (todos podem ver)
CREATE POLICY "Todos podem ver exercícios" 
ON public.exercises 
FOR SELECT 
USING (true);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns dados de exemplo na biblioteca
INSERT INTO public.library_items (title, description, type, url, category, difficulty) VALUES
('Introdução ao Python', 'Aprenda os conceitos básicos do Python de forma divertida', 'video', 'https://www.youtube.com/watch?v=S9uPNppGsGo', 'Básico', 'Iniciante'),
('Python para Crianças', 'Livro interativo sobre programação em Python', 'book', 'https://nostarch.com/pythonforkids', 'Básico', 'Iniciante'),
('Loops e Condições', 'Como usar loops for e while em Python', 'video', 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', 'Estruturas', 'Iniciante'),
('Funções em Python', 'Aprenda a criar e usar funções', 'video', 'https://www.youtube.com/watch?v=9Os0o3wzS_I', 'Funções', 'Intermediário');

-- Inserir alguns exercícios de exemplo
INSERT INTO public.exercises (title, description, difficulty, points, content) VALUES
('Primeiro Print', 'Crie um programa que exibe "Olá, mundo!" na tela', 'Iniciante', 10, '{"code": "print(\"Olá, mundo!\")", "expected": "Olá, mundo!"}'),
('Soma Simples', 'Crie um programa que soma dois números: 5 + 3', 'Iniciante', 15, '{"code": "resultado = 5 + 3\nprint(resultado)", "expected": "8"}'),
('Meu Nome', 'Crie uma variável com seu nome e exiba-a', 'Iniciante', 10, '{"code": "nome = \"João\"\nprint(nome)", "expected": "João"}');