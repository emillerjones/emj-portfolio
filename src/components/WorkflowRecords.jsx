import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { areaToBox } from "./labFormations";
import { RECORD_COUNT, WORKFLOW_DURATION, workflowRecord } from "./workflowSequence";
import { GROUP_DEFS } from "./orbFieldConfig";

const COLORS = { intake: "#8e9aaf", queued: "#b0c7e2", checking: "#d7e8ff", held: "#f0b75f", approved: "#82bdf0", released: "#82bdf0" };

export default function WorkflowRecords({ area, mobile, paused, reducedMotion }) {
  const size = useThree((state) => state.size);
  const elapsedRef = useRef(0);
  const meshesRef = useRef([]);
  const halosRef = useRef([]);
  const lightsRef = useRef([]);
  const haloTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(255,255,255,0.8)");
    glow.addColorStop(0.22, "rgba(255,255,255,0.3)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => haloTexture.dispose(), [haloTexture]);
  const bounds = useMemo(() => areaToBox(area || { left: 24, right: size.width - 24, top: 150, bottom: size.height * 0.45 }, size, mobile ? 60 : 50, [0, 0]), [area, size, mobile]);

  useFrame((_, delta) => {
    if (!paused && !reducedMotion) elapsedRef.current += Math.min(delta, 0.15);
    const elapsed = reducedMotion ? 27 : elapsedRef.current % WORKFLOW_DURATION;
    // Hold the completed collection, then fade out briefly before the next batch.
    const opacity = reducedMotion || elapsed < 28 ? 1 : Math.max(0, (30 - elapsed) / 2);
    const radius = Math.min(0.11, bounds.sx / 22, bounds.sy / 12);
    meshesRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const record = workflowRecord(index, elapsed);
      const material = GROUP_DEFS[index % GROUP_DEFS.length];
      const color = record.stage === "intake" ? material.lit : COLORS[record.stage];
      const bright = index % 3 === 0 || record.stage === "checking" || record.stage === "held";
      mesh.position.set(bounds.cx + record.x * bounds.sx, bounds.cy + record.y * bounds.sy, 0);
      mesh.scale.setScalar(radius);
      mesh.material.color.set(color);
      mesh.material.emissive.set(color);
      mesh.material.emissiveIntensity = bright ? 3.2 : 0.65;
      mesh.material.opacity = opacity;
      if (!paused && !reducedMotion) mesh.rotation.y += delta * (0.2 + index % 3 * 0.1);
      const halo = halosRef.current[index];
      halo.position.copy(mesh.position);
      halo.scale.setScalar(radius * (bright ? 6 : 3.8));
      halo.material.color.set(color);
      halo.material.opacity = opacity * (bright ? 0.5 : 0.18);
      const light = lightsRef.current[index];
      if (light) {
        light.position.copy(mesh.position);
        light.color.set(color);
        light.intensity = radius * radius * 35 * opacity;
        light.distance = radius * 18;
      }
    });
  });

  return (
    <group>
      <ambientLight intensity={0.85} />
      <directionalLight position={[0, 4, 7]} intensity={2} color="#d8e8ff" />
      {Array.from({ length: RECORD_COUNT }, (_, index) => (
        <group key={index}>
          <mesh ref={(mesh) => { meshesRef.current[index] = mesh; }}>
            {index % 4 === 0 ? <octahedronGeometry args={[1, 1]} /> : index % 4 === 1 ? <dodecahedronGeometry args={[1, 0]} /> : <sphereGeometry args={[1, 20, 16]} />}
            <meshPhysicalMaterial roughness={GROUP_DEFS[index % GROUP_DEFS.length].roughness * 0.5} metalness={GROUP_DEFS[index % GROUP_DEFS.length].metalness} clearcoat={1} clearcoatRoughness={0.15} transparent />
          </mesh>
          <sprite ref={(sprite) => { halosRef.current[index] = sprite; }}>
            <spriteMaterial map={haloTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          {index % 4 === 0 && <pointLight ref={(light) => { lightsRef.current[index] = light; }} intensity={0} decay={2} />}
        </group>
      ))}
    </group>
  );
}
