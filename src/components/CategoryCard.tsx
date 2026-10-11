import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  slug,
  name,
  imageUrl,
}: {
  slug: string;
  name: string;
  imageUrl: string | null;
}) {
  return (
    <Link
      href={`/category/${slug}`}
      className="card card-hover group relative block aspect-[4/5] overflow-hidden"
    >
      <Image
        src={imageUrl ?? "https://picsum.photos/seed/" + slug + "/500/625"}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, 16vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/10 to-transparent" />
      <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm sm:text-base leading-tight">
        {name}
      </span>
    </Link>
  );
}
