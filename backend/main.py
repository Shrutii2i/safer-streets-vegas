import os
import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException

app = FastAPI()
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
         os.getenv("FRONTEND_URL", "http://localhost:5173"),
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Safer Streets Vegas API is running"}

@app.get("/hotspots")
def get_hotspots():
    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, location, latitude, longitude, crashes, year
                FROM hotspots
                ORDER BY id;
            """)

            rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "location": row[1],
            "latitude": float(row[2]),
            "longitude": float(row[3]),
            "crashes": row[4],
            "year": row[5]
        }
        for row in rows
   
    ]


@app.get("/crashes")
def get_crashes(
    south: float,
    north: float,
    west: float,
    east: float,
    year: int | None = None,
    collision_type: str | None = None
):
    if not (-90 <= south < north <= 90):
        raise HTTPException(
            status_code=400,
            detail="Invalid latitude bounds"
        )

    if not (-180 <= west < east <= 180):
        raise HTTPException(
            status_code=400,
            detail="Invalid longitude bounds"
        )

    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
    SELECT
        crash_number,
        crash_date,
        street1,
        street2,
        latitude,
        longitude,
        crash_type,
        collision_type
        
    FROM crash_records
    WHERE latitude BETWEEN %s AND %s
      AND longitude BETWEEN %s AND %s
      AND (
          %s::text IS NULL
          OR UPPER(TRIM(collision_type)) = %s::text
      )
      AND (
          %s::integer IS NULL
          OR EXTRACT(YEAR FROM crash_date) = %s::integer
      )
    ORDER BY crash_date DESC, crash_number
    LIMIT 500
""", (
    south, north, west, east,
    collision_type, collision_type,
    year, year
))

            columns = [desc.name for desc in cur.description]
            rows = cur.fetchall()

    return [dict(zip(columns, row)) for row in rows]

@app.get("/crash-stats")
def get_crash_stats():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    EXTRACT(YEAR FROM crash_date)::integer AS year,
                    COUNT(*) AS crashes
                FROM crash_records
                WHERE crash_date IS NOT NULL
                GROUP BY EXTRACT(YEAR FROM crash_date)
                ORDER BY year
            """)

            rows = cur.fetchall()

    return [
        {"year": year, "crashes": count}
        for year, count in rows
    ]

@app.get("/monthly-crash-stats")
def get_monthly_crash_stats():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    EXTRACT(YEAR FROM crash_date)::integer AS year,
                    EXTRACT(MONTH FROM crash_date)::integer AS month,
                    COUNT(*) AS crashes
                FROM crash_records
                WHERE crash_date IS NOT NULL
                GROUP BY year, month
                ORDER BY year, month
            """)

            rows = cur.fetchall()

    return [
        {
            "year": year,
            "month": month,
            "crashes": count
        }
        for year, month, count in rows
    ]