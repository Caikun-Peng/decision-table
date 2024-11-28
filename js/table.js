const decisionTable = `
<table id="decisionTable">
    <tr>
        <th></th>
        <th><input type="text" value="A1"></th>
        <th><input type="text" value="A2"></th>
    </tr>
    <tr>
        <td><input type="text" value="s1"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
    </tr>
    <tr>
        <td><input type="text" value="s2"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
    </tr>
</table>
`
const tables = document.getElementsByClassName("decisionTable");
for (let i = 0; i < tables.length; i++) {
    tables[i].innerHTML = decisionTable;
}