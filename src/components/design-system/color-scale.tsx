import type { ColorScale, ColorScaleKey } from "@/lib/utilities";
import { cn } from "@/lib/utils";

const scaleOrder: ColorScaleKey[] = [500, 400, 300, 200, 100, 50];

type ColorScaleProps = {
  name: string;
  tokenPrefix: string;
  scale: ColorScale;
  className?: string;
};

export function ColorScaleDisplay({
  name,
  tokenPrefix,
  scale,
  className,
}: ColorScaleProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-h5 text-foreground">{name}</h3>
        <code className="text-body-3 text-muted-foreground">{scale[500]}</code>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div
          className="flex h-24 items-end p-4"
          style={{ backgroundColor: scale[500] }}
        >
          <span className="text-body-3 font-semibold text-white">
            {tokenPrefix}-500
          </span>
        </div>
        <div className="grid grid-cols-5">
          {([400, 300, 200, 100, 50] as const).map((step) => (
            <div
              key={step}
              className="flex h-16 flex-col justify-end p-2"
              style={{ backgroundColor: scale[step] }}
            >
              <span className="text-[10px] font-medium text-[color:var(--color-grey-900)]/70">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {scaleOrder.map((step) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className="size-6 rounded-md border border-border"
              style={{ backgroundColor: scale[step] }}
            />
            <code className="text-body-3 text-muted-foreground">
              {tokenPrefix}-{step}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

type GreyscaleRowProps = {
  step: number;
  hex: string;
  token: string;
};

export function GreyscaleSwatch({ step, hex, token }: GreyscaleRowProps) {
  const textClass =
    step >= 500 ? "text-white" : "text-grey-900";

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex h-14 items-center justify-between rounded-lg px-3",
          textClass,
        )}
        style={{ backgroundColor: hex }}
      >
        <span className="text-body-3 font-semibold">{step}</span>
        <code className="text-[10px] opacity-80">{hex}</code>
      </div>
      <code className="text-body-3 text-muted-foreground">{token}</code>
    </div>
  );
}

type AdditionalSwatchProps = {
  name: string;
  hex: string;
};

export function AdditionalSwatch({ name, hex }: AdditionalSwatchProps) {
  return (
    <div className="space-y-2">
      <div
        className="flex h-20 items-end rounded-xl border border-border p-3"
        style={{ backgroundColor: hex }}
      >
        <span
          className={cn(
            "text-body-3 font-semibold capitalize",
            name === "white" ? "text-grey-900" : "text-white",
          )}
        >
          {name}
        </span>
      </div>
      <code className="text-body-3 text-muted-foreground">{hex}</code>
    </div>
  );
}
