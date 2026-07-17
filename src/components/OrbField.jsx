import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { GROUP_DEFS, MAX_REAL_LIGHTS, groupCount, groupLitRatio } from "./orbFieldConfig";
import "./OrbField.css";

// Scatters an orb's own color around its group's nominal tone -- baked
// once per instance at build time, never touched again, so it's real
// per-orb variety rather than anything that "changes" on its own.
function jitterColor(hex, hueJitter, satJitter, lightJitter) {
  const base = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const h = (hsl.h + (Math.random() - 0.5) * hueJitter + 1) % 1;
  const s = THREE.MathUtils.clamp(hsl.s + (Math.random() - 0.5) * satJitter, 0, 1);
  const l = THREE.MathUtils.clamp(hsl.l + (Math.random() - 0.5) * lightJitter, 0.05, 0.92);
  return new THREE.Color().setHSL(h, s, l);
}

// No instance-color trickery anywhere in this file: an orb's surface
// material never changes. What changes is whether it has a real
// THREE.PointLight burning at its center -- the orb "turning on" is
// just what that looks like when the light hits its own glass/stone/
// wood surface, and the same light spills onto whatever's nearby,
// same as a christmas bulb lighting the ornaments next to it.

function makeStoneTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#8e8a82";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1100; i += 1) {
    const shade = 100 + Math.random() * 80;
    ctx.fillStyle = `rgba(${shade},${shade - 4},${shade - 12},${0.12 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, 0.5 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeWoodTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#7a4c2b";
  ctx.fillRect(0, 0, size, size);
  for (let x = 0; x < size; x += 1) {
    const wobble = Math.sin(x * 0.35) * 3 + Math.sin(x * 0.09) * 6;
    const band = ((x + wobble) % 16 + 16) % 16;
    const shade = 60 + band * 5;
    ctx.strokeStyle = `rgba(${shade + 55},${shade + 15},${shade - 15},0.55)`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSurfaceTexture(type) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, size, size);

  if (type === "ceramic") {
    for (let i = 0; i < 520; i += 1) {
      const shade = 145 + Math.random() * 90;
      ctx.fillStyle = `rgba(${shade},${shade},${shade},${0.08 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 0.25 + Math.random() * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "slate") {
    for (let y = -20; y < size + 20; y += 5 + Math.random() * 7) {
      ctx.strokeStyle = `rgba(55,65,76,${0.12 + Math.random() * 0.22})`;
      ctx.lineWidth = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random() * 4);
      ctx.bezierCurveTo(35, y - 4, 88, y + 5, size, y - 2);
      ctx.stroke();
    }
  } else if (type === "brass") {
    for (let x = 0; x < size; x += 2) {
      const light = 150 + Math.sin(x * 0.42) * 30 + Math.random() * 18;
      ctx.strokeStyle = `rgba(${light},${light},${light},0.32)`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + Math.sin(x) * 0.5, size);
      ctx.stroke();
    }
  } else if (type === "glass") {
    for (let i = 0; i < 90; i += 1) {
      const radius = 1 + Math.random() * 4;
      ctx.strokeStyle = `rgba(255,255,255,${0.06 + Math.random() * 0.12})`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (type === "crystal") {
    for (let i = 0; i < 34; i += 1) {
      ctx.strokeStyle = `rgba(245,255,252,${0.08 + Math.random() * 0.18})`;
      ctx.lineWidth = 0.4 + Math.random();
      ctx.beginPath();
      const x = Math.random() * size;
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (Math.random() - 0.5) * 45, size);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function makeField(count, litRatio, mobile) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const spread = Math.pow(Math.random(), 0.5);
    const theta = Math.random() * Math.PI * 2;
    const x = Math.cos(theta) * spread * 11.5;
    const y = Math.sin(theta) * spread * 6.4 + (Math.random() - 0.5) * 2.2;
    const z = -1.5 - Math.random() * 12;
    const speed = (0.08 + Math.random() * 0.14) * (mobile ? 1.7 : 1);
    const baseScale = 0.045 + Math.random() * 0.15;
    const scalePosition = (baseScale - 0.045) / 0.15;
    const scale = baseScale * THREE.MathUtils.lerp(1.68, 1.12, scalePosition);
    const velocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ).normalize().multiplyScalar(speed);
    const angularVelocity = [
      (Math.random() - 0.5) * 0.16 * (mobile ? 1.65 : 1),
      (Math.random() - 0.5) * 0.16 * (mobile ? 1.65 : 1),
      (Math.random() - 0.5) * 0.16 * (mobile ? 1.65 : 1),
    ];
    items.push({
      position: [x, y, z],
      homePosition: [x, y, z],
      velocity,
      baseSpeed: speed,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      angularVelocity,
      baseAngularVelocity: [...angularVelocity],
      scale,
      lightable: false,
      powered: false,
      threshold: Math.random(),
      // Independent from `threshold` (which gates its light): this one
      // gates when the orb itself pops into existence during the
      // one-at-a-time load-in reveal.
      assemblyThreshold: Math.random(),
    });
  }
  // Use an exact light count so the slider can map one step to one bulb.
  const lightCount = Math.round(count * litRatio);
  const shuffled = Array.from({ length: count }, (_, index) => index).sort(() => Math.random() - 0.5);
  shuffled.slice(0, lightCount).forEach((index) => {
    items[index].lightable = true;
  });
  return items;
}

// Builds every group's static field plus the full list of "bulbs" --
// every lightable orb across every group gets a real point light. The
// pool size is fixed for the component's lifetime (mobile is resolved
// once), which matters: three.js bakes the light count into each
// material's compiled shader, so a *changing* light count would mean
// constant shader recompiles. Toggling intensity 0 <-> target instead
// keeps the pool size constant.
function useOrbFieldData(mobile) {
  return useMemo(() => {
    const stoneTexture = makeStoneTexture();
    const woodTexture = makeWoodTexture();
    const surfaceTextures = {
      ceramic: makeSurfaceTexture("ceramic"),
      slate: makeSurfaceTexture("slate"),
      brass: makeSurfaceTexture("brass"),
      glass: makeSurfaceTexture("glass"),
      crystal: makeSurfaceTexture("crystal"),
      stone: stoneTexture,
      wood: woodTexture,
    };
    const bulbs = [];

    const groups = GROUP_DEFS.map((def) => {
      const count = groupCount(def, mobile);
      const ratio = groupLitRatio(def, mobile);
      const items = makeField(count, ratio, mobile).map((item) => ({
        ...item,
        // Keep an unpowered bulb genuinely dark. It can still become visible
        // when a neighboring real light lands on it, but it must never be
        // confused with a bulb producing light of its own.
        tint: jitterColor(def.color, def.hueJitter, def.satJitter, def.lightJitter).multiplyScalar(0.44),
      }));
      items.forEach((item, index) => {
        bulbs.push({
          position: item.position,
          scale: item.scale,
          threshold: item.threshold,
          color: def.lit,
          starColor: new THREE.Color(def.lit).lerp(new THREE.Color("#ffffff"), 0.28).multiplyScalar(2.15),
          power: def.power,
          reach: def.reach,
          key: `${def.key}-${index}`,
          source: item,
        });
      });
      const map = surfaceTextures[def.texture] || null;
      // Real transmission (a full extra background render pass) is the
      // priciest material feature here -- skip it on mobile and fall
      // back to a plain glossy clearcoat look instead.
      const transmission = mobile ? 0 : def.transmission;
      const roughness = mobile && def.transmission ? 0.15 : def.roughness;
      return { ...def, items, map, transmission, roughness };
    });

    // Pick sources inside a safe projected screen boundary while allowing
    // them to occupy the full depth of the field.
    const maxLights = mobile ? MAX_REAL_LIGHTS.mobile : MAX_REAL_LIGHTS.desktop;
    const aspect = window.innerWidth / window.innerHeight;
    const fov = mobile ? 60 : 50;
    const groupX = mobile ? 0 : 2.1;
    const groupY = mobile ? 0.6 : 0;
    const safeEdge = mobile ? 0.76 : 0.82;
    const realBulbs = [];
    const scales = bulbs.map((bulb) => bulb.scale).sort((a, b) => a - b);
    const sourceScaleLimit = scales[Math.floor((scales.length - 1) * 0.67)];

    // Bias selection toward the camera without flattening every source into
    // the front layer. Random variation still allows some deeper lights.
    bulbs.forEach((bulb) => {
      bulb.selectionScore = bulb.position[2] + bulb.threshold * 5;
    });
    bulbs.sort((a, b) => b.selectionScore - a.selectionScore);
    for (const bulb of bulbs) {
      if (realBulbs.length >= maxLights) break;
      // Large bodies remain environmental objects; light sources are chosen
      // only from the smaller two-thirds of the field.
      if (bulb.scale > sourceScaleLimit) continue;
      const depth = 9.5 - bulb.position[2];
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * depth;
      const halfWidth = halfHeight * aspect;
      const projected = {
        x: (bulb.position[0] + groupX) / halfWidth,
        y: (bulb.position[1] + groupY) / halfHeight,
        radius: bulb.scale / Math.min(halfWidth, halfHeight),
      };
      if (Math.abs(projected.x) > safeEdge || Math.abs(projected.y) > safeEdge) continue;

      const tooCloseToSource = realBulbs.some((selected) => (
        Math.hypot(projected.x - selected.projected.x, projected.y - selected.projected.y)
          < (mobile ? 0.2 : 0.15)
      ));
      if (tooCloseToSource) continue;
      bulb.projected = projected;
      realBulbs.push(bulb);
    }

    // On mobile, the first couple of lights to come on should land
    // somewhere pleasant -- a little above center, up into the upper
    // third -- rather than wherever the depth-biased sort above happened
    // to put them. This only reorders *when* an already-chosen bulb
    // lights up (its threshold), not which bulbs were chosen as sources.
    if (mobile) {
      const idealY = 0.35;
      realBulbs.sort((a, b) => Math.abs(a.projected.y - idealY) - Math.abs(b.projected.y - idealY));
    }

    realBulbs.forEach((bulb, index) => {
      const threshold = (index + 0.5) / realBulbs.length;
      bulb.threshold = threshold;
      bulb.source.threshold = threshold;
      bulb.source.powered = true;
    });

    return { groups, bulbs: realBulbs };
  }, [mobile]);
}

function OrbMaterial({ group }) {
  return (
    <meshPhysicalMaterial
      color={group.color}
      map={group.map || undefined}
      roughness={group.roughness}
      metalness={group.metalness}
      clearcoat={group.clearcoat ?? 0}
      clearcoatRoughness={group.clearcoatRoughness ?? 0.25}
      transmission={group.transmission ?? 0}
      thickness={group.thickness ?? 0}
      ior={group.ior ?? 1.5}
      attenuationColor={group.attenuationColor}
      attenuationDistance={group.attenuationDistance ?? Infinity}
    />
  );
}

// Orbs pop into existence one at a time as `revealRef` climbs from 0 to
// 1 (see RevealDriver): every orb starts at scale 0, and grows to full
// size once reveal clears its own `assemblyThreshold`. Nothing about an
// orb's material animates -- only the light attached to it (LightBulbs)
// and this initial "coming into being" transform do.
function AssemblingInstances({ items, geometry, material, revealRef, reducedMotion, progressRef, motionEnabled }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const amountsRef = useRef(null);
  if (amountsRef.current === null) {
    amountsRef.current = new Float32Array(items.length);
  }

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(...item.rotation);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, item.tint);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    amountsRef.current.fill(0);
  }, [items, dummy]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const reveal = revealRef.current;
    const amounts = amountsRef.current;
    const factor = reducedMotion ? 60 : 5.5;
    let dirty = false;

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const poweredOn = item.powered && progressRef.current > item.threshold;
      const target = reveal > item.assemblyThreshold && !poweredOn ? 1 : 0;
      const current = amounts[index];
      if (!motionEnabled && current === target && (current === 0 || current === 1)) continue;
      const next = THREE.MathUtils.damp(current, target, poweredOn ? 20 : factor, delta);
      amounts[index] = next;
      dummy.position.set(...item.position);
      dummy.rotation.set(...item.rotation);
      dummy.scale.setScalar(item.scale * next);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      dirty = true;
    }

    if (dirty) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, items.length]} frustumCulled={false}>
      {geometry}
      {material}
    </instancedMesh>
  );
}

// Every lightable orb's real point light, ramped 0 -> its own power
// once progress clears that orb's threshold. Sitting at the orb's own
// center, the light does double duty: it's what makes that orb itself
// read as "on" (its surface is simply close to a bright real light),
// and its falloff is what lights up whatever orbs happen to be nearby --
// the solar-system effect, not a fake glow shader.
function LightBulbs({ items, reducedMotion, progressRef, limit }) {
  const lightRefs = useRef([]);
  const intensitiesRef = useRef(null);
  if (intensitiesRef.current === null) {
    intensitiesRef.current = new Float32Array(limit);
  }

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const intensities = intensitiesRef.current;
    const factor = reducedMotion ? 60 : 3.2;
    const activeCount = Math.round(progress * items.length);
    for (let i = 0; i < limit; i += 1) {
      const light = lightRefs.current[i];
      if (!light) continue;
      const item = items[i];
      const target = item && i < activeCount ? 1 : 0;
      const next = THREE.MathUtils.damp(intensities[i], target, factor, delta);
      intensities[i] = next;
      if (item) {
        light.position.set(...item.position);
        light.color.set(item.color);
        light.distance = item.reach * 1.75;
        light.intensity = next * item.power * 2.35;
      } else {
        light.intensity = 0;
      }
    }
  });

  return Array.from({ length: limit }, (_, i) => (
    <pointLight
      key={i}
      ref={(el) => {
        lightRefs.current[i] = el;
      }}
      position={[0, 0, -20]}
      color="#ffffff"
      intensity={0}
      distance={9}
      decay={2}
    />
  ));
}

// A visible emissive skin for every lightable orb. Real point lights are
// deliberately capped below, but every activated orb still becomes a bright
// little bulb in its own right and feeds the bloom pass.
function BulbCores({ items, progress }) {
  const activeCount = Math.round(progress * items.length);

  return (
    <group renderOrder={100}>
      {items.slice(0, activeCount).map((item) => (
        <MovingAnchor key={item.key} item={item} renderOrder={100}>
          <mesh scale={item.scale * 1.24} renderOrder={100}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshBasicMaterial color={item.starColor} toneMapped={false} depthTest={false} depthWrite={false} />
          </mesh>
        </MovingAnchor>
      ))}
    </group>
  );
}

function makeStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const glow = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.1, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.28, "rgba(255,255,255,0.62)");
  glow.addColorStop(0.58, "rgba(255,255,255,0.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function BulbHalos({ items, progress }) {
  const texture = useMemo(() => makeStarTexture(), []);
  const activeCount = Math.round(progress * items.length);

  return (
    <group renderOrder={101}>
      {items.slice(0, activeCount).map((item) => (
        <MovingAnchor key={item.key} item={item} renderOrder={101}>
          <sprite scale={[item.scale * 4.2, item.scale * 4.2, 1]} renderOrder={101}>
            <spriteMaterial map={texture} color={item.color} toneMapped={false} transparent opacity={0.44} blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} />
          </sprite>
        </MovingAnchor>
      ))}
    </group>
  );
}

function MovingAnchor({ item, renderOrder, children }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.position.set(...item.position);
  });
  return <group ref={ref} position={item.position} renderOrder={renderOrder}>{children}</group>;
}

function MotionController({ groups, enabled, stirSignal }) {
  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => {
    if (!stirSignal?.id) return;
    const direction = stirSignal.direction;
    const strength = stirSignal.strength;
    items.forEach((item, index) => {
      const wave = Math.sin(index * 1.618 + item.position[2] * 0.7);
      item.velocity.x += direction * (0.38 + Math.abs(wave) * 0.3) * strength;
      item.velocity.y += -direction * item.position[0] * 0.028 * strength;
      item.velocity.z += wave * 0.2 * strength;
      item.angularVelocity[1] += direction * 0.42 * strength;
      item.angularVelocity[2] += wave * 0.3 * strength;
      if (item.velocity.length() > 1.15) item.velocity.setLength(1.15);
    });
  }, [items, stirSignal]);

  useFrame((state, frameDelta) => {
    if (!enabled) return;
    const delta = Math.min(frameDelta, 1 / 30);
    const cells = new Map();
    const cellSize = 0.42;

    items.forEach((item) => {
      const position = item.position;
      const velocity = item.velocity;
      const relaxedSpeed = THREE.MathUtils.damp(velocity.length(), item.baseSpeed, 0.55, delta);
      velocity.setLength(relaxedSpeed);
      for (let axis = 0; axis < 3; axis += 1) {
        item.angularVelocity[axis] = THREE.MathUtils.damp(
          item.angularVelocity[axis],
          item.baseAngularVelocity[axis],
          0.62,
          delta,
        );
      }
      position[0] += velocity.x * delta;
      position[1] += velocity.y * delta;
      position[2] += velocity.z * delta;
      item.rotation[0] += item.angularVelocity[0] * delta;
      item.rotation[1] += item.angularVelocity[1] * delta;
      item.rotation[2] += item.angularVelocity[2] * delta;

      const home = item.homePosition;
      const tether = item.powered ? 0.5 : 2.2;
      for (let axis = 0; axis < 3; axis += 1) {
        if (Math.abs(position[axis] - home[axis]) > tether) {
          position[axis] = home[axis] + Math.sign(position[axis] - home[axis]) * tether;
          velocity.setComponent(axis, -velocity.getComponent(axis));
        }
      }

      const key = `${Math.floor(position[0] / cellSize)}:${Math.floor(position[1] / cellSize)}:${Math.floor(position[2] / cellSize)}`;
      const bucket = cells.get(key) || [];
      bucket.push(item);
      cells.set(key, bucket);
    });

    cells.forEach((bucket) => {
      for (let a = 0; a < bucket.length; a += 1) {
        for (let b = a + 1; b < bucket.length; b += 1) {
          const first = bucket[a];
          const second = bucket[b];
          const dx = second.position[0] - first.position[0];
          const dy = second.position[1] - first.position[1];
          const dz = second.position[2] - first.position[2];
          const distance = Math.hypot(dx, dy, dz) || 0.0001;
          const minimum = (first.scale + second.scale) * 1.08;
          if (distance >= minimum) continue;
          const nx = dx / distance;
          const ny = dy / distance;
          const nz = dz / distance;
          const firstNormal = first.velocity.x * nx + first.velocity.y * ny + first.velocity.z * nz;
          const secondNormal = second.velocity.x * nx + second.velocity.y * ny + second.velocity.z * nz;
          const exchange = secondNormal - firstNormal;
          first.velocity.x += exchange * nx;
          first.velocity.y += exchange * ny;
          first.velocity.z += exchange * nz;
          second.velocity.x -= exchange * nx;
          second.velocity.y -= exchange * ny;
          second.velocity.z -= exchange * nz;
          // Resolve overlap over several frames. A full one-frame correction
          // reads as a teleport when dense clusters first begin moving.
          const separation = Math.min((minimum - distance) * 0.16, 0.004);
          first.position[0] -= nx * separation;
          first.position[1] -= ny * separation;
          first.position[2] -= nz * separation;
          second.position[0] += nx * separation;
          second.position[1] += ny * separation;
          second.position[2] += nz * separation;
        }
      }
    });
  }, -1);

  return null;
}

function AdaptiveSceneLight({ progressRef }) {
  const ambientRef = useRef();
  const directionalRef = useRef();
  const hemisphereRef = useRef();
  const night = useMemo(() => new THREE.Color("#667180"), []);
  const illuminated = useMemo(() => new THREE.Color("#b9c1c8"), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const progress = progressRef.current;
    const exposure = progress <= 0 ? 0 : 0.34 + 0.66 * Math.pow(progress, 0.72);
    ambientRef.current.intensity = THREE.MathUtils.lerp(0.075, 0.48, exposure);
    directionalRef.current.intensity = THREE.MathUtils.lerp(0, 0.42, exposure);
    hemisphereRef.current.intensity = THREE.MathUtils.lerp(0, 0.2, exposure);
    color.lerpColors(night, illuminated, exposure);
    ambientRef.current.color.copy(color);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.075} color="#667180" />
      <hemisphereLight ref={hemisphereRef} args={["#536276", "#17120f", 0]} />
      <directionalLight ref={directionalRef} position={[-4, 6, 6]} color="#c2c8cc" intensity={0} />
    </>
  );
}

function makeWallTexture() {
  const size = 192;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.fillStyle = "#aeb5bd";
  context.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i += 1) {
    const shade = 105 + Math.random() * 105;
    context.fillStyle = `rgba(${shade},${shade},${shade},${0.025 + Math.random() * 0.07})`;
    context.fillRect(Math.random() * size, Math.random() * size, 0.5 + Math.random(), 0.5 + Math.random());
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(7, 5);
  texture.anisotropy = 8;
  return texture;
}

function BackWall({ progressRef, mobile }) {
  const texture = useMemo(() => makeWallTexture(), []);
  const materialRef = useRef();
  const black = useMemo(() => new THREE.Color("#000000"), []);
  const litWall = useMemo(() => new THREE.Color("#34485e"), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!materialRef.current) return;
    const progress = progressRef.current;
    const oneLight = 1 / (mobile ? MAX_REAL_LIGHTS.mobile : MAX_REAL_LIGHTS.desktop);
    const wallProgress = THREE.MathUtils.clamp((progress - oneLight) / (1 - oneLight), 0, 1);
    const exposure = wallProgress <= 0 ? 0 : 0.24 + 0.76 * Math.pow(wallProgress, 0.72);
    color.lerpColors(black, litWall, exposure);
    materialRef.current.color.copy(color);
  });

  return (
    <mesh position={[0, 0, -14.2]}>
      <planeGeometry args={[60, 38, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color="#000000" map={texture} roughness={0.91} metalness={0.015} />
    </mesh>
  );
}

function OrbGeometry({ type }) {
  switch (type) {
    case "slate":
      return <icosahedronGeometry args={[1, 1]} />;
    case "brass":
      return <dodecahedronGeometry args={[1, 0]} />;
    case "glass-shiny":
      return <octahedronGeometry args={[1, 1]} />;
    case "stone":
      return <sphereGeometry args={[1, 8, 6]} />;
    case "wood":
      return <cylinderGeometry args={[0.72, 0.72, 1.45, 10]} />;
    case "crystal":
      return <tetrahedronGeometry args={[1.12, 1]} />;
    default:
      return <sphereGeometry args={[1, 14, 14]} />;
  }
}

function DriftGroup({ mobile, reducedMotion, children }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.045) * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.02;
  });
  return (
    <group ref={groupRef} position={[mobile ? 0 : 2.1, mobile ? 0.6 : 0, 0]}>
      {children}
    </group>
  );
}

// Eases `revealRef` toward `orbProgressRef`'s target over real time --
// the *rate* of this damp is what makes the field feel like it's
// assembling rather than popping in as a single frame, whether that's
// the very first mount (target starts at 1, reveal starts at 0) or a
// later drag of the "Orbs" slider. Reports rounded percent upward so
// the loading readout can show real progress instead of a guess.
function useRevealDriver({ orbProgressRef, reducedMotion, onAssembled }) {
  const revealRef = useRef(0);
  const lastReportedRef = useRef(-1);

  useFrame((state, delta) => {
    const factor = reducedMotion ? 60 : 1.5;
    revealRef.current = THREE.MathUtils.damp(revealRef.current, orbProgressRef.current, factor, delta);
    const percent = Math.round(revealRef.current * 100);
    if (percent !== lastReportedRef.current) {
      lastReportedRef.current = percent;
      onAssembled(revealRef.current);
    }
  });

  return revealRef;
}

function OrbScene({ mobile, reducedMotion, progress, orbProgress, motion, stirSignal, onAssembled }) {
  const { groups, bulbs } = useOrbFieldData(mobile);
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const orbProgressRef = useRef(orbProgress);
  useEffect(() => {
    orbProgressRef.current = orbProgress;
  }, [orbProgress]);

  const revealRef = useRevealDriver({ orbProgressRef, reducedMotion, onAssembled });
  const spillLightLimit = bulbs.length;

  return (
    <>
      <BackWall progressRef={progressRef} mobile={mobile} />
      <AdaptiveSceneLight progressRef={progressRef} />
      <DriftGroup mobile={mobile} reducedMotion={reducedMotion}>
        <MotionController groups={groups} enabled={motion && !reducedMotion} stirSignal={stirSignal} />
        <LightBulbs items={bulbs} limit={spillLightLimit} reducedMotion={reducedMotion} progressRef={progressRef} />

        {groups.map((group) => (
          <AssemblingInstances
            key={group.key}
            items={group.items}
            revealRef={revealRef}
            reducedMotion={reducedMotion}
            progressRef={progressRef}
            motionEnabled={motion && !reducedMotion}
            geometry={<OrbGeometry type={group.key} />}
            material={<OrbMaterial group={group} />}
          />
        ))}

        {/* These must render after the opaque orb field. Otherwise the dark
            source orb overwrites the bright body and leaves only a ring. */}
        <BulbCores items={bulbs} progress={progress} />
        <BulbHalos items={bulbs} progress={progress} />
      </DriftGroup>
    </>
  );
}

export default function OrbField({ progress, orbProgress = 1, motion = false, stirSignal = null, onReady = () => {}, onAssembled = () => {} }) {
  const mobile = useMemo(() => window.matchMedia("(max-width: 760px)").matches, []);
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  return (
    <div className="orb-field" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 4] : [1, 2]}
        camera={{ position: [0, 0, 9.5], fov: mobile ? 60 : 50, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          onReady();
        }}
      >
        <fog attach="fog" args={["#000000", 15, 42]} />
        <OrbScene mobile={mobile} reducedMotion={reducedMotion} progress={progress} orbProgress={orbProgress} motion={motion} stirSignal={stirSignal} onAssembled={onAssembled} />
        <EffectComposer multisampling={2} disableNormalPass>
          <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.18} intensity={mobile ? 1.35 : 1.7} mipmapBlur radius={0.55} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
