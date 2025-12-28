import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import candidateRoutes from './routes/candidates';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/candidates', candidateRoutes);

app.get('/api/stages', async (req, res) => {
    try {
        const stages = await prisma.pipelineStage.findMany({
            orderBy: { stageOrder: 'asc' }
        });
        res.json(stages);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/api/config', async (req: Request, res: Response) => {
    try {
        const configs = await prisma.pipelineConfig.findMany();
        const configMap = configs.reduce((acc: Record<string, any>, curr: { configKey: string; configValue: any }) => {
            acc[curr.configKey] = curr.configValue;
            return acc;
        }, {} as Record<string, any>);
        res.json(configMap);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Seed Stages
async function initPipeline() {
  try {
      const count = await prisma.pipelineStage.count();
      if (count === 0) {
        console.log('Initializing default pipeline stages...');
        await prisma.pipelineStage.createMany({
          data: [
            { stageName: 'Applied', stageOrder: 1, autoAdvance: false },
            { stageName: 'Screening', stageOrder: 2, autoAdvance: true, advanceDelayHours: 24, notificationTemplate: 'screening_email' },
            { stageName: 'Interview', stageOrder: 3, autoAdvance: false },
            { stageName: 'Offer', stageOrder: 4, autoAdvance: false },
            { stageName: 'Hired', stageOrder: 5, autoAdvance: false },
            { stageName: 'Rejected', stageOrder: 6, autoAdvance: false },
          ]
        });
      }
  } catch (e) {
      console.warn("Could not init pipeline (db might be unreachable):", e);
  }
}

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await initPipeline();
});
