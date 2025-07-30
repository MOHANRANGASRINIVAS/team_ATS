from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from typing import Optional
from models import CandidateCreate
from routes.auth import get_current_user, get_current_admin_user, get_current_hr_user
from database import get_database
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Shared"])

@router.get("/jobs/{job_id}")
async def get_job_details(job_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    job = await db.recruitment_portal.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job["id"] = str(job["_id"])
    del job["_id"]
    
    return job

@router.get("/candidates/{candidate_id}")
async def get_candidate_details(candidate_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    candidate = await db.recruitment_portal.candidates.find_one({"_id": ObjectId(candidate_id)})
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidate["id"] = str(candidate["_id"])
    del candidate["_id"]
    
    return candidate

@router.post("/candidates")
async def create_candidate(candidate: CandidateCreate, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    
    candidate_data = candidate.dict()
    candidate_data["created_at"] = datetime.utcnow()
    candidate_data["created_by"] = str(current_user["_id"])
    
    # Verify the job exists and is assigned to this HR user
    job = await db.recruitment_portal.jobs.find_one({
        "job_id": candidate_data["job_id"],
        "assigned_hr": str(current_user["_id"])
    })
    
    if not job:
        raise HTTPException(status_code=403, detail="Not authorized to add candidates to this job")
    
    result = await db.recruitment_portal.candidates.insert_one(candidate_data)
    candidate_data["id"] = str(result.inserted_id)
    # Remove MongoDB _id if present
    candidate_data.pop("_id", None)
    return JSONResponse(status_code=201, content={
        "message": "Candidate added successfully",
        "candidate": candidate_data
    })

@router.put("/candidates/{candidate_id}")
async def update_candidate(
    candidate_id: str,
    candidate_update: CandidateCreate,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    
    result = await db.recruitment_portal.candidates.update_one(
        {"_id": ObjectId(candidate_id)},
        {"$set": candidate_update.dict()}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return {"message": "Candidate updated successfully"}

@router.put("/candidates/{candidate_id}/status")
async def update_candidate_status(
    candidate_id: str,
    status: str,
    notes: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    candidate = await db.recruitment_portal.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    # Allow both admin and HR to update status, no job HR restriction
    old_status = candidate.get("status", "")
    await db.recruitment_portal.candidates.update_one(
        {"_id": ObjectId(candidate_id)},
        {"$set": {
            "status": status,
            "notes": notes,
            "last_updated_by": str(current_user["_id"])
        }}
    )
    # Add to history
    history_entry = {
        "candidate_id": candidate_id,
        "job_id": candidate["job_id"],
        "old_status": old_status,
        "new_status": status,
        "updated_by": str(current_user["_id"]),
        "timestamp": datetime.utcnow(),
        "comment": notes
    }
    await db.recruitment_portal.application_history.insert_one(history_entry)
    return {"message": "Candidate status updated successfully"}

@router.get("/application-history/{candidate_id}")
async def get_application_history(candidate_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    history = await db.recruitment_portal.application_history.find(
        {"candidate_id": candidate_id}
    ).sort("timestamp", -1).to_list(length=100)
    
    for entry in history:
        entry["id"] = str(entry["_id"])
        del entry["_id"]
    
    return history 