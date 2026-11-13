import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getCurrentUser } from "@/lib/supabase/user";

type Props = {
  params: Promise<{ locale: string }>;
};

const LINK_CLASS = "mt-5 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90";

/**
 * Pantalla a la que lleva el link del mail de recuperación. El callback ya
 * abrió una sesión temporal; sin ella (link vencido o ya usado) no hay nada
 * que cambiar, así que se ofrece pedir otro.
 */
export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mx-auto mb-10 max-w-sm text-center">
          <SectionHeading as="h1" className="text-3xl">Elegí una contraseña nueva</SectionHeading>
          {user && <p className="mt-2 text-white/60">Vas a cambiar la contraseña de {user.email}.</p>}
        </div>

        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="mx-auto max-w-sm text-center">
            <p className="text-white/70">El link venció o ya se usó. Pedí uno nuevo desde el inicio de sesión.</p>
            <Link href="/auth" className={LINK_CLASS}>Ir a iniciar sesión</Link>
          </div>
        )}
      </main>
    </>
  );
}
