import { Suspense } from "react";

import { ResetPasswordScreen } from "@/modules/auth/screens/reset-password-screen";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[14px] text-grey-500">Loading…</p>
        </div>
      }
    >
      <ResetPasswordScreen />
    </Suspense>
  );
}
