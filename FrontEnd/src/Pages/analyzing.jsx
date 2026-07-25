import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function AnalyzingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const arquivo = location.state?.arquivo;

  const [carregando, setCarregando] = useState(true);
  const [analise, setAnalise] = useState(null);
  const [erro, setErro] = useState(null);

  // 💡 Trava de segurança contra execuções duplas no React (Strict Mode)
  const requisicaoFeita = useRef(false);

  useEffect(() => {
    if (!arquivo) {
      navigate('/upload');
      return;
    }

    // Se já disparou a requisição nesta sessão, bloqueia a segunda chamada
    if (requisicaoFeita.current) return;
    requisicaoFeita.current = true;

    const enviarParaBackend = async () => {
      setCarregando(true);
      setErro(null);

      const formData = new FormData();
      // O nome do campo DEVE ser 'foto' para bater com upload.single('foto') do Multer
      formData.append('foto', arquivo);

      try {
        // ⚠️ Se estiver testando no celular/ngrok, mude para a URL do seu ngrok do backend ou crie uma var de ambiente
      const response = await fetch('/analisar-planta', {
         method: 'POST',
         body: formData,
});

        if (!response.ok) {
          throw new Error('Falha ao processar a planta baixa.');
        }

        const data = await response.json();
        // Lendo o campo 'analise' que vem do res.json({ analise: ... })
        setAnalise(data.analise);
      } catch (err) {
        console.error('Erro na análise:', err);
        setErro('Ocorreu um erro ao processar seu arquivo no servidor.');
      } finally {
        setCarregando(false);
      }
    };

    enviarParaBackend();
  }, [arquivo, navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-center font-sans antialiased">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-gray-100">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DraftUp</h1>
          <Link to="/upload" className="text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors">
            ← Enviar outro arquivo
          </Link>
        </header>

        {/* Estado CARREGANDO */}
        {carregando && (
          <div className="text-center py-12 space-y-6">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Analisando sua planta...</h2>
              <p className="text-sm text-gray-500">
                Processando o arquivo <span className="font-medium text-gray-700">{arquivo?.name}</span>.
              </p>
            </div>
          </div>
        )}

        {/* Estado ERRO */}
        {erro && (
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm max-w-md mx-auto">
              {erro}
            </div>
            <button 
              onClick={() => navigate('/upload')}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors"
            >
              Voltar e Tentar Novamente
            </button>
          </div>
        )}

        {/* Estado SUCESSO */}
        {!carregando && analise && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div>
                <h2 className="text-sm font-bold text-orange-950">Análise Concluída</h2>
                <p className="text-xs text-orange-700">Arquivo: {arquivo?.name}</p>
              </div>
              <span className="bg-orange-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                Pronto
              </span>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-800 text-sm leading-relaxed whitespace-pre-line space-y-3">
              {analise}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Link 
                to="/upload" 
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
              >
                Analisar Outra Planta
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}