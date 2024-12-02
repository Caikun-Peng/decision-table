var twoPlayerTable = (function () {
    //Add a line after the second to last line
    function addRow(rowClass) {
        let table = document.getElementById("twoPlayerTable");
        let rowIndex = table.rows.length - 1; // Index of the penultimate row
        let newRow = table.insertRow(rowIndex); // Insert after the penultimate line
        let cell = newRow.insertCell(0);
        let value = rowClass + `${rowIndex}`;
        cell.innerHTML = `<input type="text" value="${value}">`;

        // Add <input> to other cells in the new row
        for (let i = 1; i < table.rows[0].cells.length - 1; i++) {
            let cell = newRow.insertCell(i);
            cell.innerHTML = `<input type="text"><input type="text">`;
        }

        // The last cell does not contain <input>
        let lastCell = newRow.insertCell(-1);
        lastCell.innerHTML = "";
        lastCell.classList.add('cMAX');
    }

    // Delete the second to last line
    function removeRow() {
        let table = document.getElementById("twoPlayerTable");
        if (table.rows.length > 3) { // Keep at least two rows (header row and one data row)
            table.deleteRow(table.rows.length - 2); // Delete the second to last line
        }
    }

    // Add a column after the penultimate column
    function addColumn(colClass) {
        let table = document.getElementById("twoPlayerTable");
        let colIndex = table.rows[0].cells.length - 1; // Index of the penultimate column

        // Add to the header after the penultimate column
        let header = table.rows[0];
        let newCell = header.insertCell(colIndex);
        let value = colClass + `${colIndex}`;
        newCell.innerHTML = `<input type="text" value="${value}">`;

        // Add corresponding new columns to other rows
        for (let i = 1; i < table.rows.length; i++) {
            let cell = table.rows[i].insertCell(colIndex);

            // If it is the last line, do not add <input>
            if (i === table.rows.length - 1) {
                cell.innerHTML = "";
                cell.classList.add('rMAX');
            } else {
                cell.innerHTML = `<input type="text"><input type="text">`;
            }
        }
    }

    // Delete the second to last column
    function removeColumn() {
        let table = document.getElementById("twoPlayerTable");
        if (table.rows[0].cells.length > 3) { // Keep at least two columns (the first column and one data column)
            let colIndex = table.rows[0].cells.length - 2; // Index of the penultimate column
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(colIndex); // Delete the second to last column of each row
            }
        }
    }

    // Show row MIN and col MAX
    function showMinMax() {
        console.log('showMinMax');
        let rowValues = [];
        let colValues = [];
        let table = document.getElementById("twoPlayerTable");
        let rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Get all decision rows
        // column player max
        for (let j = 0; j < rows.length; j++) {
            let cells = rows[j].getElementsByTagName('input');
            let values = Array.from(cells).map(cell => parseFloat(cell.value) || 0);
            values.shift();
            let valuesFilted = values.filter((_, index) => index % 2 !== 0);
            colValues.push(Math.max(...valuesFilted));
        }
        // console.info('col values: ', colValues);
        for (let i = 1; i < rows[0].getElementsByTagName('input').length; i++) {
            let values = [];
            for (let j = 0; j < rows.length; j++) {
                let cells = rows[j].getElementsByTagName('input');
                let value = Array.from(cells).map(cell => parseFloat(cell.value) || 0);
                values.push(value[i]);
            }
            values = values.filter(item => item !== undefined);
            rowValues.push(Math.max(...values));
        }
        rowValues = rowValues.filter((_, index) => index % 2 !== 1);
        // console.info('row values: ', rowValues);

        let rMAX = document.getElementsByClassName("rMAX");
        let cMAX = document.getElementsByClassName("cMAX");
        // console.info('rMAX: ', rMAX.length);
        // console.info('cMAX: ', cMAX.length);
        for (let i = 0; i < rMAX.length; i++) {
            // console.info('row value: ', rowValues[i]);
            rMAX[i].innerHTML = rowValues[i];
        }
        for (let i = 0; i < cMAX.length; i++) {
            cMAX[i].innerHTML = colValues[i];
        }

        let nash_equilibria = [];
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('input');
            for (let j = 1; j < cells.length; j += 2) {
                // console.info("cell:", cells[j].value, cells[j + 1].value, "rMAX", rowValues[(j - 1) / 2], "cMAX", colValues[i]);
                if (cells[j].value == rowValues[(j - 1) / 2] && cells[j + 1].value == colValues[i]) {
                    cells[j].style.backgroundColor = "yellow";
                    cells[j + 1].style.backgroundColor = "yellow";
                    nash_equilibria.push({
                        x: cells[j].value,
                        y: cells[j + 1].value
                    });
                } else {
                    cells[j].style.backgroundColor = "";
                    cells[j + 1].style.backgroundColor = "";
                }

            }
        }
        return nash_equilibria; 9
    }


    // Calculate decision criteria and display the selected decision names based on table names
    let init = 1;
    function showResult() {
        let nash_equilibria = showMinMax();
        console.info(nash_equilibria);

        let table = document.getElementById("twoPlayerTable");
        let rows = Array.from(table.getElementsByTagName("tr")); // Get all decision rows
        let rowName = [];
        let colName = [];
        let pointName = [];
        let xValues = [];
        let yValues = [];
        colName = Array.from(rows[0].getElementsByTagName('input')).map(element => element.value);
        rowName = Array.from(rows.slice(1)).map(row => {
            let rowName = [];
            // console.info(row.getElementsByTagName('input'));
            if (row.getElementsByTagName('input').length) {
                rowName.push(row.getElementsByTagName('input')[0].value);
            }
            return rowName;
        });
        // console.info('colName: ', colName);
        // console.info('rowName: ', rowName);
        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('input');
            for (let j = 1; j < cells.length / 2; j++) {
                const xValue = parseFloat(cells[2 * j - 1].value);
                const yValue = parseFloat(cells[2 * j].value);
                xValues.push(xValue);
                yValues.push(yValue);
                pointName.push(rowName[i - 1] + colName[j - 1]);
            }
        }
        console.info('points: ', pointName);
        console.info('xValues: ', xValues);
        console.info('yValues: ', yValues);

        let xMin;
        let xMax;
        let yMin;
        let yMax;
        let MIN;
        let MAX;
        let lineScale;
        genScale();

        function genScale() {
            xMin = Math.min(...xValues);
            xMax = Math.max(...xValues);
            yMin = Math.min(...yValues);
            yMax = Math.max(...yValues);
            MIN = Math.min(xMin, yMin);
            MAX = Math.max(xMax, yMax);
            lineScale = (MAX - MIN) === 0 ? 0 : 300 / (MAX - MIN);
        }

        const canvas = document.getElementById("twoPlayerResult");
        const ctx = canvas.getContext("2d");

        initCanvas();
        function initCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (init === 1) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
                init = 0;
            }
            drawAxis();
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(350, 350);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        function drawAxis() {
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(canvas.width, 50);
            ctx.lineTo(50, 50);
            ctx.lineTo(50, canvas.height);
            ctx.stroke();
        }

        drawOrigin();
        function drawOrigin() {
            let points = []; // Store points to draw a polygon
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

            for (let i = 0; i < points.length; i++) {
                let dominated = false;
                for (let j = 0; j < points.length; j++) {
                    if (i !== j) {
                        if (points[i].x <= points[j].x && points[i].y <= points[j].y) {
                            dominated = true;
                            break;
                        }
                    }
                }
                if (!dominated) {
                    ctx.beginPath();
                    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = "green";
                    ctx.fill();
                }
            }

            drawAxis();
        }
    }
    return {
        // initEventListeners: initEventListeners,
        addAn: () => addRow("A"),
        addBn: () => addColumn("B"),
        removeAn: removeRow,
        removeBn: removeColumn,
        calculate: showResult
    };
})();
