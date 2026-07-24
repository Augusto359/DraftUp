import React from 'react'
import { useState } from 'react';
import bgUpload from '../../imagens/upload.png'
import Cloud from '../../imagens/cloud.png'
import { Link } from 'react-router-dom';


export default function Upload() {
  const [arquivo, setArquivo] = useState(null);
  const [mostrarcard, setMostrarcard] = useState(null);

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
                <Link to="/" className='text-orange-600 underline'>Início</Link>
                <a href="#" className='text-orange-600 underline'>Sobre</a>
                <a href="#" className='text-orange-600 underline'>Como funciona</a>
                <a href="#" className='text-orange-600 underline'>Contatos</a>
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
      <label className='bg-white border-dashed hover:shadow-xl hover:border-orange-400 text-black px-2 py-2 border border-black rounded-md'>
        <div className='gap-4 p-6 flex justify-center flex-col items-center'>
           <img src={Cloud} alt="Nuvem de Upload" className='w-16 h-16' />
          <p>Arraste um arquivo ou</p> <br />
         
          <p>Selecione um:</p>
          <span className='bg-slate-200 border rounded-xl hover:border-orange-400 p-4'>Escolher um arquvivo</span>
          
          
            
            <input className=' hidden'
              type="file"
              onChange={(e) => setArquivo(e.target.files[0])}
            />
          
          {arquivo && <p>Arquivo: {arquivo.name}</p>}
        </div>
      </label>
        
        
          <button disabled={!arquivo} className='bg-white hover:shadow-xl hover:border-orange-400 text-black px-4 py-4 border rounded-md mb-4 m-6 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed'>Envie sua planta</button>
            </div>
        
        
            <section id='infos' className='grid grid-cols-2 m-6 gap-6 justify-center'>
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
          {mostrarcard && (
            <div className='fixed inset-0 bg-black/50 text-center flex justify-center items-center'>
              <div className='bg-white rounded-lg py-5 px-5 p-5 flex flex-col gap-4 break-inside-auto'>
                <h3>Quer testar uma das nossas plantas de demonstração?</h3> <br />
                <button className='bg-slate-200 border rounded-lg border-slate-400 hover:border-orange-400 hover:shadow-xl px-4 py-4 '>Sim</button> <br />
                <button onClick={() => setMostrarcard(false)} className='bg-slate-200 border rounded-lg border-slate-400 hover:border-orange-400 hover:shadow-xl px-4 py-4'>Cancelar</button>
              </div>
            </div>
          )}

          <button onClick={() => setMostrarcard(true)} className='bg-white justify-center col-span-2 w-fit p-4 mx-auto border border-slate-400 rounded-xl hover:border-orange-400 hover:shadow-lg transition-shadow'>Não tem uma planta?</button>
            </section>
      </div>


    
      </div>
  );
}