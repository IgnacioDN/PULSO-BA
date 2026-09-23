type Props = {
  className?: string;
};

/**
 * Rulo de fileteado chico, para acompañar el wordmark en el header.
 */
export function Flourish({ className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 4 C 30 4 30 16 20 16 C 12 16 12 26 20 26 C 28 26 28 34 20 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="4" r="2.4" fill="currentColor" />
      <circle cx="20" cy="36" r="2.4" fill="currentColor" />
    </svg>
  );
}