var basicTable = (function () {
    // Global variable
    var trans_flag = 0;

    // Initialize event listeners
    function initEventListeners() {
        document.querySelectorAll('input').forEach(function (inputElement) {
            inputElement.addEventListener('keydown', function (event) {
                if (event.key === "Enter") {
                    document.getElementById('calculate').click();
                }
            });
        });
    }

    // Add a new row (decision)
    function addRow(rowClass) {
        let table = document.getElementById("basicDecisionTable");
        let newRow = table.insertRow(-1);
        let cell = newRow.insertCell(0);
        let value = rowClass + `${table.rows.length - 1}`;
        cell.innerHTML = `<input type="text" value="${value}">`;

        for (let i = 1; i < table.rows[0].cells.length; i++) {
            let cell = newRow.insertCell(i);
            cell.innerHTML = `<input type="text">`;
        }
    }

    // Remove the last row
    function removeRow() {
        let table = document.getElementById("basicDecisionTable");
        if (table.rows.length > 2) {
            table.deleteRow(-1);
        }
    }

    // Add a new column (state)
    function addColumn(colClass) {
        let table = document.getElementById("basicDecisionTable");
        let header = table.rows[0];
        let newCell = header.insertCell(-1);
        let value = colClass + `${header.cells.length - 1}`;
        newCell.innerHTML = `<input type="text" value="${value}">`;

        for (let i = 1; i < table.rows.length; i++) {
            let cell = table.rows[i].insertCell(-1);
            cell.innerHTML = `<input type="text">`;
        }
    }

    // Remove the last column
    function removeColumn() {
        let table = document.getElementById("basicDecisionTable");
        if (table.rows[0].cells.length > 2) {
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(-1);
            }
        }
    }

    function addSn() {
        if (trans_flag === 0) {
            addRow('s')
        } else {
            addColumn('s')
        }
    }

    function addAn() {
        if (trans_flag === 0) {
            addColumn('A')
        } else {
            addRow('A')
        }
    }

    function removeSn() {
        if (trans_flag === 0) {
            removeRow()
        } else {
            removeColumn()
        }
    }

    function removeAn() {
        if (trans_flag === 0) {
            removeColumn()
        } else {
            removeRow()
        }
    }

    // Function to transpose the table (swap rows and columns)
    function transposeTable() {
        let table = document.getElementById("basicDecisionTable");
        let rows = Array.from(table.rows);

        // Collect the current table data into a matrix
        let data = rows.map(row => Array.from(row.cells).map(cell => {
            // Check if the cell contains an input field
            if (cell.firstElementChild && cell.firstElementChild.tagName === "INPUT") {
                return cell.firstElementChild.value; // Use value from input
            } else {
                return cell.innerText; // Use text otherwise
            }
        }));

        // Clear the existing table
        table.innerHTML = '';

        // Rebuild the table with transposed data
        for (let i = 0; i < data[0].length; i++) {
            let newRow = table.insertRow(-1);
            for (let j = 0; j < data.length; j++) {
                let newCell = newRow.insertCell(-1);
                if (i === 0 || j === 0) {
                    if (i === 0 && j === 0) {
                        newCell.innerHTML = '';
                    } else {
                        newCell.innerHTML = `<input type="text" value="${data[j][i]}">`; // Set text for headers and first column
                    }
                } else {
                    // Create a new input element for decision/state values
                    newCell.innerHTML = `<input type="text" value="${data[j][i]}">`
                }
            }
        }

        trans_flag = (trans_flag + 1) % 2;
    }

    // Calculate decision criteria and display the selected decision names based on table names
    function calculate() {
        let table = document.getElementById("basicDecisionTable");
        let decisions = [];
        let rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Get all decision rows

        // Extract decision table data and names
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('input');
            let row = [];
            for (let cell of cells) {
                row.push(parseFloat(cell.value) || 0);
            }
            decisions.push({
                name: rows[i].cells[0].firstElementChild.value, // Get decision name from the first cell
                values: row.slice(1)
            });
        }

        // Function to get the decision name
        function getDecisionName(index) {
            return decisions[index].name;
        }

        function checkIndifference(values) {
            // Check if all elements in an array are the same
            return new Set(values).size === 1;
        }

        // MaxiMax
        let maxValues = decisions.map(decision => Math.max(...decision.values));
        let maximaxResult = Math.max(...maxValues);
        let maximaxIndex = maxValues.indexOf(maximaxResult);
        document.getElementById("maximax").innerHTML = `${maximaxResult}`;
        document.getElementById("maximaxSel").innerHTML = checkIndifference(maxValues) ? "Indifferent" : `${getDecisionName(maximaxIndex)}`;

        // MaxiMin
        let minValues = decisions.map(decision => Math.min(...decision.values));
        let maximinResult = Math.max(...minValues);
        let maximinIndex = minValues.indexOf(maximinResult);
        document.getElementById("maximin").innerHTML = `${maximinResult}`;
        document.getElementById("maximinSel").innerHTML = checkIndifference(minValues) ? "Indifferent" : `${getDecisionName(maximinIndex)}`;

        // miniMax Regret
        let states = decisions[0].values.length;
        let maxInState = [];
        for (let j = 0; j < states; j++) {
            let max = -Infinity;
            for (let decision of decisions) {
                max = Math.max(max, decision.values[j]);
            }
            maxInState.push(max);
        }
        let maxRegretValues = decisions.map(decision =>
            Math.max(...decision.values.map((value, index) => maxInState[index] - value))
        );
        let minMaxRegretResult = Math.min(...maxRegretValues);
        let minMaxRegretIndex = maxRegretValues.indexOf(minMaxRegretResult);
        document.getElementById("minimaxRegret").innerHTML = `${minMaxRegretResult}`;
        document.getElementById("minimaxRegretSel").innerHTML = checkIndifference(maxRegretValues) ? "Indifferent" : `${getDecisionName(minMaxRegretIndex)}`;

        // Laplace's principle
        let laplaceValues = decisions.map(decision => decision.values.reduce((a, b) => a + b, 0) / decision.values.length);
        let laplaceResult = Math.max(...laplaceValues);
        let laplaceIndex = laplaceValues.indexOf(laplaceResult);
        document.getElementById("laplace").innerHTML = formatDecimal(laplaceResult);
        document.getElementById("laplaceSel").innerHTML = checkIndifference(laplaceValues) ? "Indifferent" : `${getDecisionName(laplaceIndex)}`;

        // Hurwicz’s optimism (α from user input)
        let alpha = parseFloat(Alpha());
        let hurwiczValues = decisions.map(decision => alpha * Math.max(...decision.values) + (1 - alpha) * Math.min(...decision.values));
        let hurwiczResult = Math.max(...hurwiczValues);
        let hurwiczIndex = hurwiczValues.indexOf(hurwiczResult);
        document.getElementById("hurwicz").innerHTML = `${hurwiczResult}`;
        document.getElementById("hurwiczSel").innerHTML = checkIndifference(hurwiczValues) ? "Indifferent" : `${getDecisionName(hurwiczIndex)}`;
        // Hurwicz’s optimism (calculate α)
        if (rows.length === 2) {
            let maxDiff = maxValues[0] - maxValues[1];
            let minDiff = minValues[1] - minValues[0];
            let calAlpha = 0;
            calAlpha = simAlpha(minDiff, minDiff + maxDiff);
            document.getElementById("calAlpha").innerHTML = `α for indifferent Hurwicz optimism: ` + calAlpha;
        } else {
            document.getElementById("calAlpha").innerHTML = '';
        }
    }

    function formatDecimal(number) {
        let str = Number(number).toString();

        if (str.includes('.')) {
            str = str.replace(/\.?0+$/, '');

            const decimalLength = str.split('.')[1]?.length || 0;

            if (decimalLength > 4) {
                return Number(number).toFixed(4);
            }
        }

        return str;
    }

    function Alpha() {
        let alpha = document.getElementById("alpha").value;
        alpha = eval(alpha);
        document.getElementById("alpha").value = formatDecimal(alpha);
        return alpha;
    }

    function simAlpha(numerator, denominator) {
        if (denominator === 0 || numerator === 0) {
            return `0`;
        }

        // Calculate the greatest common divisor
        const gcdValue = gcd(numerator, denominator);

        // Simplify fractions using greatest common divisor
        const simplifiedNumerator = numerator / gcdValue;
        const simplifiedDenominator = denominator / gcdValue;

        // Output the simplest fraction
        if (simplifiedDenominator === 1) {
            return `${simplifiedNumerator}`;
        } else {
            if (simplifiedDenominator < 0 && simplifiedNumerator > 0) {
                return `-${simplifiedNumerator}/${Math.abs(simplifiedDenominator)}`;
            } else {
                return `${Math.abs(simplifiedNumerator)}/${Math.abs(simplifiedDenominator)}`;
            }
        }
    }

    // Function to find the greatest common divisor (GCD)
    function gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    // Expose some methods to the outside for interaction
    return {
        initEventListeners: initEventListeners,
        addSn: addSn,
        addAn: addAn,
        removeSn: removeSn,
        removeAn: removeAn,
        transposeTable: transposeTable,
        calculate: calculate
    };
})();

// Initialize event listeners when the document is loaded
basicTable.initEventListeners();
