import "./Starfield.css";

// Generated once at module load -- stable for the life of the page,
// varies between full reloads, which is fine for decorative background.
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.1,
      delay: Math.random() * 5,
      duration: 2.5 + Math.random() * 3,
    });
  }
  return stars;
}

const STARS = generateStars(190);

export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="starfield__dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
