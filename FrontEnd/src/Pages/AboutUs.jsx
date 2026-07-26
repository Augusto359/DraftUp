import React from "react";
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div id="global" className="w-full min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start font-sans antialiased">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-gray-100 my-6">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-100 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">DraftUp</h1>
          <nav className="flex gap-4 text-xs sm:text-sm font-semibold">
            <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Início</Link>
            <Link to="/AboutUs" className="text-orange-600 font-bold">Sobre</Link>
            <Link to="/#como-funciona" className="text-gray-600 hover:text-orange-600 transition-colors">Como funciona</Link>
            <Link to="/#chamada-final" className="text-gray-600 hover:text-orange-600 transition-colors">Contatos</Link>
          </nav>
        </header>

        {/* Hero do Sobre Nós */}
        <section className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
            Nossa História
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-4">
            Descomplicando a arquitetura, uma planta de cada vez.
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            O DraftUp nasceu de uma constatação simples: plantas baixas são desenhadas por especialistas, para especialistas. Mas quem vai morar, construir ou reformar nem sempre fala essa linguagem técnica.
          </p>
        </section>

        {/* O Problema e a Solução */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-2">O Desafio</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Símbolos indecifráveis, espessuras de linha, cotas e jargões tornam a leitura de um projeto frustrante. Isso gera dúvidas sobre quais paredes podem ser derrubadas, onde entra a luz solar ou como o espaço realmente vai funcionar no dia a dia.
            </p>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h3 className="font-bold text-lg text-orange-950 mb-2">Nossa Solução</h3>
            <p className="text-orange-900 text-sm leading-relaxed">
              Unimos tecnologia e inteligência artificial para "traduzir" arquivos técnicos em explicações visuais, diretas e fáceis de entender. Mostramos onde estão os cômodos, fluxos e estruturas sem enrolação.
            </p>
          </div>
        </div>

        {/* Pilares */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">No que acreditamos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Clareza Absoluta</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Qualquer pessoa deve ser capaz de entender o espaço onde vai viver ou investir.
              </p>
            </div>

            <div className="p-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Tecnologia Acessível</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Usamos IA para acelerar a leitura de dados complexos em poucos segundos.
              </p>
            </div>

            <div className="p-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Autonomia</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Damos o poder ao cliente de tomar decisões mais seguras antes de começar a obra.
              </p>
            </div>
          </div>
        </section>

        {/* Chamada para Ação */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Quer ver como funciona na prática?</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Faça o upload de uma planta baixa e receba uma análise explicativa instantânea.
          </p>
          <div>
            <Link 
              to="/upload" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-3 px-6 rounded-lg transition-colors"
            >
              Testar Agora
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}