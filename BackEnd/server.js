import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsonrepair } from 'jsonrepair';

// ============================================================================
// CONFIGURAÇÃO DE CAMINHO
// ============================================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// INICIALIZAÇÃO DO EXPRESS & MIDDLEWARES
// ============================================================================
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// ============================================================================
// SERVIÇOS EXTERNOS (SUPABASE & GEMINI)
// ============================================================================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ============================================================================
// CONFIGURAÇÃO DO MULTER
// ============================================================================
const storageTemp = multer.memoryStorage();
const upload = multer({
  storage: storageTemp,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ============================================================================
// PROMPT DA IA
// ============================================================================
const PROMPT_PADRAO = `
Você é um especialista em arquitetura, leitura de plantas baixas e reconstrução de ambientes para o projeto DraftUp.

Analise cuidadosamente a imagem da planta baixa fornecida.

O DraftUp precisa utilizar sua resposta para:
1. Mostrar um resumo compreensível da planta ao usuário.
2. Construir uma representação 3D aproximada da planta.

RETORNE SOMENTE JSON VÁLIDO.
NÃO coloque markdown.
NÃO coloque \`\`\`json.
NÃO escreva explicações fora do JSON.

Use exatamente esta estrutura:
{
  "resumo": "Resumo simples da planta baixa.",
  "planta3D": {
    "ambientes": [
      {
        "nome": "Sala",
        "largura": 4.0,
        "comprimento": 3.5
      }
    ],
    "paredes": [
      {
        "x": 0,
        "y": 0,
        "comprimento": 4.0,
        "espessura": 0.15,
        "altura": 2.8,
        "orientacao": "horizontal"
      }
    ],
    "portas": [
      {
        "x": 1.5,
        "y": 0,
        "largura": 0.8,
        "altura": 2.1,
        "orientacao": "horizontal"
      }
    ],
    "janelas": [
      {
        "x": 3.0,
        "y": 0,
        "largura": 1.5,
        "altura": 1.2,
        "alturaDoChao": 1.1,
        "orientacao": "horizontal"
      }
    ],
    "piso": {
      "largura": 10,
      "comprimento": 10
    }
  }
}

DIRETRIZES DE RECONSTRUÇÃO DA PERSPECTIVA:
1. A imagem fornecida é uma visualização 3D inclinada com erros geométricos. NÃO replique o cruzamento em formato de "X" ou "+" no centro do piso.
2. Mova as paredes principais para as extremidades das coordenadas a fim de formar um ambiente quadrado ou retangular fechado (perímetro útil).
3. Conecte as paredes em ângulos retos de 90 graus usando os eixos X e Y.
4. Insira as portas obrigatoriamente alinhadas e embutidas nas paredes geradas. Elas nunca devem flutuar nas pontas ou fora da estrutura.
5. Traga o painel de vidro azul flutuante (janela) para dentro de uma das paredes do perímetro.

REGRAS IMPORTANTES:
- Identifique os ambientes visíveis na planta.
- Identifique as principais paredes.
- Identifique portas.
- Identifique janelas.
- Não transforme textos, cotas ou linhas de medida em paredes.
- Não transforme móveis em paredes.
- Use coordenadas X e Y para posicionar os elementos no plano horizontal.
- A altura vertical é definida pelo campo "altura".
- Use somente "horizontal" ou "vertical" em "orientacao".
- A altura padrão das paredes é 2.8 metros.
- A espessura padrão das paredes é 0.15 metro.
- A altura padrão das portas é 2.1 metros.
- Caso uma medida esteja visível na planta, utilize-a.
- Caso uma medida não esteja disponível, faça uma estimativa razoável.
- Não invente elementos que claramente não aparecem na imagem.

IMPORTANTE: O modelo 3D é uma representação visual aproximada.

ATENÇÃO À SINTAXE:
- Verifique se todas as chaves e valores do JSON estão com aspas duplas de abertura e fechamento corretas (exemplo: "comprimento": 16.5).
- Não esqueça vírgulas entre as propriedades.
`;

// ============================================================================
// FUNÇÕES AUXILIARES (PARSER & VALIDADOR)
// ============================================================================
function extrairJSON(texto) {
  if (!texto || typeof texto !== 'string') {
    throw new Error('A IA não retornou nenhum texto.');
  }

  let textoLimpo = texto
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const inicio = textoLimpo.indexOf('{');
  const fim = textoLimpo.lastIndexOf('}');
  if (inicio !== -1 && fim !== -1 && fim > inicio) {
    textoLimpo = textoLimpo.substring(inicio, fim + 1);
  }

  try {
    const reparado = jsonrepair(textoLimpo);
    return JSON.parse(reparado);
  } catch (erro) {
    throw new Error('A IA respondeu, mas o JSON retornado é inválido.');
  }
}

function validarPlanta3D(dados) {
  if (!dados || typeof dados !== 'object') {
    throw new Error('Dados da planta inválidos.');
  }

  if (!dados.planta3D) {
    throw new Error('A resposta da IA não contém a propriedade planta3D.');
  }

  const planta = dados.planta3D;

  if (!Array.isArray(planta.ambientes)) planta.ambientes = [];
  if (!Array.isArray(planta.paredes)) planta.paredes = [];
  if (!Array.isArray(planta.portas)) planta.portas = [];
  if (!Array.isArray(planta.janelas)) planta.janelas = [];
  if (!planta.piso) planta.piso = { largura: 10, comprimento: 10 };

  return dados;
}

// ============================================================================
// FUNÇÕES DE REQUISIÇÃO ÀS IAs
// ============================================================================
async function tentarGroq(base64Image, mimeType) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurada no .env.');
  }

  console.log('🔄 Tentando Groq...');

  // 💡 A URL DEVE SER EXATAMENTE UMA STRING LIMPA
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.2-11b-vision-instruct',
      response_format: { type: 'json_object' },
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant designed to output raw JSON strictly following the requested format.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT_PADRAO },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `Groq retornou HTTP ${response.status}`);
  }

  const texto = data?.choices?.[0]?.message?.content;
  if (!texto) throw new Error('Groq não retornou conteúdo.');

  return texto;
}

async function tentarOpenRouter(base64Image, mimeType) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY não configurada.');
  }

  console.log('🔄 [2/3] Tentando OpenRouter...');
  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  const model = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-72b-instruct:free';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5000',
      'X-Title': 'DraftUp'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT_PADRAO },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenRouter retornou HTTP ${response.status}`);
  }

  const texto = data?.choices?.[0]?.message?.content;
  if (!texto) throw new Error('OpenRouter não retornou conteúdo.');

  return texto;
}

async function tentarGemini(fileBuffer, mimeType) {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada.');
  }

  console.log('🔄 [3/3] Tentando Google Gemini...');
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' }
  });

  const imagePart = {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType: mimeType
    }
  };

  const result = await model.generateContent([PROMPT_PADRAO, imagePart]);
  return result.response.text();
}

// ============================================================================
// ROTA PRINCIPAL — ANÁLISE DE PLANTA
// ============================================================================
app.post('/analisar-planta', upload.single('foto'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      console.log('❌ Nenhum arquivo enviado.');
      return res.status(400).json({ erro: 'Nenhuma foto foi enviada.' });
    }

    console.log('\n--------------------------------------------------');
    console.log('📸 Arquivo recebido:', file.originalname);
    console.log('📄 Tipo:', file.mimetype);

    // 1. UPLOAD SUPABASE STORAGE
    const fileName = `${Date.now()}-${file.originalname}`;
    const { error: storageError } = await supabase.storage
      .from('plantas')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (storageError) {
      console.error('❌ Erro no Supabase Storage:', storageError.message);
      return res.status(500).json({ erro: `Erro no Supabase: ${storageError.message}` });
    }

    const { data: publicData } = supabase.storage
      .from('plantas')
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;
    console.log('✅ Upload concluído no Supabase:', publicUrl);

    // 2. PREPARAR PROCESSAMENTO DA IA
    const base64Image = file.buffer.toString('base64');
    let dadosIA = null;
    let planta3D = null;

    // 3. TENTATIVA 1 — GROQ
    try {
      const respostaGroq = await tentarGroq(base64Image, file.mimetype);
      console.log('🤖 RESPOSTA BRUTA DA GROQ:', respostaGroq);

      dadosIA = extrairJSON(respostaGroq);
      dadosIA = validarPlanta3D(dadosIA);
      planta3D = dadosIA.planta3D;

      console.log('🎉 Sucesso via GROQ!');
    } catch (err) {
      console.warn('⚠️ Groq falhou:', err.message);
      dadosIA = null;
      planta3D = null;
    }

    // 4. TENTATIVA 2 — OPENROUTER (FALLBACK 1)
    if (!planta3D) {
      try {
        const respostaOpenRouter = await tentarOpenRouter(base64Image, file.mimetype);
        console.log('🤖 RESPOSTA BRUTA DO OPENROUTER:', respostaOpenRouter);

        dadosIA = extrairJSON(respostaOpenRouter);
        dadosIA = validarPlanta3D(dadosIA);
        planta3D = dadosIA.planta3D;

        console.log('🎉 Sucesso via OPENROUTER!');
      } catch (err) {
        console.warn('⚠️ OpenRouter falhou:', err.message);
        dadosIA = null;
        planta3D = null;
      }
    }

    // 5. TENTATIVA 3 — GEMINI (FALLBACK 2)
    if (!planta3D) {
      try {
        const respostaGemini = await tentarGemini(file.buffer, file.mimetype);
        console.log('🤖 RESPOSTA BRUTA DO GEMINI:', respostaGemini);

        dadosIA = extrairJSON(respostaGemini);
        dadosIA = validarPlanta3D(dadosIA);
        planta3D = dadosIA.planta3D;

        console.log('🎉 Sucesso via GEMINI!');
      } catch (err) {
        console.warn('⚠️ Gemini falhou:', err.message);
        dadosIA = null;
        planta3D = null;
      }
    }

    // 6. RESPOSTA EM CASO DE FALHA TOTAL
    if (!planta3D) {
      console.warn('⚠️ Todas as IAs falharam.');
      console.log('--------------------------------------------------\n');
      return res.status(503).json({
        erro: 'Não foi possível analisar a planta com a IA.',
        imageUrl: publicUrl
      });
    }

    // 7. DEBUG E SUCESSO
    console.log('✅ Planta 3D criada com sucesso.');
    console.log('🏠 Ambientes:', planta3D.ambientes.length);
    console.log('🧱 Paredes:', planta3D.paredes.length);
    console.log('🚪 Portas:', planta3D.portas.length);
    console.log('🪟 Janelas:', planta3D.janelas.length);
    console.log('--------------------------------------------------\n');

    return res.json({
      imageUrl: publicUrl,
      analise: dadosIA.resumo || 'Análise concluída.',
      planta3D: planta3D
    });

  } catch (error) {
    console.error('💥 Erro Geral no Servidor:', error);
    return res.status(500).json({
      erro: 'Ocorreu um erro ao processar a planta.',
      detalhe: error.message
    });
  }
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor DraftUp rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/analisar-planta`);
});