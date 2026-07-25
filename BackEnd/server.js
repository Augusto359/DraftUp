import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Define o caminho absoluto do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. DECLARAÇÃO DO APP
const app = express();

app.use(cors());
app.use(express.json());

// Aponta para a pasta FrontEnd
app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// 2. Inicialização do Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 3. Configuração do Multer (memória temporária)
const storageTemp = multer.memoryStorage();
const upload = multer({ storage: storageTemp });

// 4. ROTA PRINCIPAL: Analisar Planta
app.post('/analisar-planta', upload.single('foto'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.log("❌ Nenhum arquivo enviado no req.file");
            return res.status(400).json({ erro: "Nenhuma foto foi enviada." });
        }

        console.log("📸 Arquivo recebido:", file.originalname, file.mimetype);

        // Upload no Supabase (continua funcionando normalmente)
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

        // ============================================================
        // 🧪 MOCK TEMPORÁRIO (Simulação para não gastar cota da API)
        // ============================================================
        console.log("🤖 [MODO MOCK] Gerando análise simulada...");

        // Simula um delay de 1.5 segundos como se a IA estivesse pensando
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responseText = `
### 📐 Análise Técnica da Planta Baixa (DraftUp)

* **Ambientes Identificados:**
  * **Zona Social:** Sala de Estar e Cozinha integradas.
  * **Zona Privativa:** 2 Quartos e 1 Banheiro Social.

* **Acessos e Circulação:**
  * Porta de entrada principal com acesso direto à área social.
  * Circulação fluida sem obstruções nos pontos de passagem.

* **Iluminação e Ventilação:**
  * Presença de janelas estratégicas nos quartos e área de serviço, favorecendo a iluminação natural.
        `.trim();

        /* 
        // ------------------------------------------------------------
        // 🔮 CÓDIGO REAL DO GEMINI (Descomente quando a cota resetar)
        // ------------------------------------------------------------
        console.log("🤖 Enviando imagem para o Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const imageParts = [
            {
                inlineData: {
                    data: file.buffer.toString("base64"),
                    mimeType: file.mimetype,
                },
            },
        ];

        const prompt = `Você é um arquiteto especialista em leitura e análise de plantas baixas para o projeto DraftUp.
Analise a imagem da planta baixa fornecida.
Identifique os principais cômodos, portas, janelas, paredes e elementos estruturais ou de layout.
Forneça um resumo explicativo simples, organizado por tópicos claros e sem jargões excessivamente complexos.`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();
        */

        console.log("✅ Análise (Simulada) gerada com sucesso!");

        res.json({
            imageUrl: publicUrl,
            analise: responseText
        });

    } catch (error) {
        console.error("💥 Erro Geral no Servidor:", error);
        res.status(500).json({ erro: "Ocorreu um erro ao processar no servidor.", detalhe: error.message });
    }
});

// 5. Inicialização da Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor DraftUp rodando na porta ${PORT}`);
});