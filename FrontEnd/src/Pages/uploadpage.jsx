import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgUpload from '../../imagens/upload.png';
import Cloud from '../../imagens/cloud.png';

export default function Upload() {
  const [arquivo, setArquivo] = useState(null);
  const [arrastando, setArrastando] = useState(false);
  const [mostrarcard, setMostrarcard] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validação unificada de arquivos (MIME types)
  const validarEGuardarArquivo = (file) => {
    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];

    if (!tiposPermitidos.includes(file.type)) {
      alert('Formato não suportado. Envie PDF, JPG, PNG ou WEBP.');
      return;
    }

    setArquivo(file);
  };

  // Redireciona para a página de análise enviando o arquivo
  const handleEnviar = () => {
    if (!arquivo || loading) return;
    
    setLoading(true);
    navigate('/analyzing', { state: { arquivo } });
  };

  return (
    <div 
      className="w-full min-h-screen bg-cover bg-center fixed inset-0 overflow-y-auto py-10 px-4 flex items-center justify-center font-sans antialiased"
      style={{ backgroundImage: `url(${bgUpload})` }}
    >
      {/* Overlay sutil para leitura */}
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] pointer-events-none" />

      {/* Container Principal */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-gray-100 my-auto">
        
        {/* Header Padronizado */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">DraftUp</h1>
          <nav className="flex gap-4 text-xs sm:text-sm font-semibold">
            <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Início</Link>
            <Link to="/AboutUs" className="text-gray-600 hover:text-orange-600 transition-colors">Sobre</Link>
            <Link to="/#como-funciona" className="text-gray-600 hover:text-orange-600 transition-colors">Como funciona</Link>
            <Link to="/#chamada-final" className="text-gray-600 hover:text-orange-600 transition-colors">Contatos</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="Hero" className="text-center my-8 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Envie sua planta
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Faça upload da sua planta baixa para visualizar e entender os elementos do projeto de forma simples.
          </p>
        </section>  

        {/* Seção de Upload */}
        <div id="upload" className="flex flex-col gap-4 max-w-xl mx-auto my-6">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold text-gray-500">Formatos aceitos</span>
            <span className="text-xs text-gray-400">PDF, JPG, PNG, WEBP</span>
          </div>

          {/* Área de Dropzone Atualizada */}
          <label
            className={`group border-2 border-dashed rounded-xl p-8 flex flex-col justify-center items-center gap-3 cursor-pointer transition-all text-center ${
              arrastando
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-500 bg-gray-50/50 hover:bg-orange-50/20'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setArrastando(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (e.currentTarget.contains(e.relatedTarget)) return;

              setArrastando(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setArrastando(false);

              const arquivoSolto = e.dataTransfer.files[0];
              if (arquivoSolto) {
                validarEGuardarArquivo(arquivoSolto);
              }
            }}
          >
            <img
              src={Cloud}
              alt="Nuvem de Upload"
              className={`w-10 h-10 transition-opacity pointer-events-none ${
                arrastando ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'
              }`}
            />

            <div className="space-y-1 pointer-events-none">
              <p className="text-gray-800 font-medium text-sm">
                {arrastando ? (
                  <span className="text-orange-600 font-bold">
                    Solte sua planta aqui!
                  </span>
                ) : (
                  <>
                    Arraste seu arquivo aqui ou{' '}
                    <span className="text-orange-600 underline underline-offset-2">
                      clique para selecionar
                    </span>
                  </>
                )}
              </p>
            </div>

            <span className="mt-2 bg-white group-hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-300 shadow-sm transition-all pointer-events-none">
              Escolher arquivo
            </span>

            <input
              className="hidden"
              type="file"
              accept="image/jpeg, image/png, image/webp, application/pdf"
              onChange={(e) => {
                const arquivoSelecionado = e.target.files[0];
                if (arquivoSelecionado) {
                  validarEGuardarArquivo(arquivoSelecionado);
                }
              }}
            />

            {arquivo && (
              <div className="mt-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 pointer-events-none">
                ✓ {arquivo.name}
              </div>
            )}
          </label>

          {/* Botão de Envio */}
          <button 
            onClick={handleEnviar}
            disabled={!arquivo || loading}
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Enviando...' : 'Enviar planta'}
          </button>
        </div>

        {/* Passos Simples */}
        <section id="infos" className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8 pt-6 border-t border-gray-100">
          {[
            "1. Upload da planta",
            "2. Leitura dos elementos",
            "3. Resumo simplificado",
            "4. Visualização 3D"
          ].map((texto, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center text-xs font-medium text-gray-600">
              {texto}
            </div>
          ))}

          <button 
            onClick={() => setMostrarcard(true)} 
            className="col-span-2 md:col-span-4 w-fit mx-auto mt-2 px-4 py-2 text-xs font-semibold text-gray-600 hover:text-orange-600 transition-colors"
          >
            Não tem uma planta? Use um exemplo →
          </button>
        </section>

        {/* Modal Clean */}
        {mostrarcard && (
          <div className="fixed inset-0 bg-slate-900/40 text-center flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-5 max-w-sm w-full shadow-lg border border-gray-100">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Usar planta de exemplo?
                </h3>
                <p className="text-xs text-gray-500">
                  Você poderá testar todas as funcionalidades do sistema sem precisar carregar um arquivo próprio.
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setMostrarcard(false)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xs transition-colors"
                >
                  Carregar Exemplo
                </button>
                <button 
                  onClick={() => setMostrarcard(false)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-3 rounded-lg text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}