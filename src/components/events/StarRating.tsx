type Props = {
  rating: number;
  /** Tamaño de las estrellas (clases de Tailwind de texto). */
  className?: string;
};

/** Estrellas de solo lectura: llenas en celeste, vacías apagadas. */
export function StarRating({ rating, className = "text-base" }: Props) {
  const filled = Math.round(rating);

  return (
    <span role="img" aria-label={`${rating} de 5`} className={`inline-flex gap-0.5 leading-none ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value} aria-hidden="true" className={value <= filled ? "text-brand-celeste" : "text-white/20"}>★</span>
      ))}
    </span>
  );
}
