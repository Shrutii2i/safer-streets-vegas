
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



function CrashChart({ stats = [] }) {
  const chartData = stats.map((item) => ({
    year: String(item.year),
    crashes: item.crashes,
  }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">
        Crashes by Year
      </h2>

      <p className="mb-5 text-sm text-slate-500">
        Recorded crashes in the RTC dataset (2020–2022).
        Counts cover the full imported dataset, not just
        the crashes visible on the map.
      </p>

      {chartData.length === 0 ? (
        <p className="text-sm text-slate-500">
          Loading crash statistics...
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={false}/>
              <Bar
                dataKey="crashes"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default CrashChart;
