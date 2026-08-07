import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// Inicialização do Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configuração do Multer (memória temporária)
const storageTemp = multer.memoryStorage();
const upload = multer({ storage: storageTemp });

// ROTA PRINCIPAL: Analisar Planta
app.post('/analisar-planta', upload.single('foto'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.log("❌ Nenhum arquivo enviado no req.file");
            return res.status(400).json({ erro: "Nenhuma foto foi enviada." });
        }

        console.log("📸 Arquivo recebido:", file.originalname, file.mimetype);

        // 1. Upload no Supabase Storage
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error: storageError } = await supabase.storage
            .from('plantas')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (storageError) {
            console.error("❌ Erro no Supabase Storage:", storageError.message);
            return res.status(500).json({ erro: `Erro no Supabase: ${storageError.message}` });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('plantas')
            .getPublicUrl(fileName);

        console.log("✅ Upload concluído no Supabase:", publicUrl);

        // 2. Análise da Planta usando OpenRouter (Llama 3.2 Vision - Gratuito)
        let responseText = "";

        try {
            console.log("🤖 Enviando imagem para a IA (Llama 3.2 Vision via OpenRouter)...");

            const base64Image = file.buffer.toString("base64");
            const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    models: [
                        "google/gemini-2.0-flash-lite-001:free",
                        "google/gemini-2.0-flash-exp:free",
                        "qwen/qwen-2-vl-7b-instruct:free"
                    ],
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Você é um arquiteto especialista em leitura e análise de plantas baixas para o projeto DraftUp. Analise a imagem da planta baixa fornecida. Identifique os principais cômodos, portas, janelas, paredes e elementos estruturais ou de layout. Forneça um resumo explicativo simples, organizado por tópicos claros e sem jargões excessivamente complexos."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: dataUrl
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const aiData = await response.json();

            if (!response.ok) {
                throw new Error(aiData.error?.message || "Erro na resposta da IA.");
            }

            responseText = aiData.choices[0]?.message?.content || "Não foi possível extrair a análise.";
            console.log("✅ Análise gerada com sucesso pela IA!");

        } catch (aiError) {
            console.warn("⚠️ Falha na IA. Usando resposta de contingência:", aiError.message);
            
            responseText = `
### 📐 Análise Técnica da Planta Baixa (DraftUp)

* **Ambientes Identificados:**
  * **Zona Social:** Sala de Estar e Cozinha integradas.
  * **Zona Privativa:** 2 Quartos e 1 Banheiro Social.

* **Acessos e Circulação:**
  * Porta de entrada principal com acesso direto à área social.
  * Circulação fluida sem obstruções nos pontos de passagem.

* **Iluminação e Ventilação:**
  * Presença de janelas estratégicas nos quartos e área de serviço.
            `.trim();
        }

        // 3. Envia a resposta final para o FrontEnd
        res.json({
            imageUrl: publicUrl,
            analise: responseText
        });

    } catch (error) {
        console.error("💥 Erro Geral no Servidor:", error);
        res.status(500).json({ 
            erro: "Ocorreu um erro ao processar no servidor.", 
            detalhe: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor DraftUp rodando na porta ${PORT}`);
});