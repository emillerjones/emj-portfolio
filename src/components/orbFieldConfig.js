// Pure data + math, deliberately free of any "three"/"@react-three"
// imports so the Home page can import `estimateOrbLightCount` (to size
// the "number of lights" slider) without pulling OrbField's heavy 3D
// dependency graph out of its lazy chunk.
// `hueJitter`/`satJitter`/`lightJitter` scatter each orb's own base color
// around the group's nominal tone (see jitterColor in OrbField.jsx) --
// baked once per instance, never animated, so it adds real per-orb
// color variety without reintroducing any "color changes on its own"
// weirdness.
export const GROUP_DEFS = [
  { key: "ceramic", count: 480, litRatio: 1 / 54, color: "#9b3d46", roughness: 0.8, metalness: 0.05, lit: "#ff4d5a", power: 10, reach: 15, texture: "ceramic", hueJitter: 0.07, satJitter: 0.25, lightJitter: 0.18 },
  { key: "slate", count: 480, litRatio: 1 / 68, color: "#294f88", roughness: 0.75, metalness: 0.08, lit: "#4d9dff", power: 10, reach: 15, texture: "slate", hueJitter: 0.09, satJitter: 0.28, lightJitter: 0.18 },
  { key: "brass", count: 420, litRatio: 1 / 47, color: "#b99a38", roughness: 0.34, metalness: 0.58, clearcoat: 0.35, lit: "#ffe04d", power: 11.5, reach: 16, texture: "brass", hueJitter: 0.05, satJitter: 0.2, lightJitter: 0.14 },
  { key: "glass-shiny", count: 420, litRatio: 1 / 61, color: "#653c82", roughness: 0.2, metalness: 0.1, clearcoat: 0.55, clearcoatRoughness: 0.2, lit: "#c56cff", power: 11.5, reach: 16, texture: "glass", hueJitter: 0.1, satJitter: 0.3, lightJitter: 0.16 },
  { key: "stone", count: 420, litRatio: 1 / 72, color: "#5960a0", roughness: 0.92, metalness: 0.02, lit: "#727cff", power: 9.5, reach: 14, texture: "stone", hueJitter: 0.08, satJitter: 0.1, lightJitter: 0.14 },
  { key: "wood", count: 420, litRatio: 1 / 58, color: "#a5572e", roughness: 0.5, metalness: 0.03, clearcoat: 0.1, lit: "#ff8a42", power: 9.5, reach: 14, texture: "wood", hueJitter: 0.04, satJitter: 0.12, lightJitter: 0.14 },
  { key: "crystal", count: 360, litRatio: 1 / 65, color: "#245b4a", roughness: 0.16, metalness: 0, transmission: 0.6, thickness: 0.4, ior: 1.5, attenuationColor: "#75e7b0", attenuationDistance: 0.6, lit: "#55ed9a", power: 13, reach: 17, texture: "crystal", hueJitter: 0.12, satJitter: 0.3, lightJitter: 0.16 },
];

export const MAX_REAL_LIGHTS = {
  desktop: 20,
  mobile: 10,
};

// Mobile halves the instance count and further thins the lightable
// ratio -- keep this in sync with OrbField.jsx's useOrbFieldData, which
// applies the exact same formula when actually building the field.
export function groupCount(def, mobile) {
  return mobile ? Math.round(def.count * 0.5) : def.count;
}

export function groupLitRatio(def, mobile) {
  return mobile ? def.litRatio * 0.55 : def.litRatio;
}

export function estimateOrbLightCount(mobile) {
  return mobile ? MAX_REAL_LIGHTS.mobile : MAX_REAL_LIGHTS.desktop;
}

export function estimateOrbTotalCount(mobile) {
  const total = GROUP_DEFS.reduce((sum, def) => sum + groupCount(def, mobile), 0);
  return Math.max(1, Math.round(total));
}
