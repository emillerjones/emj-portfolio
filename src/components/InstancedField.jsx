import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Generic per-instance illumination driver, shared by every hero scene
// that turns a field of instanced objects on one at a time: brightens
// each instance from item.baseColor to item.litColor once `progress`
// clears its own threshold. Damping gives each light a soft
// "switching on" rise rather than a hard cut.
export default function InstancedField({ items, geometry, material, dampFactor, scalePop, reducedMotion, progressRef }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const intensitiesRef = useRef(null);
  if (intensitiesRef.current === null) {
    intensitiesRef.current = new Float32Array(items.length);
  }

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, item.baseColor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items, dummy]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const intensities = intensitiesRef.current;
    const progress = progressRef.current;
    const factor = reducedMotion ? 60 : dampFactor;
    let dirty = false;

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const target = progress > item.threshold ? 1 : 0;
      const current = intensities[index];
      if (current === target && (current === 0 || current === 1)) continue;
      const next = THREE.MathUtils.damp(current, target, factor, delta);
      intensities[index] = next;

      tmpColor.copy(item.baseColor).lerp(item.litColor, next);
      mesh.setColorAt(index, tmpColor);

      if (scalePop) {
        dummy.position.set(...item.position);
        dummy.scale.setScalar(item.scale * (1 + next * scalePop));
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      dirty = true;
    }

    if (dirty) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, items.length]} frustumCulled={false}>
      {geometry}
      {material}
    </instancedMesh>
  );
}
