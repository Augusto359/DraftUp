import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <main id="global" className="min-h-screen bg-[#f3f1ec] px-4 py-5 font-sans text-[#252a2d] antialiased sm:px-7 sm:py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-[#e6e2da] bg-white shadow-[0_18px_55px_rgba(31,38,42,0.07)]">
        <header className="flex flex-col gap-5 border-b border-[#eae7e1] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <Link to="/" className="w-fit text-2xl font-bold tracking-[-0.06em] text-[#252a2d] no-underline sm:text-[1.7rem]">
            Draft<span className="text-[#d85e32]">Up</span>
          </Link>
          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] font-medium sm:gap-x-3">
            <Link to="/" className="rounded-md px-2.5 py-2 text-[#656c70] transition-colors hover:bg-[#f7f5f1] hover:text-[#252a2d]">Início</Link>
            <Link to="/AboutUs" aria-current="page" className="rounded-md bg-[#fbf0e9] px-2.5 py-2 font-semibold text-[#b94c27]">Sobre</Link>
            <Link to="/#como-funciona" className="rounded-md px-2.5 py-2 text-[#656c70] transition-colors hover:bg-[#f7f5f1] hover:text-[#252a2d]">Como funciona</Link>
            <Link to="/#chamada-final" className="rounded-md px-2.5 py-2 text-[#656c70] transition-colors hover:bg-[#f7f5f1] hover:text-[#252a2d]">Contatos</Link>
          </nav>
        </header>

        <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
          <section className="grid items-center gap-8 border-b border-[#eae7e1] pb-10 sm:pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pb-16">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#b94c27]">
                <span aria-hidden="true" className="h-px w-7 bg-[#d85e32]" />
                Nossa História
              </span>
              <h1 className="mt-5 max-w-2xl text-[2.55rem] font-semibold leading-[1.06] tracking-[-0.055em] text-[#252a2d] sm:text-5xl lg:text-[3.55rem]">
                Descomplicando a arquitetura, uma planta de cada vez.
              </h1>
              <p className="mt-6 max-w-xl text-[0.98rem] leading-7 text-[#626b70] sm:text-[1.05rem] sm:leading-8">
                O DraftUp nasceu de uma constatação simples: plantas baixas são desenhadas por especialistas, para especialistas. Mas quem vai morar, construir ou reformar nem sempre fala essa linguagem técnica.
              </p>
            </div>

            <div aria-hidden="true" className="relative mx-auto w-full max-w-[27rem] rounded-lg border border-[#eee7de] bg-[#faf8f4] p-4 sm:p-6">
              <svg viewBox="0 0 420 320" fill="none" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 24H396V296H24V24Z" stroke="#E8E1D8" strokeWidth="1" />
                <path d="M56 55H220V132H352V264H56V55Z" fill="#F4EDE5" fillOpacity=".55" />
                <path d="M56 55H150M190 55H220V132H352V264H56V238M56 218V55Z" stroke="#3C464B" strokeWidth="5" strokeLinejoin="round" />
                <path d="M220 171V264M272 184H352" stroke="#3C464B" strokeWidth="5" strokeLinecap="square" />
                <path d="M56 171H112M164 171H220" stroke="#3C464B" strokeWidth="5" />
                <path d="M112 171C112 200 135 223 164 223V171" stroke="#D87953" strokeWidth="2" />
                <path d="M220 132C249 132 272 155 272 184" stroke="#D87953" strokeWidth="2" />
                <path d="M150 52H190M150 58H190M53 218V238M59 218V238" stroke="#A9B3B1" strokeWidth="2" />
                <circle cx="352" cy="264" r="4" fill="#D85E32" />
              </svg>
              <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-[#d85e32]" />
              <div className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-[#d85e32]" />
            </div>
          </section>

          <section aria-label="O desafio e a solução" className="grid gap-4 border-b border-[#eae7e1] py-8 sm:grid-cols-2 sm:gap-5 sm:py-10">
            <article className="rounded-lg border border-[#e8e8e5] bg-[#fafaf8] p-6 sm:p-7">
              <div aria-hidden="true" className="mb-7 flex h-10 w-10 items-center justify-center rounded-md border border-[#e4e2dc] bg-white text-[#626b70]">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5h16v13H4z" /><path d="M8 5.5v5h5v-5M13 10.5v8M4 14h5v4.5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.035em] text-[#252a2d]">O Desafio</h2>
              <p className="mt-3 text-sm leading-7 text-[#626b70]">
                Símbolos indecifráveis, espessuras de linha, cotas e jargões tornam a leitura de um projeto frustrante. Isso gera dúvidas sobre quais paredes podem ser derrubadas, onde entra a luz solar ou como o espaço realmente vai funcionar no dia a dia.
              </p>
            </article>

            <article className="rounded-lg border border-[#f0dfd4] bg-[#fff8f3] p-6 sm:p-7">
              <div aria-hidden="true" className="mb-7 flex h-10 w-10 items-center justify-center rounded-md border border-[#f0d8c9] bg-white/80 text-[#c45730]">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5V5h11l5 5v9.5H4Z" /><path d="M15 5v5h5M7 15h10M7 12h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.035em] text-[#8b3b20]">Nossa Solução</h2>
              <p className="mt-3 text-sm leading-7 text-[#754c3c]">
                Unimos tecnologia e inteligência artificial para "traduzir" arquivos técnicos em explicações visuais, diretas e fáceis de entender. Mostramos onde estão os cômodos, fluxos e estruturas sem enrolação.
              </p>
            </article>
          </section>

          <section className="py-9 sm:py-12">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <h2 className="text-2xl font-semibold tracking-[-0.045em] text-[#252a2d] sm:text-[1.8rem]">No que acreditamos</h2>
            </div>
            <div className="grid gap-x-6 sm:grid-cols-3">
              <article className="border-t-2 border-[#d85e32] py-5 sm:py-6">
                <span className="text-sm font-semibold tabular-nums text-[#c45730]">1</span>
                <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-[#252a2d]">Clareza Absoluta</h3>
                <p className="mt-2 text-sm leading-6 text-[#687177]">Qualquer pessoa deve ser capaz de entender o espaço onde vai viver ou investir.</p>
              </article>
              <article className="border-t-2 border-[#d9d8d2] py-5 sm:py-6">
                <span className="text-sm font-semibold tabular-nums text-[#8b9294]">2</span>
                <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-[#252a2d]">Tecnologia Acessível</h3>
                <p className="mt-2 text-sm leading-6 text-[#687177]">Usamos IA para acelerar a leitura de dados complexos em poucos segundos.</p>
              </article>
              <article className="border-t-2 border-[#d9d8d2] py-5 sm:py-6">
                <span className="text-sm font-semibold tabular-nums text-[#8b9294]">3</span>
                <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-[#252a2d]">Autonomia</h3>
                <p className="mt-2 text-sm leading-6 text-[#687177]">Damos o poder ao cliente de tomar decisões mais seguras antes de começar a obra.</p>
              </article>
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-lg bg-[#29343b] px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">Quer ver como funciona na prática?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#c6cdd0]">Faça o upload de uma planta baixa e receba uma análise explicativa instantânea.</p>
            </div>
            <Link to="/upload" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-md bg-[#d85e32] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c84f25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb394] focus-visible:ring-offset-2 focus-visible:ring-offset-[#29343b]">
              Testar Agora
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 10h12M10 4.5l5.5 5.5-5.5 5.5" />
              </svg>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
