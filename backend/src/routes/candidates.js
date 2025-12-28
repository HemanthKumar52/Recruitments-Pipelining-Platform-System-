"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { activityLogs: true, interviewSchedules: true }
        });
        res.json(candidates);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Get single candidate
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await prisma.candidate.findUnique({
            where: { id: Number(id) },
            include: { activityLogs: true, interviewSchedules: true, reminders: true }
        });
        if (!candidate)
            return res.sendStatus(404);
        res.json(candidate);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Create candidate
router.post('/', async (req, res) => {
    try {
        const { email, name, phone, position_applied, source, linkedin_url, resume_url } = req.body;
        const candidate = await prisma.candidate.create({
            data: {
                email, name, phone,
                positionApplied: position_applied,
                source,
                linkedinUrl: linkedin_url,
                resumeUrl: resume_url,
                currentStage: 'Applied'
            }
        });
        await prisma.activityLog.create({
            data: {
                candidateId: candidate.id,
                action: 'Candidate Created',
                newStage: 'Applied',
                performedBy: 'System'
            }
        });
        res.json(candidate);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Update stage
router.patch('/:id/stage', async (req, res) => {
    try {
        const { id } = req.params;
        const { stage } = req.body;
        const candidate = await prisma.candidate.findUnique({ where: { id: Number(id) } });
        if (!candidate)
            return res.status(404).json({ error: 'Candidate not found' });
        await prisma.candidate.update({
            where: { id: Number(id) },
            data: { currentStage: stage }
        });
        await prisma.activityLog.create({
            data: {
                candidateId: Number(id),
                action: 'Stage Changed',
                previousStage: candidate.currentStage,
                newStage: stage,
                performedBy: 'User'
            }
        });
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
//# sourceMappingURL=candidates.js.map