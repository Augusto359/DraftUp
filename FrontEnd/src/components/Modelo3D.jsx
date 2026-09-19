import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Parede({ parede }) {
    const altura = parede.altura || 2.8;
    const espessura = parede.espessura || 0.15;
    const comprimento = parede.comprimento || 3;
    const x = parede.x || 0;
    const y = parede.y || 0;

    const rotacao = parede.orientacao === 'vertical' 
        ? [0, Math.PI / 2, 0] 
        : [0, 0, 0];

    return (
        <mesh
            position={[x, altura / 2, y]}
            rotation={rotacao}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[comprimento, altura, espessura]} />
            <meshStandardMaterial color="#d6d3d1" />
        </mesh>
    );
}

function Porta({ porta }) {
    const altura = porta.altura || 2.1;
    const largura = porta.largura || 0.8;

    const x = porta.x || 0;
    const y = porta.y || 0;

    const rotacao =
        porta.orientacao === 'vertical'
            ? [0, Math.PI / 2, 0]
            : [0, 0, 0];

    return (
        <mesh
            position={[
                x,
                altura / 2,
                y
            ]}
            rotation={rotacao}
        >
            <boxGeometry
                args={[
                    largura,
                    altura,
                    0.05
                ]}
            />

            <meshStandardMaterial color="#8b5e3c" />
        </mesh>
    );
}

function Janela({ janela }) {
    const altura = janela.altura || 1.2;
    const largura = janela.largura || 1.5;

    const x = janela.x || 0;
    const y = janela.y || 0;

    const alturaDoChao =
        janela.alturaDoChao || 1.1;

    const rotacao =
        janela.orientacao === 'vertical'
            ? [0, Math.PI / 2, 0]
            : [0, 0, 0];

    return (
        <mesh
            position={[
                x,
                alturaDoChao,
                y
            ]}
            rotation={rotacao}
        >
            <boxGeometry
                args={[
                    largura,
                    altura,
                    0.04
                ]}
            />

            <meshStandardMaterial
                color="#7dd3fc"
                transparent
                opacity={0.65}
            />
        </mesh>
    );
}

function Piso({ largura = 10, comprimento = 10 }) {
    return (
        <mesh
            rotation={[
                -Math.PI / 2,
                0,
                0
            ]}
            position={[
                0,
                0,
                0
            ]}
            receiveShadow
        >
            <planeGeometry
                args={[
                    largura,
                    comprimento
                ]}
            />

            <meshStandardMaterial color="#e7e5e4" />
        </mesh>
    );
}

function Cena3D({ planta }) {
    const paredes = planta?.paredes || [];
    const portas = planta?.portas || [];
    const janelas = planta?.janelas || [];

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[8, 7, 8]}
                fov={45}
            />

            <ambientLight intensity={0.7} />

            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                castShadow
            />

            <Piso
                largura={planta?.piso?.largura || 12}
                comprimento={planta?.piso?.comprimento || 12}
            />

            {paredes.map((parede, index) => (
                <Parede
                    key={`parede-${index}`}
                    parede={parede}
                />
            ))}

            {portas.map((porta, index) => (
                <Porta
                    key={`porta-${index}`}
                    porta={porta}
                />
            ))}

            {janelas.map((janela, index) => (
                <Janela
                    key={`janela-${index}`}
                    janela={janela}
                />
            ))}

            <Grid
                args={[20, 20]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#94a3b8"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#64748b"
                fadeDistance={25}
                infiniteGrid
            />

            <OrbitControls
                enableDamping
                dampingFactor={0.08}
                minDistance={3}
                maxDistance={30}
                target={[0, 1, 0]}
            />
        </>
    );
}

export default function Modelo3D({ planta }) {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas
                shadows
                gl={{
                    antialias: true
                }}
            >
                <color
                    attach="background"
                    args={['#0f172a']}
                />

                <Cena3D planta={planta} />
            </Canvas>
        </div>
    );
}