function getIntersectionPoint(p1, p2, p3, p4) {
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const { x: x3, y: y3 } = p3;
    const { x: x4, y: y4 } = p4;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denominator === 0) {
        return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectionX = x1 + t * (x2 - x1);
        const intersectionY = y1 + t * (y2 - y1);
        return { x: intersectionX, y: intersectionY };
    } else {
        return null;
    }
}

function findAllIntersections(segments) {
    const intersections = [];

    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            const [p1, p2] = segments[i];
            const [p3, p4] = segments[j];
            const intersection = getIntersectionPoint(p1, p2, p3, p4);
            if (intersection) {
                intersections.push({
                    intersection,
                    segmentPair: [i, j],
                });
            }
        }
    }

    return intersections;
}

// 导出模块
export default {
    getIntersectionPoint,
    findAllIntersections,
};
