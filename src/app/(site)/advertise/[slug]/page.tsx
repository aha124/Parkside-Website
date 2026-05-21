import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdCampaignBySlug } from "@/lib/admin-data";
import GoldDivider from "@/components/ui/GoldDivider";
import PageTransition from "@/components/ui/PageTransition";

const colors = {
  bg: "#0c0c18",
  bgAlt: "#0f0f1f",
  gold: "#c9a862",
  goldMuted: "#a89860",
  cream: "#f0ebe0",
  body: "#c0b898",
  muted: "#7a7260",
  divider: "rgba(201,168,98,0.5)",
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getAdCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    return { title: "Not Found" };
  }

  return {
    title: `${campaign.title} | Parkside Voices`,
    description:
      campaign.eventContext ||
      `Advertise with Parkside Voices. ${campaign.pitch.slice(0, 150)}`,
  };
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

export default async function AdCampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getAdCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  const paragraphs = campaign.pitch
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const dropdownMode = Boolean(
    campaign.paypalDropdownButtonId && campaign.paypalDropdownOptionName
  );

  return (
    <PageTransition>
      <link rel="stylesheet" href={FONT_URL} />
      <div style={{ backgroundColor: colors.bg }}>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden">
          {campaign.heroImageUrl && (
            <div className="absolute inset-0">
              <Image
                src={campaign.heroImageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(12,12,24,0.3) 0%, rgba(12,12,24,0.55) 40%, rgba(12,12,24,0.85) 75%, rgba(12,12,24,1) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32 sm:pt-40 pb-24 sm:pb-32">
            <p
              className="font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
              style={{ color: colors.gold }}
            >
              Sponsorship Opportunity
            </p>

            <GoldDivider className="mb-6" />

            <h1
              className="font-['Cormorant_Garamond',serif] italic font-light text-3xl sm:text-5xl md:text-6xl max-w-4xl"
              style={{
                color: colors.cream,
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {campaign.title}
            </h1>

            {campaign.eventContext && (
              <>
                <GoldDivider className="mt-6 mb-6" />
                <p
                  className="font-['Montserrat',sans-serif] text-sm sm:text-base font-semibold tracking-[0.2em] uppercase"
                  style={{ color: colors.gold }}
                >
                  {campaign.eventContext}
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── PITCH ─────────────────────────────────────────────────────────── */}
        {paragraphs.length > 0 && (
          <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: colors.bg }}>
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                {paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="font-['Montserrat',sans-serif] text-base sm:text-lg leading-relaxed"
                    style={{ color: colors.body }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PRICING TIERS ────────────────────────────────────────────────── */}
        {campaign.pricingTiers.length > 0 && (
          <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: colors.bgAlt }}>
            <div className="container mx-auto px-4">
              <h2
                className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-4"
                style={{
                  color: colors.cream,
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                }}
              >
                Ad Space Options
              </h2>

              <GoldDivider className="mb-12" />

              <div
                className={`grid gap-6 sm:gap-8 max-w-6xl mx-auto ${
                  campaign.pricingTiers.length === 1
                    ? "grid-cols-1 max-w-md"
                    : campaign.pricingTiers.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {campaign.pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="border rounded-2xl p-6 sm:p-8 flex flex-col"
                    style={{
                      borderColor: colors.divider,
                      backgroundColor: "rgba(12,12,24,0.6)",
                    }}
                  >
                    <h3
                      className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-medium mb-2"
                      style={{ color: colors.cream }}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className="font-['Montserrat',sans-serif] text-xs tracking-[0.2em] uppercase mb-4"
                      style={{ color: colors.goldMuted }}
                    >
                      {tier.spec}
                    </p>

                    <p
                      className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl font-medium mb-4"
                      style={{ color: colors.gold }}
                    >
                      {formatPrice(tier.price)}
                    </p>

                    {tier.description && (
                      <p
                        className="font-['Montserrat',sans-serif] text-sm leading-relaxed mb-6 flex-grow"
                        style={{ color: colors.body }}
                      >
                        {tier.description}
                      </p>
                    )}

                    {!dropdownMode && tier.paypalButtonId && (
                      <form
                        action="https://www.paypal.com/cgi-bin/webscr"
                        method="post"
                        target="_top"
                        className="mt-auto"
                      >
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input
                          type="hidden"
                          name="hosted_button_id"
                          value={tier.paypalButtonId}
                        />
                        <button
                          type="submit"
                          className="w-full font-['Montserrat',sans-serif] text-sm font-semibold tracking-[0.15em] uppercase px-6 py-3 rounded-full border-2 transition-all duration-300"
                          style={{
                            color: colors.gold,
                            borderColor: colors.gold,
                            backgroundColor: "transparent",
                          }}
                        >
                          Pay with PayPal
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>

              {dropdownMode && (
                <div className="max-w-xl mx-auto mt-12 sm:mt-16">
                  <h3
                    className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl md:text-4xl font-medium text-center mb-6"
                    style={{
                      color: colors.cream,
                      textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    Pay with PayPal
                  </h3>

                  <GoldDivider className="mb-8" />

                  <form
                    action="https://www.paypal.com/cgi-bin/webscr"
                    method="post"
                    target="_top"
                    className="flex flex-col gap-5"
                  >
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input
                      type="hidden"
                      name="hosted_button_id"
                      value={campaign.paypalDropdownButtonId}
                    />
                    <input
                      type="hidden"
                      name="on0"
                      value={campaign.paypalDropdownOptionName}
                    />
                    <input type="hidden" name="currency_code" value="USD" />

                    <label
                      htmlFor="os0"
                      className="font-['Montserrat',sans-serif] text-xs tracking-[0.2em] uppercase text-center"
                      style={{ color: colors.gold }}
                    >
                      {campaign.paypalDropdownOptionName}
                    </label>
                    <select
                      id="os0"
                      name="os0"
                      defaultValue={campaign.pricingTiers[0]?.name}
                      className="font-['Montserrat',sans-serif] text-sm sm:text-base px-5 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.cream,
                        borderColor: "rgba(201,168,98,0.4)",
                      }}
                    >
                      {campaign.pricingTiers.map((tier) => (
                        <option
                          key={tier.id}
                          value={tier.name}
                          style={{ backgroundColor: colors.bg, color: colors.cream }}
                        >
                          {tier.name} — {formatPrice(tier.price)} USD
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="font-['Montserrat',sans-serif] text-sm sm:text-base font-semibold tracking-[0.15em] uppercase px-10 py-4 rounded-full border-2 transition-all duration-300 hover:shadow-lg"
                      style={{
                        color: colors.gold,
                        borderColor: colors.gold,
                        backgroundColor: "transparent",
                      }}
                    >
                      Reserve via PayPal
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CTA / ORDER FORM ─────────────────────────────────────────────── */}
        {(campaign.orderFormUrl || campaign.deadline) && (
          <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: colors.bg }}>
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2
                  className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium mb-8"
                  style={{
                    color: colors.cream,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  Reserve Your Ad Space
                </h2>

                {campaign.deadline && (
                  <p
                    className="font-['Montserrat',sans-serif] text-sm sm:text-base font-semibold tracking-[0.2em] uppercase mb-10"
                    style={{ color: colors.gold }}
                  >
                    Submission deadline: {campaign.deadline}
                  </p>
                )}

                {campaign.orderFormUrl && (
                  <>
                    <a
                      href={campaign.orderFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-['Montserrat',sans-serif] text-sm sm:text-base font-semibold tracking-[0.15em] uppercase px-10 py-4 rounded-full border-2 transition-all duration-300 hover:shadow-lg"
                      style={{
                        color: colors.gold,
                        borderColor: colors.gold,
                        backgroundColor: "transparent",
                      }}
                    >
                      Submit Order Form
                    </a>
                    {(dropdownMode ||
                      campaign.pricingTiers.some((t) => t.paypalButtonId)) && (
                      <p
                        className="font-['Montserrat',sans-serif] text-xs mt-4"
                        style={{ color: colors.muted }}
                      >
                        Or pay directly using PayPal above
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── PAST PROGRAM ─────────────────────────────────────────────────── */}
        {campaign.pastProgramUrl && (
          <section className="py-12" style={{ backgroundColor: colors.bgAlt }}>
            <div className="container mx-auto px-4 text-center">
              <a
                href={campaign.pastProgramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Montserrat',sans-serif] text-sm tracking-[0.15em] uppercase transition-colors duration-200"
                style={{ color: colors.gold }}
              >
                View our last program &rarr;
              </a>
            </div>
          </section>
        )}

        {/* ── CONTACT ──────────────────────────────────────────────────────── */}
        {(campaign.contactName || campaign.contactEmail) && (
          <section className="py-12 sm:py-16" style={{ backgroundColor: colors.bg }}>
            <div className="container mx-auto px-4 text-center">
              <GoldDivider className="mb-8" />
              <p
                className="font-['Montserrat',sans-serif] text-sm sm:text-base"
                style={{ color: colors.body }}
              >
                Questions?{" "}
                {campaign.contactName && <>Contact {campaign.contactName}</>}
                {campaign.contactName && campaign.contactEmail && " at "}
                {campaign.contactEmail && (
                  <a
                    href={`mailto:${campaign.contactEmail}`}
                    style={{ color: colors.gold }}
                    className="hover:underline"
                  >
                    {campaign.contactEmail}
                  </a>
                )}
              </p>
              <div className="mt-8">
                <Link
                  href="/home"
                  className="font-['Montserrat',sans-serif] text-sm transition-colors duration-200"
                  style={{ color: colors.muted }}
                >
                  &larr; Back to Parkside Voices
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
