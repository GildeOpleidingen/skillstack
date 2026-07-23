type GaugeProps = {
  value: number; // 0-100
  size?: "small" | "medium" | "large" | "xlarge";
  showValue?: boolean;
  color?: string; // tailwind text- color class
  bgColor?: string; // tailwind text- color class for background ring
};

export function Gauge({
  value,
  size = "small",
  showValue = true,
  color = "text-[hsla(131,41%,46%,1)]",
  bgColor = "text-[#333]",
}: GaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = 332; // 2 * Math.PI * 53
  const valueInCircumference = (clamped / 100) * circumference;
  const strokeDasharray = `${circumference} ${circumference}`;
  const initialOffset = circumference;
  const strokeDashoffset = initialOffset - valueInCircumference;

  const sizes = {
    small: { width: 36, height: 36, textSize: "text-xs" },
    medium: { width: 72, height: 72, textSize: "text-lg" },
    large: { width: 144, height: 144, textSize: "text-3xl" },
    xlarge: { width: 192, height: 192, textSize: "text-4xl" },
  } as const;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        fill="none"
        shapeRendering="crispEdges"
        height={sizes[size].height}
        width={sizes[size].width}
        viewBox="0 0 120 120"
        strokeWidth={2}
        className="-rotate-90"
        aria-label={`Gauge: ${clamped}%`}
        role="img"
      >
        <title>{`Gauge: ${clamped}%`}</title>
        <circle
          className={`${bgColor}`}
          strokeWidth={12}
          stroke="currentColor"
          fill="transparent"
          shapeRendering="geometricPrecision"
          r={53}
          cx={60}
          cy={60}
        />
        <circle
          className={`animate-gauge_fill ${color}`}
          strokeWidth={12}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={initialOffset}
          shapeRendering="geometricPrecision"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={53}
          cx={60}
          cy={60}
          style={{
            strokeDashoffset,
            transition: "stroke-dasharray 1s ease 0s,stroke 1s ease 0s",
          }}
        />
      </svg>
      {showValue ? (
        <div className="absolute opacity-0 animate-gauge_fadeIn">
          <p className={`text-gray-100 ${sizes[size].textSize}`}>{clamped}%</p>
        </div>
      ) : null}
    </div>
  );
}
