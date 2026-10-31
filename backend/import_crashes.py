
import json
import os
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import urlopen

import psycopg

from dotenv import load_dotenv

load_dotenv()

base_url = (
    "https://services2.arcgis.com/sFujhckYoxsqnpfe/"
    "ArcGIS/rest/services/RTC_HIN_Crashes_20250801/"
    "FeatureServer/0/query"
)

params = {
    "where": "CrashDate >=DATE '2020-01-01' AND CrashDate < DATE '2023-01-01'",
    "outFields": (
        "CrashNum,CrashDate,Street1,Street2,CrashType,"
        "VehCrashTy,Weather,LightCondi,NumVehicle,"
        "NumInjured,NumFatalit,Pedestrian,Motorcycle"
    ),
    "returnGeometry": "true",
    "outSR": "4326",
    "orderByFields": "FID ASC",
    "resultRecordCount": 500,
    "resultOffset": 0,
    "f": "json",
}


all_features = []
offset = 0
batch_size = 500

while True:
    params["resultOffset"] = offset
    params["resultRecordCount"] = batch_size

    url = base_url + "?" + urlencode(params)

    with urlopen(url, timeout=60) as response:
        data = json.load(response)

    if "error" in data:
        raise RuntimeError(data["error"])

    features = data.get("features", [])

    if not features:
        break

    all_features.extend(features)

    print(f"Downloaded {len(all_features)} records...")

    if len(features) < batch_size:
        break

    offset += batch_size

features = all_features

def yes_no(value):
    if value == "YES":
        return True
    if value == "NO":
        return False
    return None

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as check_cur:
        check_cur.execute("SELECT current_database(), current_schema()")
        print("Connected to:", check_cur.fetchone())

        check_cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'crash_records'
    """)
        print("Tables found:", check_cur.fetchall())

    with conn.cursor() as cur:
        for feature in features:
            a = feature["attributes"]
            geometry = feature.get("geometry") or {}

            crash_date = datetime.fromtimestamp(
                a["CrashDate"] / 1000,
                tz=timezone.utc
            ).date()

            cur.execute(
                """
                INSERT INTO crash_records (
                    crash_number, crash_date, street1, street2,
                    latitude, longitude, crash_type, collision_type,
                    weather, lighting, num_vehicles, num_injured,
                    num_fatalities, pedestrian, motorcycle
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s
                )
                ON CONFLICT (crash_number) DO NOTHING
                """,
                (
                    a["CrashNum"],
                    crash_date,
                    a["Street1"],
                    a["Street2"],
                    geometry.get("y"),
                    geometry.get("x"),
                    a["CrashType"],
                    a["VehCrashTy"],
                    a["Weather"],
                    a["LightCondi"],
                    a["NumVehicle"],
                    a["NumInjured"],
                    a["NumFatalit"],
                    yes_no(a["Pedestrian"]),
                    yes_no(a["Motorcycle"]),
                ),
            )

print(f"Finished processing {len(features)} crash records.")
print("Database import completed.")
