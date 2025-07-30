from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
import pandas as pd
import random
from models import UserCreate
from routes.auth import get_current_admin_user
from database import get_database

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read CSV file
        df = pd.read_csv(file.file)
        
        # Validate required columns
        required_columns = ['title', 'description', 'location', 'ctc']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {missing_columns}")
        
        jobs_added = 0
        for _, row in df.iterrows():
            # Generate unique job ID
            job_id = f"jb{datetime.now().strftime('%m%d%H%M')}{random.randint(10, 99)}"
            
            job_data = {
                "job_id": job_id,
                "title": row['title'],
                "description": row['description'],
                "location": row['location'],
                "salary_package": row['ctc'],
                "source_company": "CSV Upload",
                "uploaded_by": str(current_user["_id"]),
                "status": "allocated",
                "opening_date": datetime.now(),
                "created_at": datetime.utcnow()
            }
            
            result = await db.recruitment_portal.jobs.insert_one(job_data)
            jobs_added += 1
        
        return {"message": f"Successfully uploaded {jobs_added} jobs"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

@router.post("/add-job")
async def add_job(job_data: dict, current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    # Generate unique job ID
    job_id = f"jb{datetime.now().strftime('%m%d%H%M')}{random.randint(10, 99)}"
    
    job_data["job_id"] = job_id
    job_data["uploaded_by"] = str(current_user["_id"])
    job_data["status"] = "allocated"
    job_data["opening_date"] = datetime.now()
    job_data["created_at"] = datetime.utcnow()
    job_data["source_company"] = "Manual Entry"
    
    result = await db.recruitment_portal.jobs.insert_one(job_data)
    
    return {"message": "Job added successfully", "job_id": job_id}

@router.post("/add-jobs-bulk")
async def add_jobs_bulk(jobs_data: List[dict], current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    jobs_added = 0
    for job_data in jobs_data:
        # Generate unique job ID - smaller format
        job_id = f"jb{datetime.now().strftime('%m%d%H%M')}{random.randint(10, 99)}"
        
        job_data["job_id"] = job_id
        job_data["uploaded_by"] = str(current_user["_id"])
        job_data["status"] = "allocated"  # Initial status as allocated
        job_data["opening_date"] = datetime.now()
        job_data["created_at"] = datetime.utcnow()
        job_data["salary_package"] = job_data.get("ctc", "")
        job_data["source_company"] = "CSV Upload"
        
        result = await db.recruitment_portal.jobs.insert_one(job_data)
        jobs_added += 1
    
    return {"message": f"Successfully added {jobs_added} jobs"}

@router.put("/jobs/{job_id}")
async def update_job(
    job_id: str,
    job_update: dict,
    current_user: dict = Depends(get_current_admin_user)
):
    db = await get_database()
    
    # Remove fields that shouldn't be updated
    job_update.pop("_id", None)
    job_update.pop("job_id", None)
    job_update.pop("uploaded_by", None)
    job_update.pop("created_at", None)
    
    result = await db.recruitment_portal.jobs.update_one(
        {"job_id": job_id},
        {"$set": job_update}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job updated successfully"}

@router.get("/jobs")
async def get_all_jobs(
    status: Optional[str] = None,
    source_company: Optional[str] = None,
    current_user: dict = Depends(get_current_admin_user)
):
    db = await get_database()
    
    # Build filter
    filter_query = {}
    if status:
        filter_query["status"] = status
    if source_company:
        filter_query["source_company"] = source_company
    
    # Get all HR users for name mapping
    hr_users = await db.recruitment_portal.users.find({"role": "hr"}).to_list(length=100)
    hr_user_map = {str(user["_id"]): user["name"] for user in hr_users}
    
    jobs = await db.recruitment_portal.jobs.find(filter_query).sort("created_at", -1).to_list(length=100)
    
    for job in jobs:
        job["id"] = str(job["_id"])
        del job["_id"]
        
        # Add HR user name if assigned
        if job.get("assigned_hr"):
            job["assigned_hr_name"] = hr_user_map.get(job["assigned_hr"], "Unknown")
    
    return jobs

@router.put("/jobs/{job_id}/allocate")
async def allocate_job(
    job_id: str,
    hr_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    db = await get_database()
    
    # Verify HR user exists
    hr_user = await db.recruitment_portal.users.find_one({"_id": ObjectId(hr_id), "role": "hr"})
    if not hr_user:
        raise HTTPException(status_code=404, detail="HR user not found")
    
    result = await db.recruitment_portal.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"assigned_hr": hr_id, "status": "allocated"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job allocated successfully"}

@router.get("/users")
async def get_all_users(current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    users = await db.recruitment_portal.users.find({"role": "hr"}).to_list(length=100)
    
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
        del user["password"]  # Don't send password
    
    return users

@router.post("/users")
async def create_hr_user(user_data: dict, current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    # Check if user already exists
    existing_user = await db.recruitment_portal.users.find_one({"email": user_data["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new HR user
    from routes.auth import get_password_hash
    
    user_data["role"] = "hr"
    user_data["password"] = get_password_hash(user_data["password"])
    user_data["created_at"] = datetime.utcnow()
    
    result = await db.recruitment_portal.users.insert_one(user_data)
    user_data["id"] = str(result.inserted_id)
    
    return {"message": "HR user created successfully", "user": user_data}

@router.delete("/users/{user_id}")
async def delete_hr_user(user_id: str, current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    # Check if HR has allocated jobs
    allocated_jobs = await db.recruitment_portal.jobs.count_documents({"assigned_hr": user_id})
    if allocated_jobs > 0:
        raise HTTPException(status_code=400, detail="Cannot delete HR user with allocated jobs")
    
    result = await db.recruitment_portal.users.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "HR user deleted successfully"}

@router.put("/users/{user_id}")
async def update_hr_user(
    user_id: str,
    user_update: dict,
    current_user: dict = Depends(get_current_admin_user)
):
    db = await get_database()
    
    # Remove fields that shouldn't be updated
    user_update.pop("_id", None)
    user_update.pop("role", None)
    user_update.pop("created_at", None)
    
    # Hash password if provided
    if "password" in user_update and user_update["password"]:
        from routes.auth import get_password_hash
        user_update["password"] = get_password_hash(user_update["password"])
    elif "password" in user_update:
        del user_update["password"]
    
    result = await db.recruitment_portal.users.update_one(
        {"_id": ObjectId(user_id), "role": "hr"},
        {"$set": user_update}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="HR user not found")
    
    return {"message": "HR user updated successfully"}

@router.get("/dashboard")
async def get_admin_dashboard(current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    # Get job counts
    total_jobs = await db.recruitment_portal.jobs.count_documents({})
    open_jobs = await db.recruitment_portal.jobs.count_documents({"status": "open"})
    allocated_jobs = await db.recruitment_portal.jobs.count_documents({"status": "allocated"})
    closed_jobs = await db.recruitment_portal.jobs.count_documents({"status": "closed"})
    
    # Get candidate counts
    total_candidates = await db.recruitment_portal.candidates.count_documents({})
    selected_candidates = await db.recruitment_portal.candidates.count_documents({"status": "selected"})
    rejected_candidates = await db.recruitment_portal.candidates.count_documents({"status": "rejected"})
    
    # Get HR user count
    hr_users = await db.recruitment_portal.users.count_documents({"role": "hr"})
    
    return {
        "total_jobs": total_jobs,
        "open_jobs": open_jobs,
        "allocated_jobs": allocated_jobs,
        "closed_jobs": closed_jobs,
        "total_candidates": total_candidates,
        "selected_candidates": selected_candidates,
        "rejected_candidates": rejected_candidates,
        "hr_users": hr_users
    }

@router.get("/candidates")
async def get_all_candidates(current_user: dict = Depends(get_current_admin_user)):
    db = await get_database()
    
    candidates = await db.recruitment_portal.candidates.find({}).sort("created_at", -1).to_list(length=100)
    
    for candidate in candidates:
        candidate["id"] = str(candidate["_id"])
        del candidate["_id"]
    
    return candidates 