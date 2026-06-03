import { GlassBrandCard } from "@/components/shared/auth/glass-brand-card";

type LoginBuildingHeroProps = {
  title: string;
  description?: string;
};

/** Shared left-panel hero for password login, register, forgot password */
export function LoginBuildingHero({ title, description }: LoginBuildingHeroProps) {
  return (
    <div className="flex h-full items-center justify-center py-10">
      <GlassBrandCard title={title} description={description} />
    </div>
  );
}
