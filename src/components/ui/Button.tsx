type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

/**
 * Boton base del sistema de diseno. Nace de extraer los tres botones que
 * estaban repetidos a mano (con las mismas clases) en Hero.tsx.
 */
export function Button({ variant = "solid", className = "", ...props }: Props) {
  const base = "rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50";
  const variants = {
    solid: "bg-white text-neutral-950 hover:bg-white/90",
    ghost: "text-white/70 hover:text-white",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
