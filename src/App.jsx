import { useState, useEffect, useCallback } from "react";
import MapLegend from "./components/MapLegend";
import TrafficMap from './components/TrafficMap';
import MapFilters from "./components/MapFilters";
import CrashChart from "./components/CrashChart";
import MonthlyCrashChart from "./components/MonthlyCrashChart";
import CollisionLegend from "./components/CollisionLegend";


function App() {
const [selectedYear, setSelectedYear]= useState("all");
const [minCrashes, setMinCrashes] = useState(0);

const [hotspots, setHotspots] = useState([]);
const [crashes, setCrashes] = useState([]);
const [crashStats, setCrashStats] = useState([]);
const [monthlyStats, setMonthlyStats] = useState([]);
const [selectedCollision, setSelectedCollision] = useState("all");
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

useEffect(() => {
 fetch(`${API_URL}/hotspots`)
    .then((response) => response.json())
    .then((data) => {
      setHotspots(data);
    })
    .catch((error) => {
      console.error("Failed to fetch hotspots:", error);
    });
}, []);

 function resetFilters() {
    setSelectedYear("all");
    setSelectedCollision("all");
    setMinCrashes(0);
  }

const filteredHotspots = hotspots.filter((spot) => {
  const matchesYear =
    selectedYear === "all" || spot.year === Number(selectedYear);

  const matchesCrashes = spot.crashes >= minCrashes;

  return matchesYear && matchesCrashes;
  

});


useEffect(() => {
  fetch(`${API_URL}/crash-stats`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch crash statistics");
      }
      return response.json();
    })
.then((data) => {
  console.log("Crash statistics received:", data);
  setCrashStats(data);
})
    .catch((error) => {
      console.error("Error fetching crash statistics:", error);
    });
}, []);

useEffect(() => {
fetch(`${API_URL}/monthly-crash-stats`)
    .then((response) => response.json())
    .then((data) => {
      setMonthlyStats(data);
      console.log("Monthly crash statistics:", data);
    })
    .catch((error) => {
      console.error("Error fetching monthly statistics:", error);
    });
}, []);

const handleBoundsChange = useCallback(async (bounds) => {
  const params = new URLSearchParams({
    south: bounds.getSouth(),
    north: bounds.getNorth(),
    west: bounds.getWest(),
    east: bounds.getEast(),
  });

  if (selectedYear !== "all") {
    params.set("year", selectedYear);
  }

  if (selectedCollision !== "all") {
  params.set("collision_type", selectedCollision);
}

  try {
    const response = await fetch(
      `${API_URL}/crashes?${params}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch crashes");
    }

    const data = await response.json();
    console.log("Crashes received:", data.length);
    setCrashes(data);
  } catch (error) {
    console.error("Error fetching crashes:", error);
  }
}, [selectedYear, selectedCollision]);




  return (
    <>
  {/* Header of the website  */}
  
<header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
      Safer Streets Vegas
    </h1>
    <p className="mt-1 text-sm text-slate-500">
      Making Las Vegas roads safer through data and community action.
    </p>
  </div>

  <span className="ml-4 shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
    BETA
  </span>
</header>
{/*------------------------------------- */}

{/*------------------------------------- */}

<main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">

  {/* Left sidebar */}
  <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="mb-5 text-lg font-semibold text-slate-900">
      Explore the Map
    </h2>

    <MapFilters
      selectedYear={selectedYear}
      onYearChange={setSelectedYear}
      minCrashes={minCrashes}
      onMinCrashesChange={setMinCrashes}
      selectedCollision={selectedCollision}
      onCollisionChange={setSelectedCollision}
      onReset={resetFilters}

      
    />
    

    <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
      <p className="font-semibold text-slate-900">
         {crashes.length} crash records displayed
      </p>
      <p className="mt-2">
        Year: {selectedYear === "all" ? "All years" : selectedYear}
      </p>
      <p>Minimum crashes: {minCrashes}</p>
      <p className="mt-2 text-xs text-slate-500">
  Historical RTC crash records (2021–2022).
  Showing up to 500 records within the visible map area.
</p>
    </div>
  </aside>

  {/* Right map panel */}
  <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 text-lg font-semibold text-slate-900">
      Crash Hotspot Map
    </h2>

  <TrafficMap
  hotspots={[]}
  crashes={crashes}
  onBoundsChange={handleBoundsChange}
/>
<CollisionLegend />



    <MapLegend />
  </section>
  <div className= "min-w-0 lg:col-span-2 grid grid-cols-1 gap-6 xl:grid-cols-2">
  <CrashChart stats={crashStats} />
  
  <MonthlyCrashChart stats={monthlyStats} />
    <p className="mt-4 text-xs leading-relaxed text-slate-500">
  April and May 2020 show lower recorded crash counts than
  the same months in 2021 and 2022. This period coincides
  with the early COVID-19 pandemic. Differences may also
  reflect traffic volume, reporting, and dataset coverage.
</p>
</div>
</main>

    </>
  );
}

export default App
