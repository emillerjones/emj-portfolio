import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import InstancedField from "./InstancedField";
import "./Corridor.css";

// The corridor is built from a fixed run of segments receding into the
// dark. Reveal order is strictly front-to-back (unlike a scattered
// field): each segment's threshold increases with depth, and several of
// the deepest segments sit past 1.0 -- they never light up within the
// interactive range, so the corridor always keeps going further than
// you can actually illuminate.
const SEGMENTS = 26;
const SPACING = 4.2;
const WALL_X = 3.6;
const FLOOR_Y = -1.6;
const CEILING_Y = 2.6;
const CORRIDOR_DEPTH = SEGMENTS * SPACING;

const BOOK_COLORS = ["#6e2530", "#2c4a3a", "#1c2c46", "#5a4322", "#4a2a52"];

function segmentThreshold(index) {
  return 0.05 + (index / (SEGMENTS - 1)) * 1.3;
}

function withColors(list) {
  return list.map((entry) => ({
    ...entry,
    baseColor: new THREE.Color(entry.baseColor),
    litColor: new THREE.Color(entry.litColor),
  }));
}

function useCorridorItems() {
  return useMemo(() => {
    const segments = Array.from({ length: SEGMENTS }, (_, index) => ({
      z: -(index + 1) * SPACING,
      threshold: segmentThreshold(index),
    }));

    const fixtures = withColors(segments.map((seg) => ({
      position: [0, CEILING_Y - 0.05, seg.z],
      scale: 1,
      threshold: seg.threshold,
      baseColor: "#0b0c10",
      litColor: "#fff3d6",
    })));

    const pools = withColors(segments.map((seg) => ({
      position: [0, FLOOR_Y + 0.015, seg.z],
      scale: 1,
      threshold: seg.threshold,
      baseColor: "#000000",
      litColor: "#e8c98a",
    })));

    const wallPanels = withColors(segments.flatMap((seg) => ([
      { position: [-WALL_X, 0.5, seg.z], scale: 1, threshold: seg.threshold, baseColor: "#0a0b0d", litColor: "#3c4a58" },
      { position: [WALL_X, 0.5, seg.z], scale: 1, threshold: seg.threshold, baseColor: "#0a0b0d", litColor: "#3c4a58" },
    ])));

    const shelfRows = [0.15, 1.05];
    const shelfCols = [-1.4, -0.5, 0.5, 1.4];
    const books = withColors(segments.flatMap((seg, segIndex) => (
      [-1, 1].flatMap((side) => (
        shelfRows.flatMap((y) => (
          shelfCols.map((offset, colIndex) => ({
            position: [side * (WALL_X - 0.14), y, seg.z + offset],
            scale: 0.85 + ((segIndex + colIndex) % 3) * 0.08,
            threshold: seg.threshold,
            baseColor: "#08090b",
            litColor: BOOK_COLORS[(segIndex + colIndex) % BOOK_COLORS.length],
          }))
        ))
      ))
    )));

    return { fixtures, pools, wallPanels, books };
  }, []);
}

// Fog "near"/"far" are camera-relative in three.js, so pushing `far`
// outward as progress rises reveals more depth no matter where the
// dolly has moved to -- past it, the corridor simply isn't rendered.
function FogController({ progressRef, reducedMotion }) {
  const farRef = useRef(9);

  useFrame((state, delta) => {
    if (!state.scene.fog) {
      state.scene.fog = new THREE.Fog("#020304", 2, 9);
    }
    const target = 9 + progressRef.current * 90;
    const factor = reducedMotion ? 60 : 2.2;
    farRef.current = THREE.MathUtils.damp(farRef.current, target, factor, delta);
    state.scene.fog.far = farRef.current;
  });

  return null;
}

// Eases the camera deeper down the corridor as more of it lights up, so
// newly-lit fixtures arrive just ahead rather than staying off in the
// distance -- reinforces "you can see deeper" as an actual journey.
function CorridorScene({ mobile, reducedMotion, progress }) {
  const { fixtures, pools, wallPanels, books } = useCorridorItems();
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return (
    <group position={[mobile ? 0 : 1.4, 0, 0]}>
      <FogController progressRef={progressRef} reducedMotion={reducedMotion} />

      <ambientLight intensity={0.12} color="#20242c" />
      <directionalLight position={[0, 2, 8]} color="#5a6270" intensity={0.3} />

      <mesh position={[0, FLOOR_Y, -CORRIDOR_DEPTH / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[WALL_X * 2, CORRIDOR_DEPTH + 12]} />
        <meshStandardMaterial color="#050607" roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh position={[0, CEILING_Y, -CORRIDOR_DEPTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WALL_X * 2, CORRIDOR_DEPTH + 12]} />
        <meshStandardMaterial color="#040506" roughness={0.95} metalness={0.02} />
      </mesh>

      <InstancedField
        items={fixtures}
        dampFactor={2.6}
        scalePop={0.3}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        geometry={<boxGeometry args={[1.6, 0.06, 0.3]} />}
        material={<meshStandardMaterial roughness={0.4} metalness={0.1} />}
      />
      <InstancedField
        items={pools}
        dampFactor={2.6}
        scalePop={0.4}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        geometry={<boxGeometry args={[1.7, 0.02, 1.7]} />}
        material={<meshBasicMaterial transparent opacity={0.9} depthWrite={false} />}
      />
      <InstancedField
        items={wallPanels}
        dampFactor={3}
        scalePop={0}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        geometry={<boxGeometry args={[0.15, 3.4, SPACING * 0.92]} />}
        material={<meshStandardMaterial roughness={0.8} metalness={0.05} />}
      />
      <InstancedField
        items={books}
        dampFactor={3}
        scalePop={0}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        geometry={<boxGeometry args={[0.12, 0.42, 0.16]} />}
        material={<meshStandardMaterial roughness={0.6} metalness={0.05} />}
      />
    </group>
  );
}

export default function Corridor({ progress, onAssembled = () => {} }) {
  const mobile = useMemo(() => window.matchMedia("(max-width: 760px)").matches, []);
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  // Nothing here builds up gradually the way OrbField's field does --
  // report "fully assembled" the moment this scene exists.
  useEffect(() => {
    onAssembled(1);
  }, [onAssembled]);

  return (
    <div className="corridor" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.15] : [1, 1.5]}
        camera={{ position: [0, 0.3, 7.5], fov: mobile ? 62 : 52, near: 0.1, far: 140 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <CorridorScene mobile={mobile} reducedMotion={reducedMotion} progress={progress} />
        <Stats />
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom luminanceThreshold={0.28} luminanceSmoothing={0.25} intensity={mobile ? 0.7 : 0.85} mipmapBlur radius={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
