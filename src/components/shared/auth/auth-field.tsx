import { cn } from "@/lib/utils";

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  labelAction?: React.ReactNode;
  children: React.ReactNode;
};

export function AuthField({
  label,
  htmlFor,
  error,
  labelAction,
  children,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold tracking-[0.06em] text-grey-600 uppercase"
        >
          {label}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p className="text-body-3 text-error-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function authInputClassName(className?: string) {
  return cn(
    "h-[48px] w-full rounded-lg border border-transparent bg-[#F3F4F6] px-4 text-[15px] text-grey-900 outline-none transition-[box-shadow,border-color,background] placeholder:text-grey-500 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-400/25",
    className,
  );
}
