import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MonthlyCrashChart({ stats = [] }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData = months.map((month, index) => {
    const monthNumber = index + 1;

    const getCount = (year) =>
      stats.find(
        (item) =>
          item.year === year &&
          item.month === monthNumber
      )?.crashes ?? null;

    return {
      month,
      2020: getCount(2020),
      2021: getCount(2021),
      2022: getCount(2022),
    };
  });

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">
        Monthly Crash Trends
      </h2>

      <p className="mb-5 text-sm text-slate-500">
        Compare recorded crashes by month from 2020 to 2022.
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month"
            interval={0}
            tick={{fontSize: 12}} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="2020"
              stroke="#2563eb"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="2021"
              stroke="#f97316"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="2022"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyCrashChart;