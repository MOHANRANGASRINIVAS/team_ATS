> **Recruitment** **Portal** **Product** **Requirements** **Document**
> **(PRD)**
>
> Coastal Seven Technologies Version 1.1 \| July 24, 2025

**Contents**

**1** **Introduction** **2**

**2** **Objectives** **2**

**3** **Stakeholders** **2**

**4** **Team** **Roles** **2**

**5** **User** **Stories** **2**

**6** **Functionality** **(Frontend)** **3**

**7** **Functionality** **(Backend)** **4**

**8** **Database** **5**

**9** **Regulatory** **and** **Security** **5**

**10** **Performance** **and** **Scalability** **6**

**11** **Interactivity** **6**

**12** **Customization** **6**

> 1

**1.** **Introduction**

The Recruitment Portal is a web-based software solution designed to
streamline job management and candidate tracking for Coastal Seven
Technologies. The system com-prises two primary interfaces: an Admin
Portal for managing job uploads and alloca-tions, and an HR Portal for
handling assigned jobs and candidate applications. By au-tomating
CSV-based job data extraction, job allocation, and candidate status
tracking, the portal aims to reduce administrative overhead and improve
HR eficiency in candi-datemanagement.
Thesolutionensuressecure,role-basedaccessandprovidesintuitive dashboards
for both admins and HR personnel.

**2.** **Objectives**

The Recruitment Portal aims to:

> • Reduce job allocation time by automating CSV data extraction and
> distribution to HR personnel.
>
> •
> EnhanceHReficiencythroughstreamlinedcandidatemanagementandstatustrack-ing.
>
> • Ensure data security with role-based access control and JWT
> authentication.
>
> • Provide intuitive user interfaces for admins and HRs, improving user
> experience and operational visibility.
>
> • Achieve high accuracy in CSV data extraction for job fields (e.g.,
> Job Description, Role, Location, Package).

**3.** **Stakeholders**

> • **Admins**: RequiretoolstouploadjobdataviaCSV,allocatejobstoHRs,
> andmonitor overall recruitment progress through dashboards.
>
> • **HR** **Personnel**: Need eficient interfaces to manage assigned
> jobs, track candidate applications, and update statuses.
>
> • **IT** **Department**: Demands a secure, scalable system with
> seamless integration into existing infrastructure.
>
> • **Senior** **Management**: Ensures alignment with company goals,
> cost eficiency, and scalability.

**4.** **Team** **Roles**

> • **Frontend**: Siddharth, Mohan Ranga (React, Tailwind CSS) •
> **Backend**: Jayanth, Chakradhar Reddy (FastAPI)
>
> • **Database**: Bharathi (MongoDB Atlas)

**5.** **User** **Stories**

> 1\. **Admin** **User** **Stories**
>
> • As an Admin, I want to upload a CSV file containing job openings
> from tie-up companies, so that I can quickly add multiple jobs to the
> portal.
>
> 2
>
> • As an Admin, I want to preview extracted job data before saving, so
> that I can verify accuracy and correct any errors.
>
> • AsanAdmin, IwantthesystemtoautomaticallyallocatejobstoHRpersonnel,
> so that I can save time on manual assignments.
>
> • As an Admin, I want to manually reassign jobs to specific HRs, so
> that I can override automatic allocations when needed.
>
> • As an Admin, I want a dashboard showing total job openings,
> allocation sta-tuses, and HR performance, so that I can monitor
> recruitment progress.
>
> • As an Admin, I want to view all HR and candidate details, so that I
> can ensure proper job and application management.
>
> 2\. **HR** **User** **Stories**
>
> • As an HR, I want to view a list of jobs assigned to me with details
> like Job Description, Role, Location, and Status, so that I can
> prioritize my work.
>
> • As an HR, I want to filter and sort jobs by status, role, or
> location, so that I can quickly find relevant jobs.
>
> • As an HR, I want to view detailed candidate profiles for each job,
> including Name, Contact, CTC, and external links, so that I can
> evaluate applicants effec-tively.
>
> •
> AsanHR,Iwanttoupdatecandidatestatuses(e.g.,Selected,Rejected,InProgress)
> with notes, so that I can track application progress and maintain
> records.
>
> • As an HR, I want a dashboard summarizing my assigned jobs and
> candidate application statuses, so that I can assess my workload and
> progress.
>
> • As an HR, I want to add comments to candidate status changes, so
> that I can provide context for audit purposes.

**6.** **Functionality** **(Frontend)**

> 1\. **CSV** **Upload** **&** **Preview** **Interface** **(Admin)**:
>
> • Provide an intuitive file upload interface for admins to upload CSV
> files con-taining job openings.
>
> • Display a preview of extracted job data (Job Description, Role,
> Location, Pack-age) with validation errors for malformed files.
>
> • Use React components and Tailwind CSS for responsive, modern
> styling. 2. **Job** **Allocation** **Dashboard** **(Admin)**:
>
> • Develop a dashboard displaying total job openings, allocation
> statuses (e.g., Allocated, Pending), and HR performance metrics (e.g.,
> jobs handled, closure rate).
>
> • Integrate Chart.js for visualizing job counts and allocation
> statuses. • Support manual job reassignment with a drag-and-drop
> interface.
>
> 3\. **Job** **Listing** **&** **Filters** **(HR)**:
>
> 3
>
> • Display a responsive list of jobs assigned to the HR user, including
> Job Descrip-tion, Role, Location, Package, and Status (Submitted,
> Closed, Open).
>
> • Implement filters for status, role, or location and sorting by date
> or priority using React state management.
>
> 4\. **Candidate** **Management** **&** **Profile** **View** **(HR)**:
>
> • Create a detailed candidate view with Name, Email, Phone, Location,
> Cur-rent/Expected CTC, GitHub/LinkedIn links, and Status.
>
> • Allow HRs to update candidate statuses (Selected, Rejected, In
> Progress) with notes for audit purposes.
>
> • Use Tailwind CSS for consistent, responsive styling. 5.
> **Role-Based** **Access** **&** **Dynamic** **Routing**:
>
> • ImplementprotectedroutesusingReactRoutertorestrictaccessbasedonuser
> role (Admin or HR).
>
> • Use conditional rendering to display relevant features for each
> role.
>
> • Integrate React Toastify for real-time notifications (e.g., CSV
> upload success, errors).

**7.** **Functionality** **(Backend)**

> 1\. The backend shall use **FastAPI** with **Uvicorn** for handling
> asynchronous API re-quests.
>
> 2\. The system shall parse CSV files using **Pandas** or Python’s
> **csv** module, extracting job fields.
>
> 3\.
> JoballocationlogicshallautomaticallydistributejobstoHRs(e.g.,evenlydistribute
> 20 jobs across 10 HRs) with manual override options.
>
> 4\. The system shall support **JWT-based** **authentication** using
> **PyJWT** and **Passlib** for password hashing.
>
> 5\. The backend shall generate reports (e.g., job allocation stats, HR
> performance) in PDF/Excel formats using **jsPDF** and **SheetJS**.
>
> 6\. **API** **Endpoints**:
>
> • **Auth** **&** **User**:
>
> **–** POST /auth/register: Register Admin or HR user. **–** POST
> /auth/login: Authenticate and return JWT.
>
> **–** GET /auth/me: Retrieve current user info (JWT-protected). •
> **Admin**:
>
> **–** POST /admin/upload-csv: Upload and parse CSV job data.
>
> **–** GET /admin/jobs: Retrieve all jobs with filters (status, source
> company). **–** PUT /admin/jobs/{id}/allocate: Allocate/reassign job
> to HR.
>
> **–** GET /admin/users: List all HRs.
>
> 4
>
> **–** GET /admin/dashboard: Retrieve dashboard stats. **–** GET
> /admin/candidates: View all candidates.
>
> • **HR**:
>
> **–** GET /hr/jobs: List jobs assigned to the HR.
>
> **–** PUT /hr/jobs/{id}/status: Update job status.
>
> **–** GET /hr/candidates/{job_id}: List candidates for a job.
>
> **–** PUT /hr/candidates/{id}/status: Update candidate status.
>
> **–** POST /hr/candidates/{id}/history: Add status change to history.
> **–** GET /hr/dashboard: Retrieve HR dashboard stats.
>
> • **Shared**:
>
> **–** GET /jobs/{id}: Retrieve job details.
>
> **–** GET /candidates/{id}: Retrieve candidate details. **–** POST
> /candidates: Add new candidate.
>
> **–** PUT /candidates/{id}: Update candidate info.
>
> **–** GET /application-history/{id}: Retrieve status history.

**8.** **Database**

> 1\.
> Thesystemshalluse**MongoDBAtlas**withcollectionsforusers,jobs,candidates,
> and application_history.
>
> 2\. **users** collection:
>
> • Fields: Name, Email, Role (admin/hr), Hashed Password, CreatedAt. 3.
> **jobs** collection:
>
> • Fields: Job Title, Description, Location, Salary/Package, Source
> Company, Up-loadedBy (Admin ID), AllocatedTo (HR ID), Status (Open,
> Allocated, Closed), CreatedAt.
>
> 4\. **candidates** collection:
>
> • Fields:
> Name,Email,Phone,Location,CurrentCTC,ExpectedCTC,JobID,GitHub/LinkedIn
> Links, Status (Selected, Rejected, In Progress), Notes, LastUpdatedBy
> (HR ID).
>
> 5\. **application_history** collection:
>
> • Fields: CandidateID,JobID,OldStatus, NewStatus,
> UpdatedBy(HRID),Times-tamp, Comment.

**9.** **Regulatory** **and** **Security**

> 1\. The system shall use **JWT** **tokens** stored in secure cookies
> for authentication.
>
> 2\. Sensitive data (e.g., candidate personal info, job details) shall
> be encrypted at rest and in transit using industry-standard protocols.
>
> 5
>
> 3\. The system shall maintain audit logs for all user actions (e.g.,
> CSV uploads, job al-locations, status updates).

**10.** **Performance** **and** **Scalability**

> 1\. The system shall achieve 99.9% uptime, monitored via cloud-based
> tools (e.g., AWS CloudWatch).
>
> 2\. The system shall support horizontal scaling using MongoDB sharding
> and FastAPI load balancing.

**11.** **Interactivity**

> 1\. The CSV upload interface shall provide real-time feedback on file
> validation and data extraction using React Toastify.
>
> 2\. The Admin dashboard shall allow filtering and sorting of jobs and
> HRs with one-click interactions.
>
> 3\. The HR portal shall support real-time candidate status updates
> with timestamped history logs.

**12.** **Customization**

> 1\.
> Theportalshallsupportcustomizabledashboardthemes(e.g.,colors,logos)toalign
> with Coastal Seven Technologies’ branding.
>
> 2\. Admins shall be able to configure job allocation rules (e.g.,
> priority-based or equal distribution).
>
> 6
