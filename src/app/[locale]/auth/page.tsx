import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/supabase/user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const NOTICES: Record<string, string> = {
  confirmacion: "No pudimos iniciar tu sesión desde el link del mail. Si ya confirmaste tu email, iniciá sesión acá con tu email y contraseña.",
  recuperacion: "El link para cambiar la contraseña venció, ya se usó o se abrió en otro navegador. Tocá \"¿Olvidaste tu contraseña?\" para pedir uno nuevo.",
};

export default async function AuthPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale);

  if (!isSupabaseConfigured()) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-16 text-center text-white/60">
          <p>El login todavía no está configurado.</p>
        </main>
      </>
    );
  }

  // Si ya tenés sesión, esta página no tiene nada que hacer.
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mx-auto mb-10 max-w-sm text-center">
          <SectionHeading as="h1" className="text-3xl">Tu cuenta en Pulso BA</SectionHeading>
          <p className="mt-2 text-white/60">Guardá favoritos, marcá a qué planes vas y dejá tu opinión sobre los eventos.</p>
        </div>
        <AuthForm notice={error ? NOTICES[error] : undefined} />
      </main>
    </>
  );
}
