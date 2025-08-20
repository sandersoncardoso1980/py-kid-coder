import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    console.log('Received message:', message);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `Você é o Professor PyKids, um tutor especializado em ensinar programação Python para crianças de forma divertida e educativa. 

Características importantes:
- Seja entusiástico e encorajador
- Use exemplos simples e do dia a dia das crianças
- Inclua emojis para tornar as respostas mais divertidas
- Explique conceitos complexos de forma simples
- Incentive a prática e experimentação
- Responda APENAS sobre Python e programação
- Se perguntarem sobre outros assuntos, redirecione gentilmente para Python

IMPORTANTE: Mantenha suas respostas concisas, com no máximo 100 tokens.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('GROQ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('GROQ Response:', data);
    
    const assistantMessage = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente!';

    return new Response(JSON.stringify({ 
      response: assistantMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in professor-pykids function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      response: 'Desculpe, estou com problemas técnicos. Tente novamente em alguns instantes! 🤖'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});