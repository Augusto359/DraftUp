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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO CRÍTICO: SUPABASE_URL ou SUPABASE_KEY não foram encontradas no arquivo .env");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
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

  if (!dados.planta3D && (dados.ambientes || dados.paredes)) {
    dados = {
      resumo: dados.resumo || 'Planta baixa analisada.',
      planta3D: {
        ambientes: dados.ambientes || [],
        paredes: dados.paredes || [],
        portas: dados.portas || [],
        janelas: dados.janelas || [],
        piso: dados.piso || { largura: 10, comprimento: 10 }
      }
    };
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
// ============================================================================
// FUNÇÕES DE REQUISIÇÃO ÀS IAs
// ============================================================================
// ============================================================================
// NORMALIZAÇÃO DE ESCALA (pixels -> metros)
// ============================================================================
function normalizarEscalaParaMetros(planta3D, targetMaiorLadoMetros = 12) {
  const todosElementos = [
    ...(planta3D.paredes || []),
    ...(planta3D.portas || []),
    ...(planta3D.janelas || []),
  ];

  if (todosElementos.length === 0) {
    return planta3D;
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const el of todosElementos) {
    const tamanho = el.comprimento || el.largura || 0;
    const x = el.x || 0;
    const y = el.y || 0;

    minX = Math.min(minX, x - tamanho / 2);
    maxX = Math.max(maxX, x + tamanho / 2);
    minY = Math.min(minY, y - tamanho / 2);
    maxY = Math.max(maxY, y + tamanho / 2);
  }

  const larguraPixels = maxX - minX;
  const alturaPixels = maxY - minY;
  const maiorLadoPixels = Math.max(larguraPixels, alturaPixels);

  if (maiorLadoPixels <= 0) {
    return planta3D;
  }

  const escala = targetMaiorLadoMetros / maiorLadoPixels;
  const centroX = (minX + maxX) / 2;
  const centroY = (minY + maxY) / 2;

  function escalarElemento(el, campoTamanho) {
    const novo = { ...el };
    novo.x = ((el.x || 0) - centroX) * escala;
    novo.y = ((el.y || 0) - centroY) * escala;
    if (el[campoTamanho] != null) {
      novo[campoTamanho] = el[campoTamanho] * escala;
    }
    return novo;
  }

  return {
    ...planta3D,
    paredes: (planta3D.paredes || []).map(p => escalarElemento(p, 'comprimento')),
    portas: (planta3D.portas || []).map(p => escalarElemento(p, 'largura')),
    janelas: (planta3D.janelas || []).map(j => escalarElemento(j, 'largura')),
    piso: {
      largura: Math.max(larguraPixels * escala, 1),
      comprimento: Math.max(alturaPixels * escala, 1),
    },
  };
}

async function tentarYolo(fileBuffer, mimeType, originalname) {
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, originalname);

  const response = await fetch('http://localhost:8000/analisar-planta', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || `YOLO API retornou HTTP ${response.status}`);
  }

  const data = await response.json();
  
  // 🧠 AQUI O TERMINAL DO NODE VAI MOSTRAR TUDO O QUE O YOLO PENSOU:
  console.log("🧠 O que o YOLO pensou (JSON bruto):", JSON.stringify(data, null, 2));

  const totalElementos = data.elementos?.length || 0;
  const paredes = data.paredes || data.elementos?.filter(e => e.classe === 'parede') || [];
  const portas = data.portas || data.elementos?.filter(e => e.classe === 'porta') || [];
  const janelas = data.janelas || data.elementos?.filter(e => e.classe === 'janela') || [];

    const planta3DBruta = {
    ambientes: data.ambientes || [],
    paredes: paredes,
    portas: portas,
    janelas: janelas,
    piso: data.piso || { largura: 10, comprimento: 10 }
  };

  const planta3DNormalizada = normalizarEscalaParaMetros(planta3DBruta);

  return {
    resumo: `Análise local concluída via YOLO. Foram detectados ${totalElementos} elementos estruturais, contendo ${paredes.length} paredes, ${portas.length} portas e ${janelas.length} janelas mapeadas pelo seu modelo treinado.`,
    planta3D: planta3DNormalizada
  };
}

async function tentarGroq(base64Image, mimeType) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurada no .env.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.2-11b-vision-instruct',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: 'You are a JSON-only response bot. You must respond with a raw valid JSON object only. No markdown formatting, no code blocks, no intro or outro text.'
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

  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  const model = process.env.OPENROUTER_MODEL || 'qwen/qwen3.8-27b:free';

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
      return res.status(400).json({ erro: 'Nenhuma foto foi enviada.' });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const { error: storageError } = await supabase.storage
      .from('plantas')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (storageError) {
      return res.status(500).json({ erro: `Erro no Supabase: ${storageError.message}` });
    }

    const { data: publicData } = supabase.storage
      .from('plantas')
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;
    const base64Image = file.buffer.toString('base64');
    let dadosIA = null;
    let planta3D = null;

    try {
      const resultadoYolo = await tentarYolo(file.buffer, file.mimetype, file.originalname);
      dadosIA = resultadoYolo;
      planta3D = resultadoYolo.planta3D;
      console.log('🎉 Sucesso via YOLO!');
    } catch (err) {
      console.warn('⚠️ YOLO falhou ou está desligado:', err.message);
    }

    if (!planta3D) {
      try {
        const respostaGroq = await tentarGroq(base64Image, file.mimetype);
        dadosIA = extrairJSON(respostaGroq);
        dadosIA = validarPlanta3D(dadosIA);
        planta3D = dadosIA.planta3D;
        console.log('🎉 Sucesso via GROQ!');
      } catch (err) {
        console.warn('⚠️ Groq falhou:', err.message);
      }
    }

    if (!planta3D) {
      try {
        const respostaOpenRouter = await tentarOpenRouter(base64Image, file.mimetype);
        dadosIA = extrairJSON(respostaOpenRouter);
        dadosIA = validarPlanta3D(dadosIA);
        planta3D = dadosIA.planta3D;
        console.log('🎉 Sucesso via OPENROUTER!');
      } catch (err) {
        console.warn('⚠️ OpenRouter falhou:', err.message);
      }
    }

    if (!planta3D) {
      try {
        const respostaGemini = await tentarGemini(file.buffer, file.mimetype);
        dadosIA = extrairJSON(respostaGemini);
        dadosIA = validarPlanta3D(dadosIA);
        planta3D = dadosIA.planta3D;
        console.log('🎉 Sucesso via GEMINI!');
      } catch (err) {
        console.warn('⚠️ Gemini falhou:', err.message);
      }
    }

    if (!planta3D) {
      return res.status(503).json({
        erro: 'Não foi possível analisar a planta com a IA.',
        imageUrl: publicUrl
      });
    }

    return res.json({
      imageUrl: publicUrl,
      analise: dadosIA.resumo || 'Análise concluída.',
      planta3D: planta3D
    });

  } catch (error) {
    return res.status(500).json({
      erro: 'Ocorreu um erro ao processar a planta.',
      detalhe: error.message
    });
  }
});

// ============================================================================
// ROTA FALLBACK PARA REACT ROUTER (SPA)
// ============================================================================
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../FrontEnd/dist/index.html'));
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor DraftUp rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/analisar-planta`);
});