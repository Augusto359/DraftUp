import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ModeloGLB from '../components/ModeloGLB';
console.log('🔥 VIEWER 3D FOI CARREGADO');

export default function Viewer3D() {
  const location = useLocation();
  const navigate = useNavigate();

  const arquivo = location.state?.arquivo;
  const resumo = location.state?.resumo;
  const glbUrl = location.state?.glbUrl;

  const [modoModoVisualizacao, setModoVisualizacao] = useState('3d');

  if (!resumo && !arquivo) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <p className="text-gray-600 mb-4">Nenhuma planta foi carregada para visualização 3D.</p>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Ir para Upload
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-8 font-sans antialiased flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <header className="flex justify-between items-center pb-4 border-b border-gray-200 bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DraftUp <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2">Visualizador 3D</span></h1>
          <nav className="flex gap-4 text-xs sm:text-sm font-semibold items-center">
            <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Início</Link>
            <Link to="/upload" className="text-orange-600 font-bold hover:underline">Nova Planta</Link>
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-xl min-h-[450px] border border-slate-800 relative overflow-hidden">
            
            <div className="flex justify-between items-center z-10">
              <span className="text-xs text-slate-300 bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg">
                Projeto: <b>{arquivo?.name || 'Planta_Processada.png'}</b>
              </span>

              <div className="flex gap-1 bg-slate-800/80 backdrop-blur p-1 rounded-lg border border-slate-700 text-xs">
                <button 
                  onClick={() => setModoVisualizacao('3d')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${modoModoVisualizacao === '3d' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Vista 3D
                </button>
                <button 
                  onClick={() => setModoVisualizacao('planta')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${modoModoVisualizacao === 'planta' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Planta 2D
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center my-4 relative">
              {modoModoVisualizacao === '3d' ? (
    <div className="absolute inset-0">
        {glbUrl ? (
            <ModeloGLB glbUrl={glbUrl} />
        ) : (
            <div className="h-full flex items-center justify-center text-center text-slate-400">
                <div>
                    <p className="text-sm font-medium text-slate-300">
                        Modelo 3D indisponível
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                        A IA não conseguiu gerar os dados da planta.
                    </p>
                </div>
            </div>
        )}
    </div>
              ) : (
                <div className="max-h-80 overflow-hidden rounded-lg border border-slate-700">
                  {arquivo && typeof arquivo === 'object' ? (
                    <img 
                      src={URL.createObjectURL(arquivo)} 
                      alt="Planta Baixa 2D" 
                      className="max-h-72 object-contain mx-auto"
                    />
                  ) : (
                    <p className="text-slate-400 text-xs">Visualização 2D da planta baixa original</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 px-1">
              <span>Status: <strong className="text-emerald-400">Renderizado</strong></span>
              <span>Estrutura identificada via YOLO + Trimesh</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Relatório Técnico</h3>
                  <p className="text-xs text-gray-500">Tradução simplificada da planta</p>
                </div>
              </div>

              <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-[350px] overflow-y-auto">
                {resumo}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button 
                onClick={() => window.print()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir / Salvar Relatório
              </button>

              <Link
                to="/upload"
                className="w-full text-center bg-white hover:bg-gray-50 text-gray-600 font-semibold py-2.5 px-4 rounded-xl text-xs border border-gray-200 transition-colors"
              >
                Analisar Outro Projeto
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}