# System Diagrams

## 1. High-Level Architecture
```mermaid
graph TD
    User[Recruiter/HR] -->|Interacts via| FE[Frontend Dashboard (React)]
    Cand[Candidate] -->|Submits CV| Webhook[n8n Webhook]
    
    subgraph "Automation Engine (n8n)"
        Webhook --> CV_Parse[CV Parsing (OpenAI)]
        CV_Parse --> Score[AI Assessment]
        Score --> Filter{Qualified?}
        Filter -->|Yes| Email[Send Interview Invite]
        Filter -->|No| Reject[Send Rejection DB Update]
        Email --> Cal[Google Calendar]
        Cal --> Slack[Slack Notification]
    end

    subgraph "Backend Infrastructure"
        FE -->|REST API| API[Node.js Backend]
        API -->|CRUD| DB[(PostgreSQL Database)]
        n8n[n8n Workflows] -->|Update Status| DB
    end

    subgraph "External Services"
        OpenAI
        Google[Google Workspace]
        SlackService[Slack]
    end

    CV_Parse -.-> OpenAI
    Score -.-> OpenAI
    Email -.-> Google
    Cal -.-> Google
    Slack -.-> SlackService
```

## 2. Recruitment Pipeline Workflow
```mermaid
stateDiagram-v2
    [*] --> Applied
    Applied --> Screening: AI Score > Threshold
    Applied --> Rejected: AI Score < Threshold
    
    Screening --> Interview: Recruiter Approval
    Screening --> Rejected: Recruiter Rejection
    
    Interview --> Offer: Passed Interview
    Interview --> Rejected: Failed Interview
    
    Offer --> Hired: Offer Accepted
    Offer --> Rejected: Offer Declined
    
    Hired --> [*]
    Rejected --> [*]
```

## 3. Database Schema (ERD)
```mermaid
erDiagram
    Candidates ||--o{ InterviewSchedules : "has"
    Candidates ||--o{ ActivityLogs : "has"
    Candidates ||--o{ Reminders : "has"

    Candidates {
        int id PK
        string email
        string name
        string current_stage
        string resume_url
        string position_applied
        json metadata
    }

    PipelineStages {
        int id PK
        string stage_name
        int stage_order
        boolean auto_advance
    }

    InterviewSchedules {
        int id PK
        int candidate_id FK
        datetime scheduled_time
        string interviewer_email
        string meeting_link
        string status
    }

    ActivityLogs {
        int id PK
        int candidate_id FK
        string action
        string old_stage
        string new_stage
        datetime created_at
    }

    PipelineConfig {
        int id PK
        string config_key
        json config_value
    }
```
