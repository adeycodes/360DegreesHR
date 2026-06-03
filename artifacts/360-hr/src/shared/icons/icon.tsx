import type { LucideIcon } from "lucide-react";

import {
  iconRegistry,
  iconSizes,
  iconWeights,
  type IconName,
  type IconSize,
  type IconWeight,
} from "@/config/design-system/icons";
import { cn } from "@/lib/utils";

export type IconProps = {
  name: IconName;
  weight?: IconWeight;
  size?: IconSize | number;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

export function Icon({
  name,
  weight = "regular",
  size = "md",
  className,
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
}: IconProps) {
  const LucideIcon = iconRegistry[name] as LucideIcon;
  const pixelSize = typeof size === "number" ? size : iconSizes[size];
  const strokeWidth = iconWeights[weight];

  return (
    <LucideIcon
      size={pixelSize}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
}

export { iconRegistry, iconWeights, iconSizes };
export type { IconName, IconWeight, IconSize };
