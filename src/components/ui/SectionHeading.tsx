type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Encabezado en la tipografia de titulares (MuseoModerno). Un solo lugar
 * que define "asi se ven los titulos" (familia y peso); el tamano lo define
 * cada lugar donde se usa, segun su jerarquia.
 */
export function SectionHeading({ children, as: Tag = "h2", className = "" }: Props) {
  return <Tag className={`font-display font-bold ${className}`}>{children}</Tag>;
}