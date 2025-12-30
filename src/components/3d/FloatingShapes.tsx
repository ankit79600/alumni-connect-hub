import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position, color, speed = 1, distort = 0.3 }: {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function AnimatedTorus({ position, color, speed = 1 }: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.5 * speed;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[0.6, 0.25, 16, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function AnimatedBox({ position, color, speed = 1 }: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.4 * speed;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2 * speed;
  });

  return (
    <Float speed={1} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <AnimatedSphere position={[-3, 2, 0]} color="#8b5cf6" speed={0.8} distort={0.4} />
        <AnimatedSphere position={[3, -1, -2]} color="#0ea5e9" speed={1.2} distort={0.3} />
        <AnimatedTorus position={[2, 2, -1]} color="#a855f7" speed={0.6} />
        <AnimatedTorus position={[-2, -2, 0]} color="#06b6d4" speed={1} />
        <AnimatedBox position={[0, 0, -3]} color="#7c3aed" speed={0.5} />
        <AnimatedBox position={[-4, 0, -2]} color="#3b82f6" speed={0.7} />
      </Canvas>
    </div>
  );
}
