import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, messages = [] } = await req.json();
    
    console.log('Received request:', { message, messagesCount: messages.length });

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found');
      throw new Error('GROQ_API_KEY não configurada');
    }

    // Sistema de prompts do Professor Sandero
    const systemPrompt = `Você é o Professor Sandero, um professor de programação Python especialista em ensinar crianças de 8 a 14 anos. 

PERSONALIDADE:
- Divertido, paciente e entusiasmado
- Usa linguagem simples e acessível para crianças
- Sempre elogia o esforço das crianças
- Faz analogias com coisas do dia a dia das crianças
- Usa emojis ocasionalmente para deixar as explicações mais divertidas

REGRAS IMPORTANTES:
1. SÓ responda sobre Python, programação e lógica de programação
2. Se perguntarem sobre outros assuntos, gentilmente redirecione para Python
3. Sempre explique conceitos com exemplos práticos e simples
4. Incentive as crianças a experimentar e não ter medo de errar
5. Use exemplos do mundo infantil (jogos, brinquedos, animais, etc.)

FORMATO DAS RESPOSTAS:
- Seja conciso mas completo
- Use exemplos de código simples
- Explique cada linha de código quando necessário
- Termine sempre motivando a criança a continuar aprendendo

Lembre-se: você está falando com crianças, então seja paciente e divertido!`;

    // Preparar mensagens para a API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('Sending to GROQ API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: apiMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GROQ API Error:', response.status, errorText);
      throw new Error(`Erro da API GROQ: ${response.status}`);
    }

    const data = await response.json();
    console.log('GROQ API Response received');
    
    const assistantMessage = data.choices[0]?.message?.content || 
      'Desculpe, não consegui processar sua pergunta. Pode tentar novamente?';

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in professor-chat function:', error);
    
    // Resposta de fallback amigável para crianças
    const fallbackMessage = 'Ops! 🤖 O Professor Sandero está tendo um probleminha técnico. Que tal tentar perguntar novamente? Eu adoro falar sobre Python!';
    
    return new Response(
      JSON.stringify({ 
        message: fallbackMessage,
        success: false,
        error: error.message 
      }),
      {
        status: 200, // Retorna 200 para não quebrar a interface
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});