import Image from "next/image";

import { cn } from "@/shared/lib";

const SIZES = {
  xs: { className: "size-6 text-[0.6rem]", pixels: 24 },
  sm: { className: "size-8 text-xs", pixels: 32 },
  md: { className: "size-11 text-sm", pixels: 44 },
  lg: { className: "size-16 text-lg", pixels: 64 },
  xl: { className: "size-24 text-2xl", pixels: 96 },
} as const;

type AvatarProps = {
  firstName: string;
  lastName: string;
  image?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
};

export function Avatar({ firstName, lastName, image, size = "md", className }: AvatarProps) {
  const dimensions = SIZES[size];

  if (image) {
    return (
      <Image
        src={image}
        alt={`Photo de ${firstName} ${lastName}`}
        width={dimensions.pixels}
        height={dimensions.pixels}
        unoptimized
        className={cn(
          "shrink-0 rounded-full border border-border object-cover",
          dimensions.className,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full border border-border bg-foreground font-semibold text-background",
        dimensions.className,
        className,
      )}
      aria-label={`Profil de ${firstName} ${lastName}`}
    >
      {initials(firstName, lastName)}
    </span>
  );
}

function initials(firstName: string, lastName: string) {
  return `${firstName.trim().at(0) ?? ""}${lastName.trim().at(0) ?? ""}`.toLocaleUpperCase("fr-FR");
}
