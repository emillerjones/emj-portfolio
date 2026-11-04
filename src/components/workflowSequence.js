// A deliberately simplified workflow illustration, not a TCEQ process model.
export const RECORD_COUNT = 24;
export const WORKFLOW_DURATION = 30;
const smooth = (value) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * smooth(t);

export function workflowRecord(index, elapsed) {
  const age = elapsed - index * 0.55;
  const arrival = { x: -0.91 + (index % 3) * 0.16, y: Math.sin(index * 2.4) * 0.58 };
  const output = { x: 0.48 + (index % 4) * 0.12, y: 0.48 - Math.floor(index / 4) * 0.19 };
  const held = index % 7 === 3;
  const point = (x, y, stage) => ({ x, y, stage });
  if (age < 0) return point(arrival.x, arrival.y, "intake");
  if (age < 2) return point(mix(arrival.x, -0.25, age / 2), mix(arrival.y, 0, age / 2), "intake");
  if (age < 4) return point(mix(-0.25, 0.04, (age - 2) / 2), 0, "queued");
  if (age < 5) return point(0.04, 0, "checking");
  if (held && age < 6) return point(0.04, mix(0, -0.58, age - 5), "held");
  if (held && age < 8) return point(0.04, -0.58, "held");
  if (held && age < 9) return point(0.04, mix(-0.58, 0, age - 8), "held");
  const releaseAt = held ? 9 : 5;
  if (age < releaseAt + 2) return point(mix(0.04, output.x, (age - releaseAt) / 2), mix(0, output.y, (age - releaseAt) / 2), "approved");
  return point(output.x, output.y, "released");
}
