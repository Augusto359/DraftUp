import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function AnalyzingPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const arquivo = location.state?.arquivo;

    const [carregando, setCarregando] = useState(true);
    const [resumoTexto, setResumoTexto] = useState('');
    const [glbUrl, setGlbUrl] = useState(null);
    const [erro, setErro] = useState(null);

    const requisicaoFeita = useRef(false);

    useEffect(() => {
        if (!arquivo) {
            navigate('/upload');
            return;
        }

        if (requisicaoFeita.current) return;
        requisicaoFeita.current = true;

        const enviarParaBackend = async () => {
            setCarregando(true);
            setErro(null);

            const formData = new FormData();
            formData.append('foto', arquivo);

            try {
                console.log('📤 Enviando planta para o backend (YOLO + Trimesh)...');

                const response = await fetch('http://localhost:5000/analisar-planta', {
                    method: 'POST',
                    body: formData
                });

                const contentType = response.headers.get('content-type');

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.erro || 'Falha ao processar a planta baixa.');
                }

                if (contentType && contentType.includes('model/gltf-binary')) {
                    const blobGlb = await response.blob();
                    const urlCriada = URL.createObjectURL(blobGlb);

                    const resumoCodificado = response.headers.get('x-analise-resumo');
                    const resumoDecodificado = resumoCodificado
                        ? decodeURIComponent(resumoCodificado)
                        : 'Análise 3D concluída com sucesso.';

                    setGlbUrl(urlCriada);
                    setResumoTexto(resumoDecodificado);
                    console.log('✅ Modelo 3D .glb recebido com sucesso!');
                } else {
                    throw new Error('O servidor não retornou um modelo 3D válido.');
                }

            } catch (err) {
                console.error('❌ Erro na análise:', err);
                setErro(err.message || 'Ocorreu um erro ao processar seu arquivo.');
            } finally {
                setCarregando(false);
            }
        };

        enviarParaBackend();
    }, [arquivo, navigate]);

    const handleIrPara3D = () => {
        if (!glbUrl) {
            console.error('❌ Nenhum modelo 3D disponível.');
            return;
        }

        navigate('/viewer3d', {
            state: {
                arquivo,
                glbUrl,
                resumo: resumoTexto
            }
        });
    };

    if (!arquivo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-700 mb-4">Nenhuma planta foi selecionada.</p>
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                    >
                        Voltar para Upload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center pb-6 border-b border-gray-100 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DraftUp</h1>
                    <Link
                        to="/upload"
                        className="text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
                    >
                        ← Enviar outro arquivo
                    </Link>
                </header>

                {carregando && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
                        <div className="text-center space-y-6">
                            <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Analisando sua planta com IA...</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Estamos identificando ambientes, paredes, portas e janelas.
                                </p>
                            </div>

                            <div className="max-w-md mx-auto text-left space-y-3 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-gray-700">Imagem recebida</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-gray-700">Analisando elementos da planta</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                                    <span className="text-gray-400">Construindo malha 3D (.glb)</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 pt-2">Arquivo: {arquivo.name}</p>
                        </div>
                    </div>
                )}

                {erro && (
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                        <div className="text-center space-y-5">
                            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86l-8.82 15a2 2 0 001.72 3h17.62a2 2 0 001.72-3l-8.82-15a2 2 0 00-3.44 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Não foi possível analisar a planta</h2>
                                <p className="text-sm text-red-600 mt-2">{erro}</p>
                            </div>
                            <button
                                onClick={() => navigate('/upload')}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors"
                            >
                                Voltar e tentar novamente
                            </button>
                        </div>
                    </div>
                )}

                {!carregando && !erro && glbUrl && (
                    <div className="space-y-6">
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-orange-950">Análise concluída</h2>
                                    <p className="text-xs text-orange-700 mt-1">Arquivo: {arquivo.name}</p>
                                </div>
                                <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                                    Pronto
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Relatório Técnico</h3>
                                    <p className="text-xs text-gray-500">Resumo da análise 3D</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                                {resumoTexto}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <Link
                                to="/upload"
                                className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm py-3 px-5 rounded-xl transition-colors"
                            >
                                Analisar outra planta
                            </Link>

                            <button
                                onClick={handleIrPara3D}
                                disabled={!glbUrl}
                                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Gerar Visualização 3D →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}