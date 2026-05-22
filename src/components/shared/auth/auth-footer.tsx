import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-grey-200 bg-white px-6 py-4 text-[13px] text-grey-600 sm:flex-row sm:px-10 lg:px-16">
      <span className="font-brand text-sm font-semibold text-grey-800">
        <span className="text-[#333F48]">360</span>
        <span className="text-[#333F48]">Degrees</span>
        <span className="text-[#2D5B63]">HR</span>
      </span>
      <nav className="flex flex-wrap items-center justify-center gap-6">
        <Link href="#" className="hover:text-grey-900">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-grey-900">
          Terms of Service
        </Link>
        <Link href="#" className="hover:text-grey-900">
          Help Center
        </Link>
      </nav>
      <p className="text-grey-500">© 2024 360DegreesHR. All rights reserved.</p>
    </footer>
  );
}
