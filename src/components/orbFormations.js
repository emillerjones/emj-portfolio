// Formations for the home page story: the drifting orb field (stop 0)
// organizes into one of three systems, one per stop.
//
//   1  Records workflow  - a stream moving through four stages
//   2  Horizon calendar  - scattered events settling into a month grid
//   3  Recovery          - people gathered in rings around a fire, where
//                          the fire is made of the field's real lights
//
// Everything here is plain math on the existing orb items. OrbField's
// MotionController springs each orb toward the target computed below, so
// the existing lights, bloom and materials all carry over unchanged.

import * as THREE from "three";

export const FORMATION_STOPS = 4;

const CAMERA_Z = 9.5;

// Convert the page's free screen rectangle (CSS px) into a box in the
// orb group's local space on the z = 0 plane.
export function areaToBox(area, size, fov, groupOffset) {
  const unitsTall = 2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * CAMERA_Z;
  const ppu = size.height / unitsTall;
  return {
    cx: ((area.left + area.right) / 2 - size.width / 2) / ppu - groupOffset[0],
    cy: (size.height / 2 - (area.top + area.bottom) / 2) / ppu - groupOffset[1],
    sx: Math.max(0.5, (area.right - area.left) / 2 / ppu),
    sy: Math.max(0.5, (area.bottom - area.top) / 2 / ppu),
  };
}

// Pick which orbs take part and give each one its slot in every
// formation. Mutates the items (they are already mutable simulation
// state). Lit orbs always take part, so the real lights move with them.
export function prepareFormations(groups, bulbs, mobile) {
  const all = groups.flatMap((group) => group.items);
  const memberCount = mobile ? 240 : 380;
  const lit = bulbs.map((bulb) => bulb.source);
  const litSet = new Set(lit);
  const others = all
    .filter((item) => !litSet.has(item))
    .map((item) => ({ item, score: item.homePosition[2] + Math.random() * 5 - item.scale * 8 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, memberCount - lit.length)
    .map(({ item }) => item);
  const members = [...lit, ...others];

  all.forEach((item) => {
    item.member = -1;
    item.spring = new THREE.Vector3();
    item.springing = false;
    item.formBlend = 0;
    item.delay = Math.random() * 0.5;
    item.seed = Math.random() * Math.PI * 2;
  });

  // Workflow: three lanes, evenly spaced along one closed path.
  // Shuffled so the lit orbs are spread along the stream, not bunched.
  const lanes = 3;
  const perLane = Math.ceil(members.length / lanes);
  const flowOrder = [...members].sort(() => Math.random() - 0.5);
  members.forEach((item, index) => {
    item.member = index;
    item.formScale = THREE.MathUtils.clamp(item.scale * 0.55, 0.05, mobile ? 0.072 : 0.085);
  });
  flowOrder.forEach((item, index) => {
    item.flow = { lane: index % lanes, u: Math.floor(index / lanes) / perLane };
  });

  // Calendar: 7 x 5 days, each holding a small cluster of "raids".
  // Uneven counts (and some empty days) so it reads as real data.
  const grid = mobile ? 3 : 4;
  const capacity = grid * grid;
  const weights = Array.from({ length: 35 }, (_, day) => {
    const weekday = day % 7;
    const busy = weekday >= 1 && weekday <= 4 ? 1 : 0.45;
    return Math.random() < 0.12 ? 0 : busy * (0.35 + Math.random());
  });
  const filled = new Array(35).fill(0);
  const shuffled = [...members].sort(() => Math.random() - 0.5);
  shuffled.forEach((item) => {
    let day = 0;
    for (let tries = 0; tries < 60; tries += 1) {
      let pick = Math.random() * weights.reduce((sum, w, i) => sum + (filled[i] < capacity ? w : 0), 0);
      day = weights.findIndex((w, i) => {
        if (filled[i] >= capacity) return false;
        pick -= w;
        return pick <= 0;
      });
      if (day >= 0) break;
    }
    if (day < 0) day = filled.findIndex((count) => count < capacity);
    item.day = { col: day % 7, row: Math.floor(day / 7), slot: filled[day], grid };
    filled[day] += 1;
  });

  // Gathering: lit orbs become the fire, everyone else sits in rings.
  const rings = 5;
  const ringWeights = Array.from({ length: rings }, (_, k) => 0.32 + 0.165 * k);
  const ringTotal = ringWeights.reduce((a, b) => a + b, 0);
  const ringCounts = ringWeights.map((w) => Math.round((others.length * w) / ringTotal));
  ringCounts[rings - 1] += others.length - ringCounts.reduce((a, b) => a + b, 0);
  let cursor = 0;
  ringCounts.forEach((count, ring) => {
    for (let j = 0; j < count; j += 1) {
      others[cursor].circle = { ring, angle: (j / count) * Math.PI * 2 + ring * 0.4 };
      cursor += 1;
    }
  });
  lit.forEach((item, index) => {
    item.circle = { fire: index, of: lit.length };
  });

  return members;
}

// Build the workflow's closed path in world units for the current box.
// Four stage columns joined in a serpentine, returning along the top.
export function buildFlowPath(box) {
  const xs = [-0.78, -0.26, 0.26, 0.78];
  const top = 0.72;
  const bottom = -0.9;
  const returnLane = 0.95;
  const unit = [
    [xs[0], top], [xs[0], bottom], [xs[1], bottom], [xs[1], top],
    [xs[2], top], [xs[2], bottom], [xs[3], bottom], [xs[3], returnLane],
    [xs[0], returnLane], [xs[0], top],
  ];
  const points = unit.map(([x, y]) => [box.cx + x * box.sx, box.cy + y * box.sy]);
  const segments = [];
  let length = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const segmentLength = Math.hypot(x2 - x1, y2 - y1);
    segments.push({ x1, y1, dx: (x2 - x1) / segmentLength, dy: (y2 - y1) / segmentLength, start: length, length: segmentLength });
    length += segmentLength;
  }
  return { segments, length };
}

const FLOW_PERIOD = 46; // seconds for one full loop

export function formationTarget(item, stop, time, box, flowPath, out) {
  if (stop === 1) {
    const { lane, u } = item.flow;
    let s = (((u + time / FLOW_PERIOD) % 1) + 1) % 1 * flowPath.length;
    const segment = flowPath.segments.find((seg) => s < seg.start + seg.length) || flowPath.segments.at(-1);
    s -= segment.start;
    const offset = (lane - 1) * 0.17;
    out.set(
      segment.x1 + segment.dx * s - segment.dy * offset,
      segment.y1 + segment.dy * s + segment.dx * offset,
      0.25 + Math.sin(item.seed + time * 0.9) * 0.06,
    );
    return out;
  }

  if (stop === 2) {
    const { col, row, slot, grid } = item.day;
    const cellW = (2 * box.sx) / 7;
    const cellH = (1.8 * box.sy) / 5;
    const spacing = Math.min(cellW, cellH) * (grid === 3 ? 0.28 : 0.22);
    const x = box.cx - box.sx + (col + 0.5) * cellW + ((slot % grid) - (grid - 1) / 2) * spacing;
    const y = box.cy + 0.9 * box.sy - (row + 0.5) * cellH - (Math.floor(slot / grid) - (grid - 1) / 2) * spacing;
    const wave = Math.sin(time * 1.1 - col * 0.55 - row * 0.35) * 0.18;
    out.set(x, y, 0.2 + wave);
    return out;
  }

  // stop 3: rings on a "ground" ellipse around a fire of lit orbs
  const groundY = box.cy - 0.32 * box.sy;
  const reach = Math.min(box.sx, box.sy * 1.3);
  const circle = item.circle;
  if (circle.fire !== undefined) {
    const t = circle.fire / Math.max(1, circle.of - 1);
    const height = Math.pow(t, 0.85) * reach * 0.62;
    const radius = (1 - t) * reach * 0.13 + 0.04;
    const angle = item.seed + time * (0.7 + t);
    out.set(
      box.cx + Math.cos(angle) * radius + Math.sin(time * 6.3 + item.seed * 3) * 0.04,
      groundY + height + Math.sin(time * 4.1 + item.seed) * 0.07 * (0.4 + t),
      0.6 + Math.sin(angle) * radius,
    );
    return out;
  }
  const radius = (0.32 + 0.165 * circle.ring) * reach;
  const direction = circle.ring % 2 ? 1 : -1;
  const angle = circle.angle + time * 0.045 * direction;
  out.set(
    box.cx + Math.cos(angle) * radius,
    groundY - Math.sin(angle) * radius * 0.3 + Math.sin(time * 1.4 + item.seed) * 0.03,
    0.4 + Math.sin(angle) * radius * 0.85,
  );
  return out;
}
