import type { BrandIconName } from "@/config/design-system/icons";

import { BrandAppleIcon } from "./brand-apple";
import { BrandFacebookIcon } from "./brand-facebook";
import { BrandGoogleIcon } from "./brand-google";

type BrandIconProps = {
  name: BrandIconName;
  size?: number;
  className?: string;
};

const brandMap = {
  google: BrandGoogleIcon,
  facebook: BrandFacebookIcon,
  apple: BrandAppleIcon,
} as const;

export function BrandIcon({ name, size = 32, className }: BrandIconProps) {
  const Component = brandMap[name];
  return <Component size={size} className={className} />;
}
