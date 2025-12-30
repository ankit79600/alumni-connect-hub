import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

const alumniLocations = [
  { lat: 40.7128, lng: -74.006, city: "New York", count: 1250 },
  { lat: 51.5074, lng: -0.1278, city: "London", count: 890 },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", count: 650 },
  { lat: 37.7749, lng: -122.4194, city: "San Francisco", count: 980 },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", count: 420 },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", count: 380 },
  { lat: 48.8566, lng: 2.3522, city: "Paris", count: 520 },
  { lat: 19.076, lng: 72.8777, city: "Mumbai", count: 1100 },
  { lat: 55.7558, lng: 37.6173, city: "Moscow", count: 290 },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo", count: 340 },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobePoint({ lat, lng, city, count }: {
  lat: number;
  lng: number;
  city: string;
  count: number;
}) {
  const position = latLngToVector3(lat, lng, 2.02);
  const scale = Math.min(0.1, 0.03 + (count / 1500) * 0.07);

  return (
    <mesh position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
      />
      <Html distanceFactor={10}>
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap border border-border">
          <span className="font-semibold">{city}</span>
          <span className="text-muted-foreground ml-1">({count} alumni)</span>
        </div>
      </Html>
    </mesh>
  );
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  
  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "#8b5cf6",
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Main globe sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]} material={wireframeMaterial} />
      
      {/* Glowing atmosphere */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Alumni location points */}
      {alumniLocations.map((loc) => (
        <GlobePoint key={loc.city} {...loc} />
      ))}
    </group>
  );
}

export function InteractiveGlobe() {
  return (
    <div className="w-full h-[500px] relative group">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3 / 4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
        Drag to explore • Alumni across 120+ countries
      </div>
    </div>
  );
}
