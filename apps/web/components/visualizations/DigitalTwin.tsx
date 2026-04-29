"use client";

import { Float, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export function DigitalTwin() {
  return (
    <div className="h-[360px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 3.2, 5.5]} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 6, 4]} intensity={1.3} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <planeGeometry args={[7, 7, 28, 28]} />
            <meshStandardMaterial color="#122225" metalness={0.2} roughness={0.65} wireframe />
          </mesh>
          <Zone position={[-1.3, 0.4, -0.8]} color="#50e3d6" scale={1.1} label="Flood basin" />
          <Zone position={[1.25, 0.55, 0.9]} color="#ff6f61" scale={0.86} label="Impact core" />
          <Zone position={[0.4, 0.3, -1.8]} color="#f4b860" scale={0.62} label="Shelters" />
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} minDistance={4} maxDistance={8} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Zone({ position, color, scale, label }: { position: [number, number, number]; color: string; scale: number; label: string }) {
  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={0.3}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.7, 36, 36]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <Text position={[position[0], position[1] + 1, position[2]]} fontSize={0.18} color="#eef8f7" anchorX="center">
        {label}
      </Text>
    </Float>
  );
}
