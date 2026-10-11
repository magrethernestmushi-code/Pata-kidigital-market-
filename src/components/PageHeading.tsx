export default function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark">{title}</h1>
      {subtitle && <p className="text-sm text-charcoal/60 mt-1 max-w-xl">{subtitle}</p>}
    </div>
  );
}
