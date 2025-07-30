# Recruitment Portal Technical

# Design Document (TDD)

Coastal Seven Technologies

Version 1.0 | July 24, 2025

# Contents

1Introduction.................................2

2System Overview...............................2

3Team Roles..................................2

4System Components.............................2

4.1Frontend (React.js). . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .2

4.2Backend (FastAPI) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .3

4.3Database (MongoDB Atlas) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .4

5Security...................................5

6Performance and Scalability5

7Deployment5

<!-- 1 -->

## 1. Introduction

The Recruitment Portal is a web-based software solution designed to automate and stream line job management and candidate tracking for Coastal Seven Technologies. This Tech nical Design Document (TDD) outlines the system architecture, component interactions,data fow, and implementation details to meet the requirements specifed in the Recruit ment Portal Product Requirements Document (PRD). The system comprises an Admin Portal for job uploads and allocations and an HR Portal for managing assigned jobs and candidate applications. It integrates a React.js frontend, FastAPI backend, and MongoDB Atlas database,reduction in administrative overhead and increase in HR efciency.

# 2. System Overview

The Recruitment Portal is a cloud-hosted, microservices-based application with a client server architecture. The system comprises:

• Frontend: A React.js single-page application (SPA) for Admin and HR interfaces,hosted on a CDN (e.g., AWS S3 with CloudFront).

• Backend: A FastAPI service handling API requests, hosted on a cloud platform (e.g.,AWS EC2).

• Database: MongoDB Atlas for storing user, job, candidate, and application history data.

• External Services: AWS S3 for CSV fle storage, AWS SES for email notifcations (optional for status updates).

# 3. Team Roles

• Frontend: Siddharth, Mohan Ranga (React, Tailwind CSS)

• Backend: Jayanth, Chakradhar Reddy (FastAPI)

• Database: Bharathi (MongoDB Atlas)

# 4. System Components

## 4.1 Frontend (React.js)

Owners: Siddharth, Mohan Ranga

The frontend is a React.js SPA built with Vite, using Tailwind CSS for styling, React Router DOM for navigation, and Axios for API communication. Key libraries include:

• React Hook Form + Yup: Form management and validation for CSV uploads and candidate data entry.

• react-dropzone: Drag-and-drop functionality for CSV fle uploads.

• Chart.js: Visualization of job counts and allocation statuses on dashboards.

• React Toastify: Real-time notifcations for actions like CSV upload success or er rors.

• Framer Motion: UI animations for enhanced user experience.

### Key Pages:

<!-- 2 -->

• /admin/upload: CSV upload page with data preview and validation.

• /admin/dashboard: Admin dashboard displaying job counts, allocation statuses,and HR performance metrics.

• /admin/jobs: Lists all jobs with flters and manual allocation options.

• /hr/jobs: Lists jobs assigned to the HR user with flters and sorting.

• /hr/candidates/{jobId}: Displays candidate details and status update options.

• /hr/dashboard: HR dashboard summarizing assigned jobs and candidate sta tuses.

### Data Flow:

1. Admin uploads a CSV fle via react-dropzone on /admin/upload.

2. File is sent to the backend via POST /admin/upload-csv using Axios.

3. Parsed job data is displayed for preview, validated using Yup, and saved upon con frmation.

4. Job allocation and candidate status updates trigger API calls (PUT /admin/jobs/{id}/allocate PUT /hr/candidates/{id}/status) with success notifcations via React Toas tify.

## 4.2 Backend (FastAPI)

Owners: Jayanth, Chakradhar Reddy

The backend is built with FastAPI, running on Uvicorn, hosted on AWS EC2. It uses python-jose for JWT authentication, passlib for password hashing, and pandas or Python’s csv module for CSV parsing. Key libraries include:

• python-multipart: Handles fle uploads for CSV fles.

• python-dotenv: Manages environment variables.

• motor or beanie: Async MongoDB driver/ODM for database operations.

Key Backend Endpoints:

• Auth & User:

– POST /auth/register: Register Admin or HR user.

– POST /auth/login: Authenticate user and return JWT token.

– GET /auth/me: Retrieve current user info (JWT-protected).

• Admin:

– POST /admin/upload-csv: Upload and parse CSV job data, store in AWS S3.

– GET /admin/jobs: Retrieve all jobs with flters (status, source company).

– PUT /admin/jobs/{id}/allocate: Allocate/reassign job to HR.

– GET /admin/users: List all HRs.

– GET /admin/dashboard: Retrieve dashboard stats (job counts, allocations).

– GET /admin/candidates: View all candidates.

• HR:

<!-- 3 -->

– GET /hr/jobs: List jobs assigned to the HR.

– PUT /hr/jobs/{id}/status: Update job status.

– GET /hr/candidates/{jobId}: List candidates for a job.

– PUT /hr/candidates/{id}/status: Update candidate status.

– POST /hr/candidates/{id}/history: Add status change to history.

– GET /hr/dashboard: Retrieve HR dashboard stats.

• Shared:

– GET /jobs/{id}: Retrieve job details.

– GET /candidates/{id}: Retrieve candidate details.

– POST /candidates: Add new candidate.

– PUT /candidates/{id}: Update candidate info.

– GET /application-history/{id}: Retrieve status history.

Data Flow:

1. Receive CSV fle via POST /admin/upload-csv, store in AWS S3.

2. Parse CSV using pandas or csv, validate data, and save to jobs collection in Mon goDB.

3. Allocate jobs to HRs using automatic distribution logic (e.g., equal distribution) or manual override via PUT /admin/jobs/{id}/allocate.

4. Update candidate statuses and log changes to application_history via PUT /hr/candidates and POST /hr/candidates/{id}/history.

5. Generate reports (e.g., job allocation stats) in PDF/Excel using jsPDF and SheetJS.

## 4.3 Database (MongoDB Atlas)

Owner: Bharathi

MongoDB Atlas is used for data storage, with sharding for scalability. Collections in clude:

• users: {name, email, role (admin/hr), passwordHash, createdAt}

• jobs: {title, description, location, salaryPackage, sourceCompany, uploadedBy, al locatedTo, status (open/allocated/closed), createdAt}

• candidates: {name, email, phone, location, currentCTC, expectedCTC, jobId, githubLink,linkedinLink, status (selected/rejected/in_progress), notes, lastUpdatedBy}

• application_history: {candidateId, jobId, oldStatus, newStatus, updatedBy, times tamp, comment}

Indexes:

• users: email: Unique index for authentication.

• jobs: uploadedBy, allocatedTo: For fltering jobs by admin or HR.

• candidates: jobId, status: Compound index for candidate queries.

• application_history: candidateId, jobId: For efcient status history retrieval.

<!-- 4 -->

# 5. Security

• Authentication: JWT tokens stored in secure cookies, validated on each request using python-jose.

• Encryption: Data encrypted at rest (MongoDB Atlas) and in transit (HTTPS).

• Audit Logs: Store user actions (e.g., CSV uploads, job allocations, status updates)in application_history and a dedicated audit log collection.

• Role-Based Access: FastAPI dependency injection ensures Admins access all data,while HRs access only their assigned jobs and candidates.

# 6. Performance and Scalability

• Uptime: Achieve 99.9% uptime, monitored via AWS CloudWatch.

• Scaling: Horizontal scaling with AWS Auto Scaling for FastAPI and MongoDB shard ing.

# 7. Deployment

• Frontend: Deployed on AWS S3 with CloudFront CDN.

• Backend: Deployed on AWS EC2 with Elastic Load Balancer.

• Database: MongoDB Atlas with automated backups.

• CI/CD: GitHub Actions for automated testing and deployment.

<!-- 5 -->

