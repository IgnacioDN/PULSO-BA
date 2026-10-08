import { z } from "zod";

const CATEGORY_VALUES = ["music", "theater", "food", "nightlife", "art", "social"] as const;
const BUDGET_VALUES = ["free", "low", "mid", "any"] as const;

export const AiFiltersSchema = z.object({
  budget: z.enum(BUDGET_VALUES).nullable(),
  categories: z.array(z.enum(CATEGORY_VALUES)),
  neighborhood: z.string().nullable(),
  keywords: z.array(z.string()).max(4),
});

export type AiFilters = z.infer<typeof AiFiltersSchema>;

export function buildSearchPrompt(query: string, neighborhoods: string[]): string {
  return `Sos un asistente que interpreta pedidos en español sobre planes y eventos en Buenos Aires.
A partir del pedido del usuario, devolvé SOLO un JSON (sin texto adicional, sin markdown, sin explicación) con esta forma exacta:
{
  "budget": "free" | "low" | "mid" | "any" | null,
  "categories": string[],
  "neighborhood": string | null,
  "keywords": string[]
}

Reglas:
- "budget": "free" si pide algo gratis; "low" si pide barato o menciona un tope de hasta $15.000; "mid" si menciona hasta $30.000 o "no muy caro"; "any" si dice explícitamente que no le importa el precio; usá null si no se puede inferir nada sobre presupuesto.
- "categories": elegí cero, una o varias de esta lista EXACTA: ${CATEGORY_VALUES.join(", ")}. Array vacío si no se especifica un tipo de plan.
- "neighborhood": si el pedido menciona alguno de estos barrios, devolvé el nombre EXACTO tal como aparece acá: ${neighborhoods.join(", ")}. Si no menciona ninguno, null.
- "keywords": hasta 4 palabras sueltas en español (sin tildes, minúsculas) que ayuden a afinar la búsqueda — un estilo, un ambiente, algo puntual que no entre en las categorías de arriba. No repitas ahí la categoría ni el barrio.

Pedido del usuario: "${query}"`;
}