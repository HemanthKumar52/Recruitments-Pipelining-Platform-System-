# Recruitment Pipeline Automation System

Automate candidate evaluation from CV submission to interview booking. A comprehensive, production-ready solution for HR teams.

## Features
- **Application Intake**: Webhook integration for CVs.
- **AI Screening**: Automatic CV parsing and scoring using OpenAI.
- **Pipeline Management**: Visual Kanban board to track candidates through stages (Applied -> Screening -> Interview -> Offer).
- **Interview Scheduling**: Google Calendar integration for automated booking.
- **Notifications**: Slack and Email alerts for stage changes.
- **Analytics**: Resume parsing and scoring metadata storage.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- n8n (Self-hosted or Cloud)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/HemanthKumar52/Recruitments-Pipelining-Platform-System-.git
   cd Recruitments-Pipelining-Platform-System
   ```

2. **Setup Database**
   ```bash
   docker-compose up -d
   ```
   This will start a PostgreSQL instance on port 5432.

3. **Setup Backend**
   Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   # Configure .env (Copy .env.example or fill the created .env)
   npx prisma migrate dev --name init
   npm run build
   npm start
   ```

4. **Setup Frontend**
   Navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Access the dashboard at `http://localhost:5173`.

5. **Configure n8n**
   - Import the workflow file located at `n8n/recruitment_workflow.json` into your n8n instance.
   - Configure the necessary credentials (OpenAI, Google Calendar, Slack, Postgres) in n8n.

## Architecture
See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the system components and data flow.
See [DIAGRAMS.md](DIAGRAMS.md) for visual representations of the system, workflow, and database structure.
