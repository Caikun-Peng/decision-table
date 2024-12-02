var mixtureTable = (function () {
    const initTable = document.getElementById("mixtureDecisionTable");

    function transposeTable(table) {
        const rows = Array.from(table.rows);
        const newTable = document.createElement("table");
        newTable.id = "mixtureDecisionTable"; // Ensure the ID is retained after transposition
        const maxCols = Math.max(...rows.map(row => row.cells.length));

        for (let colIndex = 0; colIndex < maxCols; colIndex++) {
            const newRow = newTable.insertRow();
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const cell = rows[rowIndex].cells[colIndex];
                const newCell = newRow.insertCell();
                if (cell) {
                    newCell.innerHTML = cell.innerHTML;
                }
            }
        }
        return newTable;
    }

    function resetTable() {
        const currentTable = document.getElementById("mixtureDecisionTable");
        if (currentTable && initTable) {
            const parent = currentTable.parentNode;
            parent.replaceChild(initTable.cloneNode(true), currentTable);
        }
    }

    function resetAndTransposeTable() {
        const currentTable = document.getElementById("mixtureDecisionTable");
        if (currentTable && initTable) {
            const parent = currentTable.parentNode;
            const transposedTable = transposeTable(initTable.cloneNode(true));
            parent.replaceChild(transposedTable, currentTable);
        }
    }

    let canvasType = 'multiStates';

    function multiStates() {
        canvasType = 'multiStates';
        const An = document.querySelectorAll('.An');
        const Sn = document.querySelectorAll('.Sn');
        const mS = document.querySelectorAll('.multiStates');
        const mA = document.querySelectorAll('.multiActions');
        An[1].classList.add('hide');
        Sn[1].classList.remove('hide');
        mS.forEach(btn => btn.classList.remove('hide'));
        mA.forEach(btn => btn.classList.add('hide'));
        resetTable();
        showCanvas();
    }

    function multiActions() {
        canvasType = 'multiActions';
        const An = document.querySelectorAll('.An');
        const Sn = document.querySelectorAll('.Sn');
        const mS = document.querySelectorAll('.multiStates');
        const mA = document.querySelectorAll('.multiActions');
        An[1].classList.remove('hide');
        Sn[1].classList.add('hide');
        mS.forEach(btn => btn.classList.add('hide'));
        mA.forEach(btn => btn.classList.remove('hide'));
        resetAndTransposeTable();
        showCanvas();
    }

    // Add a new row (decision) to the decision table
    function addRow(rowClass) {
        let table = document.getElementById("mixtureDecisionTable");
        let newRow = document.createElement("tr");
        let cell = document.createElement("td");
        let value = rowClass + `${table.rows.length}`;
        let input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.oninput = function () { mixtureTable.showCanvas(); }; // Redraw canvas when input changes
        cell.appendChild(input);
        newRow.appendChild(cell);

        // Add cells with inputs for the rest of the columns
        for (let i = 1; i < table.rows[0].cells.length; i++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.oninput = function () { mixtureTable.showCanvas(); }; // Redraw canvas when input changes
            cell.appendChild(input);
            newRow.appendChild(cell);
        }

        table.appendChild(newRow); // Append the new row to the table
    }

    // Remove the last row from the decision table
    function removeRow() {
        let table = document.getElementById("mixtureDecisionTable");
        if (table.rows.length > 2) { // Ensure at least one data row remains
            table.deleteRow(-1);
        }
    }

    // Initialize event listeners to setup interactions
    function initEventListeners() {
        document.addEventListener("DOMContentLoaded", function () {
            const slider = document.getElementById("slider");
            const positionInput = document.getElementById("pro");

            // Listen for changes to the slider and update the input value accordingly
            slider.addEventListener("input", function () {
                const sliderValue = parseFloat(slider.value);
                positionInput.value = sliderValue;
                drawPro();
            });

            // Listen for changes to the input and update the slider value
            positionInput.addEventListener("input", function () {
                let inputValue = parseFloat(positionInput.value);

                // Ensure the input value is within bounds (0 to 1)
                if (inputValue < 0) {
                    inputValue = 0;
                } else if (inputValue > 1) {
                    inputValue = 1;
                }

                slider.value = inputValue;
                drawPro();
            });
        });

    }

    function drawPro() {
        // Draw probability lines based on slider value
        const canvas = document.getElementById('mixtureProbability');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
        ctx.lineWidth = 1;
        if (canvasType === 'multiStates') {
            let pro = document.getElementById('pro');
            ctx.setLineDash([10, 10]); // Dashed line for probability
            ctx.lineDashOffset = 10;
            ctx.beginPath();
            ctx.moveTo(pro.value * 300 + 50, 0);
            ctx.lineTo(pro.value * 300 + 50, 350);
            ctx.strokeStyle = '#555';
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
        } else {

        }
    }

    let init = 1;
    let resultInit = 1;
    // Function to draw the canvas with the current table data
    function showCanvas() {
        // console.info('showCanvas');

        const canvas = document.getElementById('mixtureCanvas');
        const ctx = canvas.getContext('2d');
        // initCanvas();
        function initCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
            if (init === 1) {
                ctx.translate(0, canvas.height); // Translate context to make drawing easier
                ctx.scale(1, -1); // Flip the y-axis to standard Cartesian
                ctx.lineWidth = 1;
                ctx.font = '14px Arial';
                init = 0;
            }
        }

        let table = document.getElementById('mixtureDecisionTable');
        let xValues = [];
        let yValues = [];
        let pointName = [];
        const rows = table.rows;
        let xMin;
        let xMax;
        let yMin;
        let yMax;
        let MIN;
        let MAX;
        let lineScale;

        initParas();
        genScale();
        function initParas() {
            xValues = [];
            yValues = [];
            pointName = [];
            for (let i = 1; i < rows.length; i++) { // Skip the header row
                const xValue = parseFloat(rows[i].cells[1].querySelector('input').value);
                const yValue = parseFloat(rows[i].cells[2].querySelector('input').value);
                if (!isNaN(xValue) && !isNaN(yValue)) { // Only add valid numbers
                    xValues.push(xValue);
                    yValues.push(yValue);
                    pointName.push(rows[i].cells[0].querySelector('input').value);
                }
            }
        }
        function genScale() {
            xMin = Math.min(...xValues);
            xMax = Math.max(...xValues);
            yMin = Math.min(...yValues);
            yMax = Math.max(...yValues);
            MIN = Math.min(xMin, yMin);
            MAX = Math.max(xMax, yMax);
            // Scale the line length to fit within the canvas dimensions
            lineScale = (MAX - MIN) === 0 ? 0 : 300 / (MAX - MIN);
        }


        if (canvasType === 'multiStates') {
            console.info('multiStates');
            initCanvas();
            multiStatesMix();
        } else if (canvasType === 'multiActions') {
            console.info('multiActions');
            initCanvas();
            multiActionsMix();
        }

        function multiStatesMix() {
            initEventListeners();
            // Draw vertical grid lines and labels
            drawGrid();
            function drawGrid() {
                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                for (let i = 1; i <= 5; i += 1) {
                    ctx.moveTo(i * 75 - 25, 50);
                    ctx.lineTo(i * 75 - 25, 400);
                    ctx.scale(1, -1);
                    let x = i * 75 - 25 - 10;
                    if (i === 1 || i === 5) {
                        x = x + 5;
                    }
                    ctx.fillText((i - 1) / 4, x, -35); // Label the grid lines
                    ctx.scale(1, -1);
                }
                ctx.strokeStyle = '#555';
                ctx.stroke();
                ctx.setLineDash([]);
            }

            let lines = []; // Store lines for intersection calculations
            drawOrigin();

            function drawOrigin() {
                lines = [];
                for (let i = 0; i < xValues.length; i++) {
                    const xValue = (xValues[i] - MIN) * lineScale + 60;
                    const yValue = (yValues[i] - MIN) * lineScale + 60;

                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(50, xValue);
                    ctx.lineTo(350, xValue);
                    ctx.moveTo(50, yValue);
                    ctx.lineTo(350, yValue);
                    ctx.scale(1, -1);
                    ctx.fillText(xValues[i], 35, -xValue + 5);
                    ctx.fillText(yValues[i], 35, -yValue + 5);
                    ctx.scale(1, -1);
                    ctx.stroke();

                    // Draw points representing the values from the table
                    ctx.beginPath();
                    ctx.arc(350, xValue, 5, 0, 2 * Math.PI);
                    ctx.arc(50, yValue, 5, 0, 2 * Math.PI);
                    ctx.scale(1, -1);
                    ctx.fillText(pointName[i], 355, -xValue - 5); // Label the points
                    ctx.scale(1, -1);
                    ctx.fill();

                    // Draw connecting lines between x and y points
                    ctx.setLineDash([10, 5]);
                    ctx.beginPath();
                    ctx.moveTo(350, xValue);
                    ctx.lineTo(50, yValue);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    lines.push([{ x: 50, y: yValue }, { x: 350, y: xValue }]); // Store the line segments
                }

                let intersectionPoints = []; // Store intersection points
                let height = []; // Store heights of intersection points
                const allIntersections = findAllIntersections(lines); // Calculate all intersections
                if (allIntersections.length > 0) {
                    allIntersections.forEach((intersectionInfo, index) => {
                        const { intersection, segmentPair } = intersectionInfo;
                        if (intersection.x !== 50 && intersection.x !== 350) {
                            ctx.beginPath();
                            ctx.arc(intersection.x, intersection.y, 4, 0, 2 * Math.PI); // Draw intersection point
                            ctx.scale(1, -1);
                            ctx.fillText(`${((intersection.x - 50) / 300).toFixed(3)}`, intersection.x + 5, -intersection.y - 5); // Label the intersection
                            ctx.scale(1, -1);
                            ctx.fill();
                            intersectionPoints.push(intersection);
                            height.push(intersection.y); // Record height for later use
                        }
                    });
                    intersectionPoints.sort((a, b) => a.x - b.x);
                }
            }

            const M = document.getElementById("M");
            M.addEventListener("click", function () {
                const xs = [...xValues];
                const ys = [...yValues];
                xValues=[];
                yValues=[];
                pointName=[];
                xValues.push(Math.min(...xs));
                yValues.push(Math.max(...xs));
                xValues.push(Math.max(...ys));
                yValues.push(Math.min(...ys));
                pointName.push("M1");
                pointName.push("M2");
                genScale();
                initCanvas();
                multiStatesMix()
            });
            // return { intersectionPoints, height }; // Return calculated data
            showResult();
            function showResult() {
                const result = document.getElementById("result");
                const rlt = result.getContext("2d");
                if (resultInit === 1) {
                    console.info('Init result canvas')
                    rlt.clearRect(0, 0, result.width, result.height);
                    rlt.lineWidth = 1;
                    rlt.translate(0, result.height); // Translate context to make drawing easier
                    rlt.scale(1, -1);
                    resultInit = 0;
                }

                const maxiMin = document.getElementById("maxiMin");
                let maxiMinClicked = false;
                maxiMin.addEventListener("click", function () {
                    maxiMinClicked = true;
                    rlt.clearRect(0, 0, result.width, result.height);
                    MaxiMin(); // Highlight MaxiMin point
                });
                maxiMin.addEventListener("mouseover", function () {
                    if (!maxiMinClicked) {
                        rlt.translate(0, result.height); // Translate context to make drawing easier
                        rlt.scale(1, -1);
                        MaxiMin(); // Temporarily highlight the MaxiMin point on hover
                    }
                });
                maxiMin.addEventListener("mouseout", function () {
                    if (!maxiMinClicked) {
                        rlt.clearRect(0, 0, result.width, result.height);
                    }
                });

                function MaxiMin() {
                    MaxAndMinEnvelope('MaxiMin');
                }

                const miniMax = document.getElementById("miniMax");
                let miniMaxClicked = false;
                miniMax.addEventListener("click", function () {
                    miniMaxClicked = true;
                    rlt.clearRect(0, 0, result.width, result.height);
                    MiniMax(); // Highlight MiniMax point
                });
                miniMax.addEventListener("mouseover", function () {
                    if (!miniMaxClicked) {
                        MiniMax(); // Temporarily highlight the MiniMax point on hover
                    }
                });
                miniMax.addEventListener("mouseout", function () {
                    if (!miniMaxClicked) {
                        rlt.clearRect(0, 0, result.width, result.height);
                    }
                });

                function MiniMax() {
                    MaxAndMinEnvelope('MiniMax')
                }

                function MaxAndMinEnvelope(envelopeType) {
                    // Step 1: Collect all x-values where lines start, end, or where lines have equal y-values
                    let events = [];

                    // Assign IDs and compute line equations (slope and intercept)
                    let lineEquations = [];
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        line.id = i; // Assign an ID to each line for reference

                        const x1 = line[0].x;
                        const y1 = line[0].y;
                        const x2 = line[1].x;
                        const y2 = line[1].y;

                        const m = (y2 - y1) / (x2 - x1);
                        const b = y1 - m * x1;

                        lineEquations.push({ m: m, b: b });
                    }

                    // Collect all x-values where the lines have equal y-values (top line can change)
                    for (let i = 0; i < lines.length; i++) {
                        for (let j = i + 1; j < lines.length; j++) {
                            const line1 = lineEquations[i];
                            const line2 = lineEquations[j];

                            if (line1.m === line2.m) {
                                // Lines are parallel, no intersection in terms of y-value
                                continue;
                            }

                            const xEqual = (line2.b - line1.b) / (line1.m - line2.m);

                            if (xEqual > 50 && xEqual < 350) {
                                events.push({
                                    x: xEqual,
                                    type: 'crossover',
                                    linesInvolved: [i, j],
                                });
                            }
                        }
                    }

                    // Add x=50 (start) and x=350 (end)
                    events.push({ x: 50, type: 'start' });
                    events.push({ x: 350, type: 'end' });

                    // Sort events by x-coordinate
                    events.sort((a, b) => a.x - b.x);

                    if (envelopeType === 'MaxiMin') {
                        // Step 2: Initialize the current top line
                        let currentTopLineIndex = null;
                        let maxYAtStart = -Infinity;

                        // Find the line with the maximum y-value at x=50
                        for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            const yAtStart = getYAtX(line, 50);
                            if (yAtStart > maxYAtStart) {
                                maxYAtStart = yAtStart;
                                currentTopLineIndex = i;
                            }
                        }

                        // Step 3: Build the upper envelope
                        let upperEnvelope = []; // Array to store envelope segments
                        let prevX = 50;

                        for (let i = 1; i < events.length; i++) {
                            const event = events[i];
                            const x = event.x;

                            // Get the current top line
                            const line = lines[currentTopLineIndex];
                            const yPrev = getYAtX(line, prevX);
                            const yCurrent = getYAtX(line, x);

                            // Add the segment to the upper envelope
                            upperEnvelope.push([{ x: prevX, y: yPrev }, { x: x, y: yCurrent }]);

                            // Update the current top line if necessary
                            if (event.type === 'crossover') {
                                const [line1Index, line2Index] = event.linesInvolved;
                                if (line1Index === currentTopLineIndex || line2Index === currentTopLineIndex) {
                                    // Determine which line is on top after the crossover
                                    const otherLineIndex = line1Index === currentTopLineIndex ? line2Index : line1Index;
                                    // Slightly increment x to determine which line is on top after the crossover
                                    const delta = 0.0001;
                                    const yCurrentTop = getYAtX(lines[currentTopLineIndex], x + delta);
                                    const yOther = getYAtX(lines[otherLineIndex], x + delta);
                                    if (yOther > yCurrentTop) {
                                        currentTopLineIndex = otherLineIndex;
                                    }
                                }
                            }

                            prevX = x;
                        }
                        // Step 4: Draw the upper envelope
                        rlt.beginPath();
                        rlt.strokeStyle = 'red'; // Choose your preferred color
                        rlt.lineWidth = 2;
                        for (let i = 0; i < upperEnvelope.length; i++) {
                            const segment = upperEnvelope[i];
                            // console.info(segment);
                            const [p1, p2] = segment;
                            if (i === 0) {
                                rlt.moveTo(p1.x, p1.y);
                            } else {
                                rlt.lineTo(p1.x, p1.y);
                            }
                            rlt.lineTo(p2.x, p2.y);
                        }

                        rlt.stroke();
                    } else if (envelopeType === 'MiniMax') {
                        // Step 2: Initialize the current bottom line
                        let currentBottomLineIndex = null;
                        let minYAtStart = Infinity;

                        // Find the line with the minimum y-value at x=50
                        for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            const yAtStart = getYAtX(line, 50);
                            if (yAtStart < minYAtStart) {
                                minYAtStart = yAtStart;
                                currentBottomLineIndex = i;
                            }
                        }

                        // Step 3: Build the lower envelope
                        let lowerEnvelope = []; // Array to store envelope segments
                        let prevX = 50;

                        for (let i = 1; i < events.length; i++) {
                            const event = events[i];
                            const x = event.x;

                            // Get the current bottom line
                            const line = lines[currentBottomLineIndex];
                            const yPrev = getYAtX(line, prevX);
                            const yCurrent = getYAtX(line, x);

                            // Add the segment to the lower envelope
                            lowerEnvelope.push([{ x: prevX, y: yPrev }, { x: x, y: yCurrent }]);

                            // Update the current bottom line if necessary
                            if (event.type === 'crossover') {
                                const [line1Index, line2Index] = event.linesInvolved;
                                if (line1Index === currentBottomLineIndex || line2Index === currentBottomLineIndex) {
                                    // Determine which line is on the bottom after the crossover
                                    const otherLineIndex = line1Index === currentBottomLineIndex ? line2Index : line1Index;
                                    // Slightly increment x to determine which line is on the bottom after the crossover
                                    const delta = 0.0001;
                                    const yCurrentBottom = getYAtX(lines[currentBottomLineIndex], x + delta);
                                    const yOther = getYAtX(lines[otherLineIndex], x + delta);
                                    if (yOther < yCurrentBottom) {
                                        currentBottomLineIndex = otherLineIndex;
                                    }
                                }
                            }

                            prevX = x;
                        }
                        // Step 4: Draw the lower envelope
                        rlt.beginPath();
                        rlt.strokeStyle = 'blue'; // Choose your preferred color for the minimum envelope
                        rlt.lineWidth = 2;

                        for (let i = 0; i < lowerEnvelope.length; i++) {
                            const segment = lowerEnvelope[i];
                            const [p1, p2] = segment;
                            if (i === 0) {
                                rlt.moveTo(p1.x, p1.y);
                            } else {
                                rlt.lineTo(p1.x, p1.y);
                            }
                            rlt.lineTo(p2.x, p2.y);
                        }

                        rlt.stroke();
                    }
                }

                // Helper function to get y-coordinate at a given x on a line
                function getYAtX(line, x) {
                    const x1 = line[0].x;
                    const y1 = line[0].y;
                    const x2 = line[1].x;
                    const y2 = line[1].y;
                    const m = (y2 - y1) / (x2 - x1);
                    return m * (x - x1) + y1;
                }

                const redraw = document.getElementById("redraw");
                redraw.addEventListener("click", function () {
                    rlt.clearRect(0, 0, result.width, result.height);
                    maxiMinClicked = false;
                    miniMaxClicked = false;
                }); // Redraw button to clear and redraw the canvas
            }
        }

        function multiActionsMix() {
            function drawOrigin() {
                let points = []; // Store points to draw a polygon
                initEventListeners();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(350, 50);
                ctx.lineTo(50, 50);
                ctx.lineTo(50, 350);
                ctx.stroke();

                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                ctx.moveTo(50, 50);
                ctx.lineTo(350, 350);
                ctx.stroke();
                ctx.setLineDash([]);
                for (let i = 0; i < xValues.length; i++) {
                    // console.log(i);
                    const xValue = (xValues[i] - MIN) * lineScale + 50;
                    const yValue = (yValues[i] - MIN) * lineScale + 50;
                    points.push({ x: xValue, y: yValue }); // Add points to array for polygon
                    ctx.beginPath();
                    ctx.arc(xValue, yValue, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.setLineDash([5, 5]);
                    ctx.moveTo(xValue, 50);
                    ctx.lineTo(xValue, yValue);
                    ctx.moveTo(50, yValue);
                    ctx.lineTo(xValue, yValue);
                    ctx.scale(1, -1);
                    ctx.fillText(pointName[i], xValue + 5, -yValue - 5); // Label the points
                    ctx.fillText(xValues[i], xValue - 5, -35);
                    ctx.fillText(yValues[i], 35, -yValue + 5);
                    ctx.scale(1, -1);
                    ctx.fill();
                    ctx.stroke();
                }

                const polygonPoints = convexHull(points);

                // 绘制多边形
                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
                for (let i = 1; i < polygonPoints.length; i++) {
                    ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
                }
                ctx.closePath();
                ctx.fillStyle = 'rgba(0, 150, 150, 0.5)';
                ctx.strokeStyle = 'rgba(0, 150, 150, 1)'
                ctx.fill();
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.strokeStyle = 'black';

            }

            function convexHull(points) {
                // 使用 Graham 扫描算法计算凸包
                function orientation(p, q, r) {
                    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                    if (val === 0) return 0;  // 共线
                    return val > 0 ? 1 : 2;  // 顺时针或逆时针
                }

                // 找到最下方的点(如果有多个，选择最左边的)
                let bottomPoint = points[0];
                for (let point of points) {
                    if (point.y > bottomPoint.y ||
                        (point.y === bottomPoint.y && point.x < bottomPoint.x)) {
                        bottomPoint = point;
                    }
                }

                // 按极角排序
                points.sort((a, b) => {
                    const orient = orientation(bottomPoint, a, b);
                    if (orient === 0) {
                        // 如果共线，选择距离更远的点
                        return (bottomPoint.x - a.x) * (bottomPoint.x - a.x) +
                            (bottomPoint.y - a.y) * (bottomPoint.y - a.y) -
                            ((bottomPoint.x - b.x) * (bottomPoint.x - b.x) +
                                (bottomPoint.y - b.y) * (bottomPoint.y - b.y));
                    }
                    return orient === 2 ? -1 : 1;
                });

                // Graham 扫描算法
                const hull = [points[0], points[1]];
                for (let i = 2; i < points.length; i++) {
                    while (hull.length > 1) {
                        const top = hull[hull.length - 1];
                        const nextToTop = hull[hull.length - 2];
                        if (orientation(nextToTop, top, points[i]) !== 2) {
                            hull.pop();
                        } else {
                            break;
                        }
                    }
                    hull.push(points[i]);
                }

                return hull;
            }

            drawOrigin();

            const miniMax = document.getElementById("regret");
            miniMax.addEventListener("click", function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
                showResult();
                drawOrigin();
            });

            function showResult() {
                miniMaxRegret();
                function miniMaxRegret() {
                    let maPoint = [];
                    regretS1 = xValues.map(xValue => xMax - xValue);
                    regretS2 = yValues.map(yValue => yMax - yValue);
                    MIN = Math.min(Math.min(...regretS1), Math.min(...regretS2), MIN);
                    MAX = Math.max(Math.max(...regretS1), Math.max(...regretS2), MAX);
                    lineScale = (MAX - MIN) === 0 ? 0 : 300 / (MAX - MIN);

                    for (let i = 0; i < xValues.length; i++) {
                        ctx.beginPath();
                        let xValue = (regretS1[i] - MIN) * lineScale + 50;
                        let yValue = (regretS2[i] - MIN) * lineScale + 50;
                        maPoint.push({ x: xValue, y: yValue });
                        ctx.arc(xValue, yValue, 2, 0, 2 * Math.PI);
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(xValue, 50);
                        ctx.lineTo(xValue, yValue);
                        ctx.moveTo(50, yValue);
                        ctx.lineTo(xValue, yValue);
                        ctx.scale(1, -1);
                        ctx.fillText(pointName[i] + "'", xValue + 5, -yValue - 5); // Label the points
                        ctx.fillText(regretS1[i], xValue - 5, -35);
                        ctx.fillText(regretS2[i], 35, -yValue + 5);
                        ctx.scale(1, -1);
                        ctx.fillStyle = 'blue';
                        ctx.fill();
                    }
                    const maPolygonPoints = convexHull(maPoint);

                    // 绘制多边形
                    ctx.setLineDash([10, 10]);
                    ctx.beginPath();
                    ctx.moveTo(maPolygonPoints[0].x, maPolygonPoints[0].y);
                    for (let i = 1; i < maPolygonPoints.length; i++) {
                        ctx.lineTo(maPolygonPoints[i].x, maPolygonPoints[i].y);
                    }
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(0, 100, 150, 0.5)';
                    ctx.strokeStyle = 'rgba(0, 100, 150, 1)'
                    ctx.fill();
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.strokeStyle = 'black';
                }
            }
            const redraw = document.getElementById("redraw");
            redraw.addEventListener("click", function () {
                showCanvas()
            }); // Redraw button to clear and redraw the canvas

        }
    }

    // Expose some methods to the outside for interaction
    return {
        multiStates: multiStates,
        multiActions: multiActions,
        drawPro: drawPro,
        initEventListeners: initEventListeners,
        addRow: addRow,
        removeRow: removeRow,
        showCanvas: showCanvas
    };

    // Function to get the intersection point of two line segments
    function getIntersectionPoint(p1, p2, p3, p4) {
        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;
        const { x: x3, y: y3 } = p3;
        const { x: x4, y: y4 } = p4;

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        // If the denominator is zero, the lines are parallel and do not intersect
        if (denominator === 0) {
            return null;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        // Check if intersection is within both line segments
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            const intersectionX = x1 + t * (x2 - x1);
            const intersectionY = y1 + t * (y2 - y1);
            return { x: intersectionX, y: intersectionY }; // Return the intersection point
        } else {
            return null; // No valid intersection within the line segments
        }
    }

    // Function to find all intersections among a set of line segments
    function findAllIntersections(segments) {
        const intersections = [];

        // Compare every pair of line segments
        for (let i = 0; i < segments.length; i++) {
            for (let j = i + 1; j < segments.length; j++) {
                const [p1, p2] = segments[i];
                const [p3, p4] = segments[j];
                const intersection = getIntersectionPoint(p1, p2, p3, p4);
                if (intersection) {
                    intersections.push({
                        intersection,
                        segmentPair: [i, j],
                    }); // Store the intersection and the involved segments
                }
            }
        }

        return intersections; // Return all found intersections
    }

    function isPointOnSegment(point, segments) {
        const { x: px, y: py } = point;
        const { x: x1, y: y1 } = segments[0];
        const { x: x2, y: y2 } = segments[1];

        // Check if point lies on the line defined by segmentStart and segmentEnd
        const crossProduct = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1);
        if (Math.abs(crossProduct) > 1e-10) {
            return false; // Point is not on the line
        }

        // Check if the point is within the bounds of the segment
        const dotProduct = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1);
        if (dotProduct < 0) {
            return false; // Point is behind segmentStart
        }

        const squaredLengthBA = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (dotProduct > squaredLengthBA) {
            return false; // Point is beyond segmentEnd
        }

        return true; // Point is on the segment
    }

})();

// Initialize event listeners when document is loaded
mixtureTable.initEventListeners();
mixtureTable.multiStates();
// mixtureTable.showCanvas();
// mixtureTable.drawPro();
