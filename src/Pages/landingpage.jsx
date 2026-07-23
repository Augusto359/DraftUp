import React from 'react';
import { Link } from 'react-router-dom';
// Se os estilos estiverem no CSS global do Vite, você não precisa importar aqui.

export default function LandingPage() {
  return (
    <div className="max-w-[700px] my-10 mx-auto px-5 text-[#333] font-sans leading-relaxed">
      
      <header>
        <h1 className="font-bold text-3xl">DraftUp</h1>
      </header>

      <h2 className="text-2xl font-semibold mt-6">Entenda sua planta sem complicação</h2>
      <p>Transformamos plantas em explicações simples e visuais para proprietários, clientes e profissionais</p>
      <br />
      <br /> {/* arrumado o comentário anterior */}
      
      <Link to='/upload' id="envplanta" className="bg-orange-500 text-white p-2 rounded">
        Enviar Planta
      </Link>
      <hr className="my-6 border-gray-200" />

      <h2>Plantas são feitas para especialistas</h2>
      <p>
        Muitas pessoas recebem uma planta e não conseguem identificar paredes estruturais, tubulações, portas ou possíveis limitações da obra. <br />
        Isso gera dúvidas, insegurança e erros durante reformas e construções.
      </p>
      <hr className="my-6 border-gray-200" />

      <h2>O Construlink traduz a linguagem técnica</h2>
      <section className="cards grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border p-4 rounded-xl">
          <h3>Envie sua planta</h3>
          <p>Faça upload do arquivo em poucos segundos</p>
        </div>

        <div className="card border p-4 rounded-xl">
          <h3>Identifique elementos importantes</h3>
          <p>Localize portas, paredes, janelas e estruturas essenciais.</p>
        </div>

        <div className="card border p-4 rounded-xl">
          <h3>Visualize em linguagem simples</h3>
          <p>Entenda o que cada elemento significa para sua obra.</p>
        </div>

        <div className="card border p-4 rounded-xl">
          <h3>Veja em 3D</h3>
          <p>Transforme informações técnicas em uma visualização fácil de interpretar.</p>
        </div>
      </section>

      <hr className="my-6 border-gray-200" />
      
      <div id="como-funciona">
        <h2>Como funciona?</h2>

        <h4>
          <b>Primeiro passo:</b><br />
          Envie sua planta
        </h4>
        
        {/* Divisor Seta convertido */}
        <div className="flex justify-center my-12 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <h4>
          <b>Segundo passo:</b><br />
          Receba a análise dos elementos
        </h4>
      
        <div className="flex justify-center my-12 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <h4>
          <b>Terceiro passo:</b><br />
          Explore a explicação simplificada
        </h4>

        <div className="flex justify-center my-12 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      
        <h4>
          <b>Quarto passo:</b><br />
          Visualize o resultado em 3D
        </h4>
      </div>

      <hr className="my-6 border-gray-200" />

      <div id="chamada-final" className="text-center my-8">
        <h3>Pronto para entender sua planta?</h3>
        <p>Envie seu arquivo e descubra cada detalhe da sua construção de forma simples e visual!</p>
        <Link to='/upload' className="bg-orange-500 text-white p-3 rounded-lg mt-4">
          Começar Agora
        </Link>
      </div>

    </div>
  );
}