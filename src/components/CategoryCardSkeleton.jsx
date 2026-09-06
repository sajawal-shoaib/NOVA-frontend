export default function CategoryCardSkeleton({ large = false }) {
  return (
    <div className="relative pb-3 pr-3">
      <div
        className={`animate-pulse rounded-[28px] bg-nova-border/70 ${
          large ? "min-h-[420px] md:min-h-[520px]" : "min-h-[340px] md:min-h-[420px]"
        }`}
      />
    </div>
  )
}
