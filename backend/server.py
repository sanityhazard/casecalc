from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated, Optional
import json
import os
import random


app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    index: int | None
    name: int | str | None
    price: int | str | None
    dropRate: int | str | None

class Case(BaseModel):
    name: int | str | None
    price: int | str | None
    items: list[Item] | None


# Ensure the folder for storing JSON files exists
os.makedirs('json_data', exist_ok=True)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    print(f"Error message: {exc.detail}")
    return await request.app.default_exception_handler(request, exc)

# @app.post("/save")
# async def save_data(file_name: Annotated[str, Body()], items: list[Item]):
#     # Save the data to a file
#     if os.path.exists(f"{file_name}.json"):
#         return {"message": "File already exists"}
#     file_location = f'json_data/{file_name}.json'
#     with open(file_location, 'w') as file:
#         json.dump([item.dict() for item in items], file)
#     return {"message": "Data saved"}

@app.post("/save")
async def save_data(case: Case):
    case_dict = case.dict()
    with open(f'json_data/{case_dict["name"]}.json', 'w') as f:
        json.dump(case_dict, f)
    return {"message": "Case saved successfully"}

@app.get("/files")
async def get_files():
    # Get all the files in the json_data folder
    files = os.listdir('json_data')
    # Remove the .json
    files = [file.split('.')[0] for file in files]
    return {"files": files}

@app.get("/load/{file_name}")
async def load_data(file_name: str):
    file_location = f'json_data/{file_name}.json'
    # Check if file exists
    if not os.path.exists(file_location):
        return {"message": "File doesn't exist"}
    # Load and return the data
    with open(file_location, 'r') as file:
        data = json.load(file)
    return data

@app.post("/simulate")
async def simulate(case: Case, times: Optional[int] = 100000):
    items = random.choices(case.items, weights=[float(item.dropRate) for item in case.items], k=times)
    allCasinoWin = sum([float(case.price) - float(item.price) for item in items])
    avgCasinoWin = allCasinoWin / times
    casinoWinrate = len([item for item in items if float(item.price) < float(case.price)]) / times

    return {
        'allCasinoWin': allCasinoWin,
        'avgCasinoWin': avgCasinoWin,
        'casinoWinrate': casinoWinrate * 100
    }


# Run the following command in the terminal to start the server:
# uvicorn your_script_name:app --reload
