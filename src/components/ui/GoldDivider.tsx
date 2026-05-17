const DIVIDER_COLOR = "rgba(201,168,98,0.5)";
const GOLD = "#c9a862";

export default function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px w-16 sm:w-24"
        style={{ background: `linear-gradient(to right, transparent, ${DIVIDER_COLOR})` }}
      />
      <div className="w-2 h-2 rotate-45" style={{ backgroundColor: GOLD }} />
      <div
        className="h-px w-16 sm:w-24"
        style={{ background: `linear-gradient(to left, transparent, ${DIVIDER_COLOR})` }}
      />
    </div>
  );
}
