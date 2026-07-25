import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    // Container Principal envelopando TODO o JSX
    <div className="max-w-4xl my-10 mx-auto px-5 text-[#333] font-sans leading-relaxed">
      
      {/* Header */}
      <div id="header">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-5xl font-bold">DraftUp</h1>
          <nav className="flex gap-4">
            <Link to="/" className='text-orange-600 underline font-medium'>Início</Link>
            <a href="#como-funciona" className='text-orange-600 underline font-medium'>Sobre</a>
            <a href="#como-funciona" className='text-orange-600 underline font-medium'>Como funciona</a>
            <a href="#chamada-final" className='text-orange-600 underline font-medium'>Contatos</a>
          </nav>
        </header>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Hero Section */}
      <section className="my-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Entenda sua planta sem complicação</h2>
        <p className="text-gray-600 text-lg mb-6">
          Transformamos plantas em explicações simples e visuais para proprietários, clientes e profissionais.
        </p>
        
        <Link to='/upload' id="envplanta" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
          Enviar Planta
        </Link>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Problema / Solução */}
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-3">Plantas são feitas para especialistas</h2>
        <p className="text-gray-600 leading-relaxed">
          Muitas pessoas recebem uma planta e não conseguem identificar paredes estruturais, tubulações, portas ou possíveis limitações da obra. 
          Isso gera dúvidas, insegurança e erros durante reformas e construções.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Grid de Funcionalidades */}
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-6">O DraftUp traduz a linguagem técnica</h2>
        <div className="cards grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Envie sua planta</h3>
            <p className="text-gray-600">Faça upload do arquivo em poucos segundos.</p>
          </div>

          <div className="card border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Identifique elementos importantes</h3>
            <p className="text-gray-600">Localize portas, paredes, janelas e estruturas essenciais.</p>
          </div>

          <div className="card border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Visualize em linguagem simples</h3>
            <p className="text-gray-600">Entenda o que cada elemento significa para sua obra.</p>
          </div>

          <div className="card border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Veja em 3D</h3>
            <p className="text-gray-600">Transforme informações técnicas em uma visualização fácil de interpretar.</p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-gray-200" />
      
      {/* Como Funciona */}
      <div id="como-funciona" className="my-8 text-center">
        <h2 className="text-2xl font-bold mb-8">Como funciona?</h2>

        <div className="step bg-slate-50 p-4 rounded-xl max-w-md mx-auto">
          <h4 className="text-lg">
            <b className="text-orange-600">Primeiro passo:</b><br />
            Envie sua planta
          </h4>
        </div>
        
        {/* Seta Divisora */}
        <div className="flex justify-center my-6 text-orange-400">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <div className="step bg-slate-50 p-4 rounded-xl max-w-md mx-auto">
          <h4 className="text-lg">
            <b className="text-orange-600">Segundo passo:</b><br />
            Receba a análise dos elementos
          </h4>
        </div>
      
        <div className="flex justify-center my-6 text-orange-400">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <div className="step bg-slate-50 p-4 rounded-xl max-w-md mx-auto">
          <h4 className="text-lg">
            <b className="text-orange-600">Terceiro passo:</b><br />
            Explore a explicação simplificada
          </h4>
        </div>

        <div className="flex justify-center my-6 text-orange-400">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <div className="step bg-slate-50 p-4 rounded-xl max-w-md mx-auto">
          <h4 className="text-lg">
            <b className="text-orange-600">Quarto passo:</b><br />
            Visualize o resultado em 3D
          </h4>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Chamada Final */}
      <div id="chamada-final" className="text-center my-12 bg-orange-50 p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-2">Pronto para entender sua planta?</h3>
        <p className="text-gray-600 mb-6">Envie seu arquivo e descubra cada detalhe da sua construção de forma simples e visual!</p>
        <Link to='/upload' className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
          Começar Agora
        </Link>
      </div>

    </div>
  );
}