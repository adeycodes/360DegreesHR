import type { Metadata } from "next";

import {
  AdditionalSwatch,
  ColorScaleDisplay,
  GreyscaleSwatch,
} from "@/components/design-system/color-scale";
import { Icon } from "@/components/design-system/icon";
import { BrandIcon } from "@/components/design-system/icons/brand-icon";
import { Heading, Quote, Text } from "@/components/design-system/typography";
import { Separator } from "@/components/ui/separator";
import {
  additionalColors,
  alertColors,
  greyscaleSteps,
  mainColors,
} from "@/config/design-system/colors";
import {
  brandIcons,
  iconShowcase,
  iconWeights,
  type IconWeight,
} from "@/config/design-system/icons";
import {
  headings,
  manropeSpecimen,
  textStyles,
  type HeadingLevel,
} from "@/config/design-system/typography";

export const metadata: Metadata = {
  title: "Design System",
  description: "360DegreesHR colors, typography, and iconography.",
};

const headingLevels = Object.keys(headings) as HeadingLevel[];
const textVariants = Object.keys(textStyles) as (keyof typeof textStyles)[];
const weights = Object.keys(iconWeights) as IconWeight[];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-16 space-y-4">
        <p className="text-h6 text-primary">Design System</p>
        <h1 className="text-h1 text-balance">Colors, typography & icons</h1>
        <Text variant="text1" className="max-w-2xl text-muted-foreground">
          Complete token reference for 360DegreesHR — Main, Alerts, Greyscale,
          Additional, Open Sans headings, Manrope brand, and icon stroke weights.
        </Text>
      </header>

      <section id="colors-main" className="mb-20 space-y-8">
        <div>
          <h2 className="text-h2">Colors — Main</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            Primary deep blue and secondary golden yellow, each with five tint
            steps (50–400) below the base (500).
          </Text>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          {mainColors.map((item) => (
            <ColorScaleDisplay
              key={item.tokenPrefix}
              name={item.name}
              tokenPrefix={item.tokenPrefix}
              scale={item.scale}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section id="colors-alerts" className="mb-20 space-y-8 pt-4">
        <div>
          <h2 className="text-h2">Colors — Alerts</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            Success, warning, and error scales for feedback and status UI.
          </Text>
        </div>
        <div className="grid gap-12 lg:grid-cols-3">
          {alertColors.map((item) => (
            <ColorScaleDisplay
              key={item.tokenPrefix}
              name={item.name}
              tokenPrefix={item.tokenPrefix}
              scale={item.scale}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section id="colors-greyscale" className="mb-20 space-y-8 pt-4">
        <div>
          <h2 className="text-h2">Colors — Greyscale</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            Neutral ramp from 50 to 900. Steps 700–900 use corrected darker
            values (source sheet labels were duplicated).
          </Text>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {greyscaleSteps.map((row) => (
            <GreyscaleSwatch
              key={row.step}
              step={row.step}
              hex={row.hex}
              token={row.token}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section id="colors-additional" className="mb-20 space-y-8 pt-4">
        <div>
          <h2 className="text-h2">Colors — Additional</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            White, orange, blue, and purple accent colors.
          </Text>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {additionalColors.map((item) => (
            <AdditionalSwatch key={item.name} name={item.name} hex={item.hex} />
          ))}
        </div>
      </section>

      <Separator />

      <section id="typography" className="mb-20 space-y-10 pt-4">
        <div>
          <h2 className="text-h2">Typography</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            Manrope for brand display; Open Sans for headings, body, and quotes.
          </Text>
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-8 lg:p-12">
          <p className="text-body-3 font-semibold uppercase tracking-wider text-muted-foreground">
            {manropeSpecimen.label}
          </p>
          <p className="text-specimen mt-4 text-foreground">Aa</p>
          <p className="font-brand mt-6 text-body-2 text-muted-foreground">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            !@#$%^&*()
          </p>
          <Text variant="text3" className="mt-4 text-muted-foreground">
            {manropeSpecimen.description}
          </Text>
        </div>

        <div className="space-y-8">
          <h3 className="text-h4">Headings — Open Sans</h3>
          {headingLevels.map((level) => {
            const spec = headings[level];
            return (
              <div
                key={level}
                className="grid gap-4 border-b border-border pb-8 lg:grid-cols-[200px_1fr]"
              >
                <div className="space-y-1">
                  <p className="text-body-3 font-semibold text-muted-foreground">
                    {spec.label}
                  </p>
                  <code className="text-body-3 text-muted-foreground">
                    {spec.fontWeight} · {spec.fontSize}
                    {"textTransform" in spec
                      ? ` · ${spec.textTransform}`
                      : ""}
                  </code>
                </div>
                <Heading level={level}>
                  The quick brown fox jumps over the lazy dog
                </Heading>
              </div>
            );
          })}
        </div>

        <div className="space-y-8">
          <h3 className="text-h4">Paragraph — Open Sans</h3>
          {textVariants.map((variant) => {
            const spec = textStyles[variant];
            return (
              <div
                key={variant}
                className="grid gap-4 border-b border-border pb-8 lg:grid-cols-[200px_1fr]"
              >
                <div className="space-y-1">
                  <p className="text-body-3 font-semibold text-muted-foreground">
                    {spec.label}
                  </p>
                  <code className="text-body-3 text-muted-foreground">
                    Regular · {spec.fontSize}
                  </code>
                </div>
                <Text variant={variant}>
                  People operations with a complete view of your workforce.
                  Built for HR teams who need clarity, speed, and craft.
                </Text>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-h4">Quote — Open Sans Light Italic</h3>
          <Quote cite="Design system">
            Great products are built on consistent typography, color, and icon
            language.
          </Quote>
        </div>
      </section>

      <Separator />

      <section id="icons" className="space-y-10 pt-4">
        <div>
          <h2 className="text-h2">Icons + Logo</h2>
          <Text variant="text2" className="mt-2 text-muted-foreground">
            Lucide-based icon component with thin, regular, and bold stroke
            weights. Brand logos for OAuth and social sign-in.
          </Text>
        </div>

        <div className="space-y-6">
          <h3 className="text-h4">Stroke weights</h3>
          <div className="flex flex-wrap items-end gap-12">
            {weights.map((weight) => (
              <div key={weight} className="flex flex-col items-center gap-3">
                <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                  <Icon name="settings" weight={weight} size="lg" />
                  <Icon name="search" weight={weight} size="lg" />
                  <Icon name="bell" weight={weight} size="lg" />
                </div>
                <code className="text-body-3 text-muted-foreground capitalize">
                  {weight} ({iconWeights[weight]}px)
                </code>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-h4">Brand logos</h3>
          <div className="flex flex-wrap gap-8">
            {brandIcons.map((brand) => (
              <div
                key={brand}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-8 py-6"
              >
                <BrandIcon name={brand} size={40} />
                <code className="text-body-3 capitalize text-muted-foreground">
                  {brand}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-h4">UI icon library</h3>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {iconShowcase.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
              >
                <Icon name={name} weight="regular" size="md" />
                <span className="text-center text-[10px] text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-h4">Weight comparison (per icon)</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-body-3">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold">Icon</th>
                  {weights.map((w) => (
                    <th key={w} className="px-4 py-3 font-semibold capitalize">
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {iconShowcase.slice(0, 12).map((name) => (
                  <tr key={name} className="border-b border-border">
                    <td className="px-4 py-3 font-medium">{name}</td>
                    {weights.map((weight) => (
                      <td key={weight} className="px-4 py-3">
                        <Icon name={name} weight={weight} size="sm" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
