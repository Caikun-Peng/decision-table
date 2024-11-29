var twoPlayerTable = (function () {
    // 在倒数第二行后添加一行
    function addRow(rowClass) {
        let table = document.getElementById("twoPlayerTable");
        let rowIndex = table.rows.length - 1; // 倒数第二行的索引
        let newRow = table.insertRow(rowIndex); // 在倒数第二行后插入
        let cell = newRow.insertCell(0);
        let value = rowClass + `${rowIndex}`;
        cell.innerHTML = `<input type="text" value="${value}">`;

        // 对新行的其他单元格添加 <input>
        for (let i = 1; i < table.rows[0].cells.length - 1; i++) {
            let cell = newRow.insertCell(i);
            cell.innerHTML = `<input type="text"><input type="text">`;
        }

        // 最后一个单元格不含 <input>
        let lastCell = newRow.insertCell(-1);
        lastCell.innerHTML = "";
        lastCell.classList.add('cMAX');
    }

    // 删除倒数第二行
    function removeRow() {
        let table = document.getElementById("twoPlayerTable");
        if (table.rows.length > 3) { // 至少保留两行（头部行和一行数据行）
            table.deleteRow(table.rows.length - 2); // 删除倒数第二行
        }
    }

    // 在倒数第二列后添加一列
    function addColumn(colClass) {
        let table = document.getElementById("twoPlayerTable");
        let colIndex = table.rows[0].cells.length - 1; // 倒数第二列的索引

        // 添加到表头的倒数第二列后
        let header = table.rows[0];
        let newCell = header.insertCell(colIndex);
        let value = colClass + `${colIndex}`;
        newCell.innerHTML = `<input type="text" value="${value}">`;

        // 对其他行添加对应的新列
        for (let i = 1; i < table.rows.length; i++) {
            let cell = table.rows[i].insertCell(colIndex);

            // 如果是最后一行，不添加 <input>
            if (i === table.rows.length - 1) {
                cell.innerHTML = "";
                cell.classList.add('rMAX');
            } else {
                cell.innerHTML = `<input type="text"><input type="text">`;
            }
        }
    }

    // 删除倒数第二列
    function removeColumn() {
        let table = document.getElementById("twoPlayerTable");
        if (table.rows[0].cells.length > 3) { // 至少保留两列（首列和一列数据列）
            let colIndex = table.rows[0].cells.length - 2; // 倒数第二列的索引
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(colIndex); // 删除每行的倒数第二列
            }
        }
    }

    // Show row MIN and col MAX
    function showMinMax() {
        console.log('showMinMax');
        let rowValues = [];
        let colValues = [];
        let table = document.getElementById("twoPlayerTable");
        // console.info('table: ', table);
        let rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Get all decision rows
        // console.info('row: ', rows);
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

        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('input');
            for (let j = 1; j < cells.length; j += 2) {
                console.info("cell:", cells[j].value, cells[j + 1].value, "rMAX", rowValues[(j - 1) / 2], "cMAX", colValues[i]);
                if (cells[j].value == rowValues[(j - 1) / 2] && cells[j + 1].value == colValues[i]) {
                    cells[j].style.backgroundColor = "yellow";
                    cells[j + 1].style.backgroundColor = "yellow";
                } else {
                    // cells[j].style.backgroundColor = "";
                }

            }
        }
    }


    // Calculate decision criteria and display the selected decision names based on table names
    function calculate() {
        showMinMax();
        // let table = document.getElementById("twoPlayerTable");
        // let decisions = [];
        // let rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Get all decision rows

        // // Extract decision table data and names
        // for (let i = 0; i < rows.length - 1; i++) {
        //     let cells = rows[i].getElementsByTagName('input');
        //     let row = [];
        //     for (let cell of cells) {
        //         row.push(parseFloat(cell.value) || 0);
        //     }
        //     decisions.push({
        //         name: rows[i].cells[0].firstElementChild.value, // Get decision name from the first cell
        //         values: row.slice(1)
        //     });
        // }

        // // Function to get the decision name
        // function getDecisionName(index) {
        //     return decisions[index].name;
        // }

        // function checkIndifference(values) {
        //     // Check if all elements in an array are the same
        //     return new Set(values).size === 1;
        // }

        // // MaxiMax
        // let maxValues = decisions.map(decision => Math.max(...decision.values));
        // let maximaxResult = Math.max(...maxValues);
        // let maximaxIndex = maxValues.indexOf(maximaxResult);
        // document.getElementById("maximax").innerHTML = `${maximaxResult}`;
        // document.getElementById("maximaxSel").innerHTML = checkIndifference(maxValues) ? "Indifferent" : `${getDecisionName(maximaxIndex)}`;

        // // MaxiMin
        // let minValues = decisions.map(decision => Math.min(...decision.values));
        // let maximinResult = Math.max(...minValues);
        // let maximinIndex = minValues.indexOf(maximinResult);
        // document.getElementById("maximin").innerHTML = `${maximinResult}`;
        // document.getElementById("maximinSel").innerHTML = checkIndifference(minValues) ? "Indifferent" : `${getDecisionName(maximinIndex)}`;

        // // miniMax Regret
        // let states = decisions[0].values.length;
        // let maxInState = [];
        // for (let j = 0; j < states; j++) {
        //     let max = -Infinity;
        //     for (let decision of decisions) {
        //         max = Math.max(max, decision.values[j]);
        //     }
        //     maxInState.push(max);
        // }
        // let maxRegretValues = decisions.map(decision =>
        //     Math.max(...decision.values.map((value, index) => maxInState[index] - value))
        // );
        // let minMaxRegretResult = Math.min(...maxRegretValues);
        // let minMaxRegretIndex = maxRegretValues.indexOf(minMaxRegretResult);
        // document.getElementById("minimaxRegret").innerHTML = `${minMaxRegretResult}`;
        // document.getElementById("minimaxRegretSel").innerHTML = checkIndifference(maxRegretValues) ? "Indifferent" : `${getDecisionName(minMaxRegretIndex)}`;

        // // Laplace's principle
        // let laplaceValues = decisions.map(decision => decision.values.reduce((a, b) => a + b, 0) / decision.values.length);
        // let laplaceResult = Math.max(...laplaceValues);
        // let laplaceIndex = laplaceValues.indexOf(laplaceResult);
        // document.getElementById("laplace").innerHTML = formatDecimal(laplaceResult);
        // document.getElementById("laplaceSel").innerHTML = checkIndifference(laplaceValues) ? "Indifferent" : `${getDecisionName(laplaceIndex)}`;

        // // Hurwicz’s optimism (α from user input)
        // let alpha = parseFloat(Alpha());
        // let hurwiczValues = decisions.map(decision => alpha * Math.max(...decision.values) + (1 - alpha) * Math.min(...decision.values));
        // let hurwiczResult = Math.max(...hurwiczValues);
        // let hurwiczIndex = hurwiczValues.indexOf(hurwiczResult);
        // document.getElementById("hurwicz").innerHTML = `${hurwiczResult}`;
        // document.getElementById("hurwiczSel").innerHTML = checkIndifference(hurwiczValues) ? "Indifferent" : `${getDecisionName(hurwiczIndex)}`;
        // // Hurwicz’s optimism (calculate α)
        // if (rows.length === 3) {
        //     let maxDiff = maxValues[0] - maxValues[1];
        //     let minDiff = minValues[1] - minValues[0];
        //     let calAlpha = 0;
        //     calAlpha = simAlpha(minDiff, minDiff + maxDiff);
        //     document.getElementById("calAlpha").innerHTML = `α for indifferent Hurwicz optimism: ` + calAlpha;
        // } else {
        //     document.getElementById("calAlpha").innerHTML = '';
        // }
    }

    // function formatDecimal(number) {
    //     let str = Number(number).toString();

    //     if (str.includes('.')) {
    //         str = str.replace(/\.?0+$/, '');

    //         const decimalLength = str.split('.')[1]?.length || 0;

    //         if (decimalLength > 4) {
    //             return Number(number).toFixed(4);
    //         }
    //     }

    //     return str;
    // }

    // function Alpha() {
    //     let alpha = document.getElementById("alpha").value;
    //     alpha = eval(alpha);
    //     document.getElementById("alpha").value = formatDecimal(alpha);
    //     return alpha;
    // }

    // function simAlpha(numerator, denominator) {
    //     if (denominator === 0 || numerator === 0) {
    //         return `0`;
    //     }

    //     // Calculate the greatest common divisor
    //     const gcdValue = gcd(numerator, denominator);

    //     // Simplify fractions using greatest common divisor
    //     const simplifiedNumerator = numerator / gcdValue;
    //     const simplifiedDenominator = denominator / gcdValue;

    //     // Output the simplest fraction
    //     if (simplifiedDenominator === 1) {
    //         return `${simplifiedNumerator}`;
    //     } else {
    //         if (simplifiedDenominator < 0 && simplifiedNumerator > 0) {
    //             return `-${simplifiedNumerator}/${Math.abs(simplifiedDenominator)}`;
    //         } else {
    //             return `${Math.abs(simplifiedNumerator)}/${Math.abs(simplifiedDenominator)}`;
    //         }
    //     }
    // }

    // Function to find the greatest common divisor (GCD)
    // function gcd(a, b) {
    //     while (b !== 0) {
    //         let temp = b;
    //         b = a % b;
    //         a = temp;
    //     }
    //     return Math.abs(a);
    // }

    // Expose some methods to the outside for interaction
    return {
        // initEventListeners: initEventListeners,
        addAn: () => addRow("A"),
        addBn: () => addColumn("B"),
        removeAn: removeRow,
        removeBn: removeColumn,
        calculate: showMinMax
    };
})();

// Initialize event listeners when the document is loaded
// twoPlayerTable.initEventListeners();
