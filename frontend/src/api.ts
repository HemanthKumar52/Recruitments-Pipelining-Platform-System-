import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Candidate {
    id: number;
    name: string;
    email: string;
    positionApplied: string;
    currentStage: string;
    source: string;
    updatedAt: string;
}

export interface Stage {
    id: number;
    stageName: string;
    stageOrder: number;
}

export const getCandidates = async (): Promise<Candidate[]> => {
    const res = await axios.get(`${API_URL}/candidates`);
    return res.data;
};

export const updateCandidateStage = async (id: number, stage: string) => {
    const res = await axios.patch(`${API_URL}/candidates/${id}/stage`, { stage });
    return res.data;
};

export const getStages = async (): Promise<Stage[]> => {
    // In case backend is not ready, return default stages
    try {
        const res = await axios.get(`${API_URL}/stages`);
        return res.data;
    } catch {
        return [
            { id: 1, stageName: 'Applied', stageOrder: 1 },
            { id: 2, stageName: 'Screening', stageOrder: 2 },
            { id: 3, stageName: 'Interview', stageOrder: 3 },
            { id: 4, stageName: 'Offer', stageOrder: 4 },
            { id: 5, stageName: 'Hired', stageOrder: 5 },
            { id: 6, stageName: 'Rejected', stageOrder: 6 },
        ];
    }
};
