import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white font-extrabold text-sm tracking-tight">
        PK
      </span>
      <span className="font-extrabold text-forest leading-tight text-[15px] sm:text-base hidden xs:inline">
        Pata <span className="text-amber-dark">KiDigital</span>
      </span>
    </Link>
  );
}
