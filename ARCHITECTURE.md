# Recruitment Pipeline Automation System - Architecture

## System Overview
The system is designed to automate the recruitment process from application intake to hiring. It uses a microservices-like architecture with a central backend, a frontend dashboard, and an n8n automation engine.

## Components

### 1. Frontend (React + Vite)
- **Dashboard**: Kanban board for visualising candidate stages.
- **Candidate View**: Detailed view of candidate profile and activity logs.
- **Tech Stack**: React, TypeScript, Lucide Icons, Glassmorphism UI.

### 2. Backend (Node.js + Express + Prisma)
- **API**: RESTful API for managing candidates, stages, and schedules.
- **Database**: PostgreSQL with Prisma ORM.
- **State Machine**: Logic to handle valid stage transitions.

### 3. Automation (n8n)
- **Workflows**: Defined in `n8n/recruitment_workflow.json`.
- **Integrations**: 
    - **Webhook**: Entry point for new applications.
    - **Airtable/DB**: Storage for raw data.
    - **OpenAI**: CV Parsing and Candidate Scoring.
    - **Gmail/Slack**: Notifications.
    - **Google Calendar**: Interview scheduling.

## Data Flow
1. **Intake**: Candidate submits CV -> Webhook -> n8n.
2. **Processing**: n8n parses CV (OpenAI) -> Stores in PostgreSQL/Airtable.
3. **Screening**: AI scores candidate -> Auto-reject or Move to Screening.
4. **Human Review**: Recruiter views candidate on Dashboard -> Moves to Interview.
5. **Interview**: n8n sends invite -> Syncs with Google Calendar.
6. **Offer/Hire**: Final stages managed in Dashboard.

## Infrastructure
- **Docker**: Hosts PostgreSQL database.
- **Prisma**: Database schema management.
- **Environment**: Configured via `.env` files.
