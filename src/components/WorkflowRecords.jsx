import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { areaToBox } from "./labFormations";
import { RECORD_COUNT, WORKFLOW_DURATION, workflowRecord } from "./workflowSequence";

const COLORS = { intake: "#8e9aaf", queued: "#b0c7e2", checking: "#d7e8ff", held: "#f0b75f", approved: "#82bdf0", released: "#82bdf0" };

export default function WorkflowRecords({ area, mobile, paused, reducedMotion }) {
  const size = useThree((state) => state.size);
  const elapsedRef = useRef(0);
  const meshesRef = useRef([]);
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
      mesh.position.set(bounds.cx + record.x * bounds.sx, bounds.cy + record.y * bounds.sy, 0);
      mesh.scale.setScalar(radius);
      mesh.material.color.set(COLORS[record.stage]);
      mesh.material.emissive.set(COLORS[record.stage]);
      mesh.material.emissiveIntensity = record.stage === "checking" ? 0.65 : 0.22;
      mesh.material.opacity = opacity;
    });
  });

  return (
    <group>
      <ambientLight intensity={0.85} />
      <directionalLight position={[0, 4, 7]} intensity={2} color="#d8e8ff" />
      {Array.from({ length: RECORD_COUNT }, (_, index) => (
        <mesh key={index} ref={(mesh) => { meshesRef.current[index] = mesh; }}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial roughness={0.32} metalness={0.28} transparent />
        </mesh>
      ))}
    </group>
  );
}
