import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

// 1. Inicializa o cliente do Supabase com as chaves do seu arquivo .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2. Configura o Multer para receber o arquivo na memória temporária do servidor
const storageTemp = multer.memoryStorage();
const upload = multer({ storage: storageTemp });

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('Servidor DraftUp integrado com Supabase e Gemini!');
});

// 3. ROTA PRINCIPAL: Recebe a foto da planta enviada pelo site
app.post('/analisar-planta', upload.single('foto'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ erro: "Nenhuma foto foi enviada." });
        }

        // Gera um nome único para o arquivo não sobrescrever outras fotos (ex: 171829381-planta.jpg)
        const fileName = `${Date.now()}-${file.originalname}`;

        // Faz o upload da foto diretamente para o bucket 'plantas' que criamos no Supabase
        const { data, error } = await supabase.storage
            .from('plantas')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw new Error(`Erro no Supabase Storage: ${error.message}`);
        }

        // Pega o link público gerado para essa foto no Supabase
        const { data: { publicUrl } } = supabase.storage
            .from('plantas')
            .getPublicUrl(fileName);

        // 4. Inicializa o Gemini com o modelo visual (gemini-2.5-flash)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Prompt detalhado instruindo a IA sobre como analisar o link da imagem recebido
        const prompt = `Você é um bot botânico especialista em saúde de vegetais. 
        Analise a imagem contida neste link público: ${publicUrl}.
        Identifique a espécie da planta se possível, detecte doenças, pragas ou problemas visíveis e forneça recomendações práticas de cuidados em formato de texto estruturado.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 5. Retorna o link da imagem e o diagnóstico da IA para o seu Front-end exibir na tela
        res.json({
            imageUrl: publicUrl,
            analise: responseText
        });

    } catch (error) {
        console.error("Erro no processamento:", error);
        res.status(500).json({ erro: "Ocorreu um erro ao processar a imagem e a IA." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor atualizado rodando na porta ${PORT}`);
});
