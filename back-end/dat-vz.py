import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow your frontend app (React) to make requests to the FastAPI backend
origins = [
    "http://localhost:5173",  # React frontend running on localhost:5173 (adjust as necessary)
    "http://localhost",      # Add any other frontend origins here
    "http://127.0.0.1",      # Localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the listed origins to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Log file info
        logger.info(f"Uploading file: {file.filename}")
        
        # Read Excel file into pandas DataFrame
        contents = await file.read()
        df = pd.read_excel(contents)

        # Log data for debugging (first few rows)
        logger.info(f"Data preview: {df.head()}")

        # Handle NaN values: Replace with None or empty string (or handle however you prefer)
        df = df.where(pd.notnull(df), None)

        # Convert DataFrame to JSON format and return it to the frontend
        data = df.to_dict(orient="records")
        return JSONResponse(content=data)
    except Exception as e:
        logger.error(f"Error processing the file: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.get("/")
def read_root():
    return {"message": "Upload an Excel file to get data!"}
