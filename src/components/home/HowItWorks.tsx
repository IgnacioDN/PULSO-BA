import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export async function HowItWorks() {
  const t = await getTranslations("HowItWorks");

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <Reveal>
          <SectionHeading as="h2" className="text-2xl sm:text-3xl">
            {t("title")}
          </SectionHeading>
          <p className="mt-2 text-white/60">{t("subtitle")}</p>
        </Reveal>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <li className="flex flex-col gap-2">
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-bold text-brand-gold/80"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-white/60">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}