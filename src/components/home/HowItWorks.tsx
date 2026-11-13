import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

import type { EventWithRelations } from "@/lib/schemas";

/** Un evento de la agenda ilustra cada paso (se busca por slug; si no está, se omite la foto). */
const STEP_PHOTO_SLUGS = ["feria-de-diseno-del-riel", "noche-electrica-vol-3", "atardecer-en-la-terraza"];

export async function HowItWorks({ events }: { events: EventWithRelations[] }) {
  const t = await getTranslations("HowItWorks");

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ].map((step, i) => ({
    ...step,
    photoUrl: events.find((e) => e.slug === STEP_PHOTO_SLUGS[i])?.photo?.url ?? null,
  }));

  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <Reveal>
          <SectionHeading as="h2" className="pulso-heading text-2xl sm:text-3xl">
            {t("title")}
          </SectionHeading>
          <p className="mt-2 text-white/60">{t("subtitle")}</p>
        </Reveal>

        <ol className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120} className="w-64 shrink-0 snap-start sm:w-auto">
              <li className="flex flex-col gap-2">
                {step.photoUrl && (
                  <div className="relative mb-2 h-36 overflow-hidden rounded-2xl">
                    <Image src={`${step.photoUrl}?auto=format&fit=crop&w=600&q=70`} alt="" fill sizes="(min-width: 640px) 360px, 256px" className="object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                <span
                  aria-hidden="true"
                  className="pulso-step-number font-display text-4xl font-bold text-brand-celeste"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-white/75">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}