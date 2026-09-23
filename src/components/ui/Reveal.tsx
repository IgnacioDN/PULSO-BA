type Props = {
  children: React.ReactNode;
  className?: string;
  /** Demora de la animacion en ms, para escalonar varios Reveal en cascada. */
  delay?: number;
};

/**
 * Animacion de entrada, 100% CSS (sin JS). No puede fallar: el fotograma
 * final de la animacion es opacity:1, asi que en el peor de los casos el
 * contenido no anima, pero siempre termina visible.
 */
export function Reveal({ children, className = "", delay = 0 }: Props) {
  return (
    <div className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}