import { Suspense } from "react";

import { ForgotPasswordSuccessScreen } from "@/modules/auth/screens/forgot-password-success-screen";

export default function ForgotPasswordSentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[14px] text-grey-500">Loading…</p>
        </div>
      }
    >
      <ForgotPasswordSuccessScreen />
    </Suspense>
  );
}
