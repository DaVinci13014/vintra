import Image from "next/image";
import Link from "next/link";

type LogoProps = { compact?: boolean; href?: string; priority?: boolean };

export function Logo({ compact = false, href = "/", priority = false }: LogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-3"
      aria-label="Accueil Vintra"
    >
      <Image src="/logo/vintra-logo.svg" width={36} height={36} alt="" priority={priority} />
      {!compact && <span className="text-base font-semibold tracking-tight">Vintra</span>}
    </Link>
  );
}
