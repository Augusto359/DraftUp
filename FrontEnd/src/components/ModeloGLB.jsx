import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, useGLTF } from '@react-three/drei';

function CenaCarregada({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Cena3D({ glbUrl }) {
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

      <Suspense fallback={null}>
        <CenaCarregada url={glbUrl} />
      </Suspense>

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

export default function ModeloGLB({ glbUrl }) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        shadows
        gl={{ antialias: true }}
      >
        <color
          attach="background"
          args={['#0f172a']}
        />

        <Cena3D glbUrl={glbUrl} />
      </Canvas>
    </div>
  );
}