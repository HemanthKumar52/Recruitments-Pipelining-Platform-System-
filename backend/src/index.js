"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const candidates_1 = __importDefault(require("./routes/candidates"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Routes
app.use('/api/candidates', candidates_1.default);
app.get('/api/stages', async (req, res) => {
    try {
        const stages = await exports.prisma.pipelineStage.findMany({
            orderBy: { stageOrder: 'asc' }
        });
        res.json(stages);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
app.get('/api/config', async (req, res) => {
    try {
        const configs = await exports.prisma.pipelineConfig.findMany();
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.configKey] = curr.configValue;
            return acc;
        }, {});
        res.json(configMap);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Seed Stages
async function initPipeline() {
    try {
        const count = await exports.prisma.pipelineStage.count();
        if (count === 0) {
            console.log('Initializing default pipeline stages...');
            await exports.prisma.pipelineStage.createMany({
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
    }
    catch (e) {
        console.warn("Could not init pipeline (db might be unreachable):", e);
    }
}
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await initPipeline();
});
//# sourceMappingURL=index.js.map