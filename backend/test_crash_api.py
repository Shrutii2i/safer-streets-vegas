
import json
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import urlopen

base_url = (
    "https://services2.arcgis.com/sFujhckYoxsqnpfe/"
    "ArcGIS/rest/services/RTC_HIN_Crashes_20250801/"
    "FeatureServer/0/query"
)

params = {
    "where": "CrashDate >= DATE '2021-01-01' AND CrashDate < DATE '2023-01-01'",
    "outStatistics": json.dumps([
        {
            "statisticType": "count",
            "onStatisticField": "FID",
            "outStatisticFieldName": "total_crashes"
        },
        {
            "statisticType": "min",
            "onStatisticField": "CrashDate",
            "outStatisticFieldName": "earliest_date"
        },
        {
            "statisticType": "max",
            "onStatisticField": "CrashDate",
            "outStatisticFieldName": "latest_date"
        }
    ]),
    "returnGeometry": "false",
    "f": "json"
}

url = base_url + "?" + urlencode(params)

with urlopen(url, timeout=30) as response:
    data = json.load(response)

if "error" in data:
    print("API error:", data["error"])

elif not data.get("features"):
    print("No statistics returned.")

else:
    stats = data["features"][0]["attributes"]

    print("Total crashes:", stats["total_crashes"])

    for key in ["earliest_date", "latest_date"]:
        timestamp = stats.get(key)

        if timestamp is not None:
            date = datetime.fromtimestamp(
                timestamp / 1000,
                tz=timezone.utc
            ).strftime("%Y-%m-%d")

            print(f"{key}: {date}")
        else:
            print(f"{key}: Not available")
