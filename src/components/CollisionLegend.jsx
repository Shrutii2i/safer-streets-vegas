const collisionTypes = [
  { label: "Angle", color: "#2563eb" },
  { label: "Rear End", color: "#f97316" },
  { label: "Head On", color: "#dc2626" },
  { label: "Sideswipe", color: "#8b5cf6" },
  { label: "Non-Collision", color: "#64748b" },
  { label: "Backing", color: "#14b8a6" },
  { label: "Other / Unknown", color: "#94a3b8" },
];

function CollisionLegend() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Collision Types
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {collisionTypes.map((type) => (
          <div
            key={type.label}
            className="flex items-center gap-2"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: type.color }}
            />

            <span className="text-xs text-slate-600">
              {type.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Colors represent collision categories, not severity.
      </p>
    </div>
  );
}

export default CollisionLegend;