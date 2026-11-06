import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/supabase/user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AuthPage({ params }: Props) {
  const { locale } = await params;
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
        <AuthForm />
      </main>
    </>
  );
}