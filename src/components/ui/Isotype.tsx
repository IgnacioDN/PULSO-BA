type Props = {
  className?: string;
};

/**
 * Isotipo de Pulso BA: un roseton inspirado en el fileteado porteño, con el
 * efecto clasico de tres tonos del oficio (sombra oscura + color base + luz),
 * en vez de imitar la letra caligrafica (eso requiere trabajo de mano real).
 * Motivo: la rosa/flor es uno de los elementos mas recurrentes del fileteado.
 */
export function Isotype({ className = "h-8 w-8" }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g transform="translate(33 33)" fill="none" stroke="#7a2b12" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M0 -20 C 6 -20 9 -14 6 -9 C 12 -11 18 -7 17 -1 C 22 3 21 11 15 13 C 16 19 10 24 4 22 C 1 27 -7 27 -10 22 C -16 24 -22 19 -21 13 C -27 11 -28 3 -23 -1 C -24 -7 -18 -11 -12 -9 C -15 -14 -12 -20 -6 -20 C -3 -22 3 -22 0 -20 Z" />
      </g>

      <g transform="translate(32 32)" fill="#F0B429" stroke="#8c3a12" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M0 -20 C 6 -20 9 -14 6 -9 C 12 -11 18 -7 17 -1 C 22 3 21 11 15 13 C 16 19 10 24 4 22 C 1 27 -7 27 -10 22 C -16 24 -22 19 -21 13 C -27 11 -28 3 -23 -1 C -24 -7 -18 -11 -12 -9 C -15 -14 -12 -20 -6 -20 C -3 -22 3 -22 0 -20 Z" />
      </g>

      <circle cx="32" cy="32" r="9" fill="#C81D25" stroke="#7a1015" strokeWidth="1.4" />

      <g transform="translate(31 31)" fill="none" stroke="#F9E6B8" strokeWidth="1.1" strokeLinecap="round">
        <path d="M-4 -17 C -8 -14 -10 -10 -9 -6" />
        <path d="M-20 -1 C -23 2 -24 6 -22 10" />
        <path d="M-8 20 C -5 23 -1 24 3 23" />
      </g>

      <g transform="translate(32 32)" stroke="#F4F1E8" strokeWidth="1.3" strokeLinecap="round">
        <line x1="-4" y1="0" x2="4" y2="0" />
        <line x1="0" y1="-4" x2="0" y2="4" />
      </g>
    </svg>
  );
}