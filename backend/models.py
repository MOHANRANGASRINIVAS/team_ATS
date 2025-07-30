from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: str
    role: str  # "admin" or "hr"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

class JobBase(BaseModel):
    title: str
    description: str
    location: str
    salary_package: str
    source_company: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str
    uploaded_by: str
    allocated_to: Optional[str] = None
    status: str = "open"  # "open", "allocated", "closed"
    created_at: datetime

class ExperienceEntry(BaseModel):
    organization: str
    end_client: str
    project: str
    start_month_year: str
    end_month_year: str
    technology_tools: str

class CandidateBase(BaseModel):
    # Required fields
    name: str
    email: str
    phone: str
    
    # Optional fields
    pan_number: Optional[str] = None
    current_location: Optional[str] = None
    hometown: Optional[str] = None
    total_experience: Optional[str] = None
    relevant_experience: Optional[str] = None
    
    # Education - Class X
    education_x_institute: Optional[str] = None
    education_x_start_date: Optional[str] = None
    education_x_end_date: Optional[str] = None
    education_x_percentage: Optional[str] = None
    
    # Education - Class XII
    education_xii_institute: Optional[str] = None
    education_xii_start_date: Optional[str] = None
    education_xii_end_date: Optional[str] = None
    education_xii_percentage: Optional[str] = None
    
    # Education - Degree
    education_degree_name: Optional[str] = None
    education_degree_institute: Optional[str] = None
    education_degree_start_date: Optional[str] = None
    education_degree_end_date: Optional[str] = None
    education_degree_percentage: Optional[str] = None
    
    # Legacy education fields (keeping for backward compatibility)
    education_x: Optional[str] = None
    education_xii: Optional[str] = None
    education_degree: Optional[str] = None
    education_percentage: Optional[str] = None
    education_duration: Optional[str] = None
    
    # Experience
    experience_entries: Optional[List[ExperienceEntry]] = []
    
    # Additional fields
    certifications: Optional[str] = None
    publications: Optional[str] = None
    references: Optional[str] = None
    
    # Legacy fields (keeping for backward compatibility)
    experience: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None
    projects: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    
    job_id: str
    status: Optional[str] = "applied"
    applied_date: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: str
    status: str = "applied"  # "applied", "in_progress", "interviewed", "selected", "rejected"
    notes: Optional[str] = None
    last_updated_by: Optional[str] = None
    created_at: datetime

class ApplicationHistory(BaseModel):
    id: str
    candidate_id: str
    job_id: str
    old_status: str
    new_status: str
    updated_by: str
    timestamp: datetime
    comment: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 