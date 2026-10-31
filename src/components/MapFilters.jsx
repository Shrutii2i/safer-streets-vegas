
function MapFilters({
  selectedYear,
  onYearChange,
  onReset,
  selectedCollision,
  onCollisionChange,
}) {
  return (
    <div className="space-y-6">

      {/* Year filter */}
      <div>
        <label
          htmlFor="year-filter"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Crash Year
        </label>

        <select
          id="year-filter"
          value={selectedYear}
          onChange={(event) => onYearChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All years</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>

      <div>
  <label
    htmlFor="collision-type"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Collision Type
  </label>

  <select
    id="collision-type"
    value={selectedCollision}
    onChange={(event) => onCollisionChange(event.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
  >
    <option value="all">All collision types</option>
    <option value="ANGLE">Angle</option>
    <option value="REAR END">Rear End</option>
    <option value="NON-COLLISION">Non-Collision</option>
    <option value="SIDESWIPE - OVERTAKING">Sideswipe - Overtaking</option>
    <option value="SIDESWIPE - MEETING">Sideswipe - Meeting</option>
    <option value="BACKING">Backing</option>
    <option value="HEAD ON">Head On</option>
    <option value="REAR TO REAR">Rear to Rear</option>
    <option value="REAR TO SIDE">Rear to Side</option>
    <option value="UNKNOWN">Unknown</option>
  </select>
</div>


      {/* Minimum crash filter */}
     
      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        Reset Filters
      </button>

    </div>
  );
}

export default MapFilters;
