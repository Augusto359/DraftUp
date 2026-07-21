import React from 'react'
import { useState } from 'react';
import bgUpload from '../../imagens/upload.png'


export default function Upload() {
  const [arquivo, setArquivo] = useState(null);

  return (

    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgUpload})`}}>
      {/* logo aqui */}
      {/* logo aqui */}
      {/* logo aqui */}
      
      <div id="header">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-5xl text-center bold">DraftUp</h1>
          <nav className="flex gap-4">
              <a href="#" className='text-blue-600 underline'>Início</a>
              <a href="#" className='text-blue-600 underline'>Sobre</a>
              <a href="#" className='text-blue-600 underline'>Como funciona</a>
              <a href="#" className='text-blue-600 underline'>Contatos</a>
          </nav>
        </header>
      </div>
    <br />
    <hr className='border-t-gray-500' />
    <br />

    <section id='Hero'>
      <h2>Envie sua planta</h2>
      <p>Faça upload da sua planta baixa e receba uma explicação simples dos elementos encontrados.</p>
    </section>  
    <br />
    <hr className='border-t-gray-500' />
    <br />

  <button className='bg-white hover:bg-gray-600 text-black px-2 py-2 border border-black rounded-md mb-4'>Envie sua planta</button>

    <div id='upload'>
      <input className='bg-white hover:bg-gray-600 text-black px-2 py-2 border border-black rounded-md'
        type="file"
        onChange={(e) => setArquivo(e.target.files[0])}
      />
      {arquivo && <p>Arquivo: {arquivo.name}</p>}

    

    </div>


    <section id='infos'>
    <h3>Arquivos aceitos:</h3>
    <ol>
      PDF <br />
      JPG <br />
      PNG <br />
    </ol>


    </section>


    
      </div>
  );
}