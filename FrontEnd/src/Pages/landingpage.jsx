import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { supabase } from '../auth/supabase';

const IconUpload = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);

const IconDoor = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 21V4.5a1 1 0 011-1h7l3 3V21" />
    <path d="M6 21h11" />
    <circle cx="12.5" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const IconLayers = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);

const IconCube = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
    <path d="M12 2v20M4 6.5l8 4.5 8-4.5" />
  </svg>
);

const passos = [
  { titulo: 'Envie sua planta', texto: 'Uma foto ou um rascunho já resolve.' },
  { titulo: 'Receba a análise dos elementos', texto: 'Paredes, portas e janelas identificadas automaticamente.' },
  { titulo: 'Explore a explicação simplificada', texto: 'Sem termos técnicos, sem letra miúda.' },
  { titulo: 'Visualize o resultado em 3D', texto: 'Gire, aproxime, entenda o espaço de verdade.' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const uploadPath = user ? '/upload' : '/login';

  return (
    <div className="text-[#333] font-sans leading-relaxed">

      {/* Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-center px-5 pt-8 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Draft<span className='text-orange-600'>Up</span></h1>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Início</Link>
          <Link to="/AboutUs" className="text-gray-600 hover:text-orange-600 transition-colors">Sobre</Link>
          <Link to="/#como-funciona" className="text-gray-600 hover:text-orange-600 transition-colors">Como funciona</Link>
          <Link to="/#chamada-final" className="text-gray-600 hover:text-orange-600 transition-colors">Contatos</Link>
          {user ? <button onClick={() => supabase?.auth.signOut()} className="text-gray-600 hover:text-orange-600 transition-colors">Sair</button> : <Link to="/login" className="text-gray-600 hover:text-orange-600 transition-colors">Entrar</Link>}
        </nav>
      </header>

            {/* Hero — malha de quadradinhos ao fundo, com fade radial e um "ponto de destaque" */}
      <section className="relative overflow-hidden bg-gray-50">
        <svg
          className="absolute inset-0 w-full h-full text-orange-300"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
          }}
        >
          <defs>
            <pattern id="blueprint-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" opacity="0.5" />
          <rect x="256" y="96" width="32" height="32" fill="currentColor" opacity="0.5" />
          <rect x="480" y="192" width="32" height="32" fill="currentColor" opacity="0.3" />
          <rect x="160" y="224" width="32" height="32" fill="currentColor" opacity="0.35" />
        </svg>

        <div className="relative max-w-5xl mx-auto px-5 pt-24 pb-28 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight max-w-2xl mx-auto">
            Entenda sua planta sem complicação
          </h2>
          <p className="text-gray-600 text-lg mt-5 max-w-xl mx-auto">
            Transformamos plantas em explicações simples e visuais para proprietários,
            clientes e profissionais.
          </p>
          <Link
            to={uploadPath}
            id="envplanta"
            className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20"
          >
            Enviar planta
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5">
        <hr className="border-gray-200" />

        {/* Problema */}
        <section className="my-16 max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Plantas são feitas para <span className='text-orange-600'>especialistas</span>, nós estamos dispostos a te <span className='text-orange-600'>ajudar.</span>
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Muitas pessoas recebem uma planta e <span className='text-orange-600 font-extrabold'>não</span> conseguem identificar paredes
            estruturais, tubulações, portas ou possíveis limitações da obra.
            Isso gera <span className='text-orange-600 font-extrabold'>dúvidas, insegurança e erros</span> durante reformas e construções.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Funcionalidades */}
        <section className="my-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 max-w-md">
            O Draft<span className='text-orange-600'>Up</span> traduz a <span className='text-orange-600'>linguagem técnica</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            <div className="flex gap-4">
              <IconUpload className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Envie sua planta</h4>
                <p className="text-gray-600 text-sm">Faça upload do arquivo em poucos segundos.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconDoor className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Identifique elementos importantes</h4>
                <p className="text-gray-600 text-sm">Localize portas, paredes, janelas e estruturas essenciais.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconLayers className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Visualize em linguagem simples</h4>
                <p className="text-gray-600 text-sm">Entenda o que cada elemento significa para sua obra.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconCube className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Veja em 3D</h4>
                <p className="text-gray-600 text-sm">Transforme informações técnicas em uma visualização fácil de interpretar.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Como funciona */}
        <section id="como-funciona" className="my-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Como funciona?</h3>

          <div className="relative max-w-md mx-auto">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-orange-200" aria-hidden="true" />

            <ol className="space-y-8">
              {passos.map((passo, i) => (
                <li key={passo.titulo} className="relative pl-10">
                  <span className="absolute left-0 top-0 w-[31px] h-[31px] rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="font-bold text-gray-900">{passo.titulo}</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{passo.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Chamada final */}
        <section id="chamada-final" className="text-center my-16 bg-orange-50 py-12 px-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pronto para entender sua planta?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Envie seu arquivo e descubra cada detalhe da sua construção de forma simples e visual!
          </p>
          <Link
            to={uploadPath}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20"
          >
            Começar agora
          </Link>
        </section>
      </div>
    </div>
  );
}
