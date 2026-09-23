type Props = {
  className?: string;
};

/**
 * Chapita tipo fileteado, inspirada en los carteles "Buenos Aires" pintados
 * a mano: contorno lobulado, borde rojo + dorado, interior oscuro y una
 * flor central de tres tonos.
 */
export function CityBadge({ className = "h-7 w-7" }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3 C 24 3 25 6 28 5.5 C 32 5 34 8 32.5 11 C 36 12 37 16 34 18 C 37 20 37 24 33.5 25.5 C 35 29 32 32.5 28 31.5 C 27 35 22.5 36.5 20 34 C 17.5 36.5 13 35 12 31.5 C 8 32.5 5 29 6.5 25.5 C 3 24 3 20 6 18 C 3 16 4 12 7.5 11 C 6 8 8 5 12 5.5 C 15 6 16 3 20 3 Z"
        fill="none"
        stroke="#c81d25"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 6 C 23 6 24 8 26.5 7.6 C 29.5 7.2 31 9.5 30 11.8 C 32.8 12.6 33.5 15.5 31.2 17 C 33.5 18.5 33.5 21.5 30.8 22.7 C 32 25.3 29.8 27.9 27 27.1 C 26.3 29.9 23 31 20.8 29.2 C 19 31 15.7 29.9 15 27.1 C 12.2 27.9 10 25.3 11.2 22.7 C 8.5 21.5 8.5 18.5 10.8 17 C 8.5 15.5 9.2 12.6 12 11.8 C 11 9.5 12.5 7.2 15.5 7.6 C 17 8 18 6 20 6 Z"
        fill="#14100d"
        stroke="#f0b429"
        strokeWidth="1.3"
      />
      <g transform="translate(20 18.5)">
        <circle r="4.2" fill="#7a1015" />
        <circle r="3.4" fill="#c81d25" />
        <circle r="1.6" fill="#f0b429" />
      </g>
      <g stroke="#f0b429" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <path d="M20 12 C 17.5 13.5 17.5 16 20 16.5" />
        <path d="M20 25 C 22.5 23.5 22.5 21 20 20.5" />
      </g>
      <circle cx="9" cy="30" r="1.6" fill="#f0b429" stroke="#8c3a12" strokeWidth="0.6" />
      <circle cx="31" cy="30" r="1.6" fill="#f0b429" stroke="#8c3a12" strokeWidth="0.6" />
    </svg>
  );
}