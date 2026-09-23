import { useId } from "react";

type Props = {
  className?: string;
};

/**
 * Isotipo de Pulso BA: la bandera argentina con el Sol de Mayo, enmarcada
 * con un borde tipo madera barnizada y rulos dorados de fileteado en las
 * esquinas.
 */
export function Isotype({ className = "h-8 w-8" }: Props) {
  const clipId = useId();

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g transform="translate(33 33)">
        <rect x="-26" y="-19" width="52" height="38" rx="6" fill="none" stroke="#7a2b12" strokeWidth="3" />
      </g>

      <g transform="translate(32 32)">
        <clipPath id={clipId}>
          <rect x="-26" y="-19" width="52" height="38" rx="5" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="-26" y="-19" width="52" height="38" fill="#F4F1E8" />
          <rect x="-26" y="-19" width="52" height="12.7" fill="#74ACDF" />
          <rect x="-26" y="6.3" width="52" height="12.7" fill="#74ACDF" />
        </g>
        <rect x="-26" y="-19" width="52" height="38" rx="5" fill="none" stroke="#8c3a12" strokeWidth="2" />

        <g>
          <circle r="7.5" fill="#c9821a" />
          <circle r="6.4" fill="#F0B429" />
          <g stroke="#c9821a" strokeWidth="1.6" strokeLinecap="round">
            <line x1="0" y1="-11" x2="0" y2="-8.5" />
            <line x1="0" y1="11" x2="0" y2="8.5" />
            <line x1="-11" y1="0" x2="-8.5" y2="0" />
            <line x1="11" y1="0" x2="8.5" y2="0" />
            <line x1="-7.8" y1="-7.8" x2="-6" y2="-6" />
            <line x1="7.8" y1="-7.8" x2="6" y2="-6" />
            <line x1="-7.8" y1="7.8" x2="-6" y2="6" />
            <line x1="7.8" y1="7.8" x2="6" y2="6" />
          </g>
        </g>
      </g>

      <g fill="none" stroke="#F0B429" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 14 C 4 10 4 6 8 4" />
        <path d="M56 14 C 60 10 60 6 56 4" />
        <path d="M8 50 C 4 54 4 58 8 60" />
        <path d="M56 50 C 60 54 60 58 56 60" />
      </g>
    </svg>
  );
}