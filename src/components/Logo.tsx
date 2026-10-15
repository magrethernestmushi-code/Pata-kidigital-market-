import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <Image
        src="/brand/pata-online-icon.png"
        alt="Pata Online"
        width={36}
        height={29}
        className="h-8 w-auto sm:h-9"
        priority
      />
      <span className="font-extrabold text-forest leading-tight text-[15px] sm:text-base hidden xs:inline">
        Pata <span className="text-amber-dark">Online</span>
      </span>
    </Link>
  );
}
