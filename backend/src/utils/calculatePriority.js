const SEVERITY_SCORE = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
};

const SEVERITY_WEIGHT = 3;

function waitingDays(createdAt) {
    const diff = Date.now() - new Date(createdAt);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculatePriority(bug) {
    const severityScore = SEVERITY_SCORE[bug.severity] ?? 0;
    return severityScore * SEVERITY_WEIGHT + waitingDays(bug.createdAt);
}
