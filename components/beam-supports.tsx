"use client";

export function BeamSupports() {
  return (
    <>
      <group position={[-5, -0.3, 0]}>
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.15, 2, 1]} />
          <meshStandardMaterial color="#555555" />
        </mesh>

        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={i}
            position={[-0.35, 0.8 - i * 0.5, 0]}
            rotation={[0, 0, Math.PI / 4]}
          >
            <boxGeometry args={[0.08, 0.3, 1]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
        ))}
      </group>

      <group position={[5, -0.6, 0]}>
        <mesh rotation={[0, 0, 0]} position={[0.0, 0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 12]} />
          <meshStandardMaterial color="#666666" />
        </mesh>

        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.9]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>
    </>
  );
}
