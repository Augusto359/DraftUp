import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 sm:p-6 font-sans antialiased">
      {/* Container Centralizado */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header Padronizado */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">DraftUp</h1>
          <nav className="flex gap-4 text-xs sm:text-sm font-semibold">
            <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Início</Link>
            <Link to="/AboutUs" className="text-gray-600 hover:text-orange-600 transition-colors">Sobre</Link>
            <Link to="/#como-funciona" className="text-gray-600 hover:text-orange-600 transition-colors">Como funciona</Link>
            <Link to="/#chamada-final" className="text-gray-600 hover:text-orange-600 transition-colors">Contatos</Link>
          </nav>
        </header>

        {/* Conteúdo Temático de Arquitetura */}
        <main className="flex-1 flex flex-col justify-center items-center text-center my-auto py-8">
          
          {/* Badge estilo Cota de Projeto */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Erro 404 • Ambiente Não Encontrado
          </div>

          {/* Número 404 com ícone de casinha */}
          <div className="relative mb-6">
            <h2 className="text-8xl sm:text-9xl font-black text-gray-200 tracking-tighter select-none">
              404
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                {/* Ícone de Casinha Ajustado */}
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 max-w-md">
            Essa página ficou fora do projeto!
          </h3>

          <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed mb-8">
            Medimos todas as cotas e paredes, mas a rota que você tentou acessar não consta na planta baixa do <b>DraftUp</b>.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md text-sm text-center"
            >
              Voltar para o Início
            </Link>
            <Link
              to="/upload"
              className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors text-sm text-center shadow-sm"
            >
              Enviar uma Planta
            </Link>
          </div>

        </main>

        {/* Rodapé sutil */}
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 mt-auto">
          DraftUp — Traduzindo a arquitetura para você.
        </footer>

      </div>
    </div>
  );
}