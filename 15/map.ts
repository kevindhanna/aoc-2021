import * as Day from "./solution.js"

const exampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const map = Day.multiplyMap(Day.parseInput(exampleInput));

const root = document.getElementById("root");
if (!root) {
    throw "No root element"
}

const coordBox = document.createElement("p");
coordBox.setAttribute("class", "coordBox");
root.appendChild(coordBox);

const cells: Element[][] = [];
const table = document.createElement("table");

map.asArray().forEach((l, y) => {
    const row = document.createElement("tr");
    const cellRow: Element[] = [];
    l.forEach((n, x) => {
        const cell = document.createElement("th");
        const text = document.createTextNode("");
        text['nodeValue'] = `${n}`;
        cell.setAttribute("class", "gray")
        cell.setAttribute("title", `${y},${x}`)
        cell.addEventListener("mouseover",() => {
            coordBox.innerHTML = `${y} , ${x}`
        })
        cell.appendChild(text);
        row.appendChild(cell);
        cellRow.push(cell);
    })
    cells.push(cellRow)
    table.appendChild(row);
})
root.appendChild(table);
