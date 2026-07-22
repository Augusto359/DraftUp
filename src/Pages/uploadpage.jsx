import React from 'react'
import { useState } from 'react';
import bgUpload from '../../imagens/upload.png'
import Cloud from '../../imagens/cloud.png'


export default function Upload() {
  const [arquivo, setArquivo] = useState(null);

  return (

    <div className="w-full min-h-screen bg-cover bg-center absolute"
      style={{ backgroundImage: `url(${bgUpload})`}}>
      {/* logo aqui */}
      {/* logo aqui */}
      {/* logo aqui */}
      <div className='bg-white rounded-xl p-8 max-auto m-8 my-15 mx-8 shadow-md'>
        
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
        
          
        
            <div id='upload' className='flex flex-col gap-4'>
             <h3>Arquivos aceitos:</h3>
                <ol>
                PDF <br />
                JPG <br />
               PNG <br />
            </ol>
        <div className='border border-gray-400 border-dashed p-6 flex justify-center flex-col ' style={{backgroundImage: `url(${Cloud})`, backgroundSize: "120px", backgroundPosition: "center 15%", backgroundRepeat: "no-repeat"}}>
          <p>Arraste um arquivo ou</p> <br />
          <p>Selecione um:</p>
          <input className='bg-white hover:shadow-xl hover:border-blue-400 text-black px-2 py-2 border border-black rounded-md '
            type="file"
            onChange={(e) => setArquivo(e.target.files[0])}
          />
          {arquivo && <p>Arquivo: {arquivo.name}</p>}
        </div>
        
          <button className='bg-white hover:shadow-xl hover:border-blue-400 text-black px-4 py-4 border border-black rounded-md mb-4 m-6'>Envie sua planta</button>
            </div>
        
        
            <section id='infos' className='grid grid-cols-2 m-6 gap-6'>
            <div className='bg-slate-200 rounded-xl p-6 text-center max-w-md hover:shadow-lg transition-shadow'>
              <p>Faça o upload da planta</p>
            </div>
            <div className='bg-slate-200 rounded-xl p-6 text-center max-w-md hover:shadow-lg transition-shadow'>
              <p>Nossa IA identifica os elementos</p>
            </div>
            <div className='bg-slate-200 rounded-xl p-6 text-center max-w-md hover:shadow-lg transition-shadow'>
              <p>Receba explicações simples</p>
            </div>
            <div className='bg-slate-200 rounded-xl p-6 text-center w-full max-w-md hover:shadow-lg transition-shadow'>
              <p>Explore sua planta em 3D</p>
            </div>
        
          


            </section>
      </div>


    
      </div>
  );
}