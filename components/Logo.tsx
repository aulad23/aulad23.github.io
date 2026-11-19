// AH monogram in ink, with a small violet point on the A's apex.
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="42" height="42" rx="21" fill="#1C1B19" />
      <g stroke="#F3EFE6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 31 15.5 13 22 31" />
        <path d="M11.6 24.5h7.8" />
        <path d="M26.5 13v18M34 13v18M26.5 22h7.5" />
      </g>
      <circle cx="15.5" cy="13" r="2.6" fill="#FFE27A" />
    </svg>
  );
}
