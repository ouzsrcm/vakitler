/** Basit tesbih: daire zinciri (Tabler 2.x'te rozet ikonu yok). */
export default function TasbihNavIcon({
  size = 22,
  stroke = 1.5,
}: {
  size?: number | string;
  stroke?: number | string;
}) {
  const s = Number(size) || 22;
  const sw = Number(stroke) || 1.5;
  const r = s * 0.09;
  const gap = s * 0.2;
  const cy = s * 0.5;
  const x0 = s * 0.22;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {[0, 1, 2, 3].map(i => (
        <circle
          key={i}
          cx={x0 + i * gap}
          cy={cy}
          r={r}
          stroke="currentColor"
          strokeWidth={sw}
        />
      ))}
    </svg>
  );
}
