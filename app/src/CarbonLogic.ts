/**GLOBALDATA**/

// Constants
const EMPTY_CELL = '.';
const PLACEHOLDER_CELL = '*';
const ELEMENTS = [
    { name: 'Carbon', acronym: 'C', maxBonds: 4 }
];

const temperature = 0;
const model = "ft:gpt-3.5-turbo-0125:personal:validated:9Xv0YPoI";
const persona = 
    `You must respond the name of hydrocarbon using the user grid.

    Carbon is 'C'.

    Number is quantity of bonds.

    Example of 'Butane':
    .........
    .........
    ....C....
    .....1...
    ..C...C..
    ...1.1...
    ....C....
    .........
    .........`;

// Global variable
let grid: string[][];
let xGlobalOffset = 0;
let yGlobalOffset = 0;
let selectedElementCell: { x: number; y: number } | undefined = undefined;

/***CODE***/

// Fundamental blocks
function getCell(x: number, y: number): string {
    if (!grid) throw new Error('Grid is undefined');
    const cellContent = grid[x][y];
    return cellContent;
}

function setCell(x: number, y: number, content: string): void {
    if (!grid) throw new Error('Grid is undefined');
    grid[x][y] = content;
}

function getElement(x: number, y: number): string {
    return getCell(x, y);
}

function setElement(x: number, y: number, content: string): void {
    const destinationCell = getCell(x, y);

    if (destinationCell !== PLACEHOLDER_CELL) {
        throw new Error('Invalid cell.');
    }

    if (!isElement(content) && content !== '*') {
        throw new Error('Not supported element.');
    }

    setCell(x, y, content);
}

function addPlaceholder(x: number, y: number, content: string): void {
    setCell(x, y, content);
}

function getNearElements(x: number, y: number): Array<{ x: number, y: number, element: string }> {
    return [
        { x: x + 2, y: y, element: getElement(x + 2, y) },
        { x: x - 2, y: y, element: getElement(x - 2, y) },
        { x: x + 2, y: y + 2, element: getElement(x + 2, y + 2) },
        { x: x - 2, y: y + 2, element: getElement(x - 2, y + 2) },
        { x: x + 2, y: y - 2, element: getElement(x + 2, y - 2) },
        { x: x - 2, y: y - 2, element: getElement(x - 2, y - 2) },
    ];
}

function removeElement(x: number, y: number): void {
    setCell(x, y, EMPTY_CELL);
}

function setBond(sourceX: number, sourceY: number, destinationX: number, destinationY: number, numOfBonds: number): void {
    const bondX = (sourceX + destinationX) / 2;
    const bondY = (sourceY + destinationY) / 2;

    if (isNaN(Number(numOfBonds))) {
        setCell(bondX, bondY, numOfBonds.toString());
    }

    const direction = sourceY === destinationY 
    || (destinationX > sourceX && destinationY < sourceY) 
    || (destinationY > sourceY && destinationX < sourceX) 
        ? 1 
        : -1;

    setCell(bondX, bondY, (numOfBonds * direction).toString());
}

function removeBond(sourceX: number, sourceY: number, destinationX: number, destinationY: number): void {
    setBond(sourceX, sourceY, destinationX, destinationY, Number(EMPTY_CELL));
}

function getElementDescriptorByAcronym(acronym: string) {
    const elementDescriptor = ELEMENTS.find(el => el.acronym === acronym);
    if (typeof elementDescriptor === 'undefined') {
        throw new Error('Invalid acronym.');
    }

    return elementDescriptor;
}

function isElement(acronym: string): boolean {
    return ELEMENTS.some(el => el.acronym === acronym);
}

function setSelectedElementCell(x: number, y: number): void {
    selectedElementCell = { x, y };
}

// Actions
export function addElementCell(dataGrid: string[][], acronym: string, destinationX = 0, destinationY = 0): string[][] {
    setGrid(dataGrid);
    
    expandGrid(destinationX, destinationY);

    destinationX = destinationX+xGlobalOffset;
    destinationY = destinationY+yGlobalOffset;

    setElement(destinationX, destinationY, acronym);

    makeNullBonds(destinationX, destinationY);

    if (typeof selectedElementCell !== 'undefined') {
        let sourceX = selectedElementCell.x;
        let sourceY = selectedElementCell.y;
        
        sourceX = sourceX+xGlobalOffset;
        sourceY = sourceY+yGlobalOffset;

        const sourceCell = getElement(sourceX, sourceY);
        const sourceElementDescriptor = getElementDescriptorByAcronym(sourceCell);
        const sourceElementBonds = getNumOfBonds(sourceX, sourceY);
        if (sourceElementBonds === sourceElementDescriptor.maxBonds) {
            throw new Error('Max number of bonds in source element.');
        }

        makeBond(grid, sourceX, sourceY, 1, destinationX, destinationY);
    }

    selectElementCell(grid, destinationX, destinationY);

    xGlobalOffset = 0;
    yGlobalOffset = 0;

    return getTransposedGrid(grid);
}

// TO-DO: If there's no more elements, but a placeholder in the removed one
export function removeElementCell(dataGrid: string[][], x: number, y: number): string[][] {
    setGrid(dataGrid);

    removeElement(x, y);

    const nearElements = getNearElements(x, y);

    nearElements.forEach(nearElement => {
        removeBond(x, y, nearElement.x, nearElement.y);
    });

    deselectElementCell(grid);

    return getTransposedGrid(grid);
}

export function selectElementCell(dataGrid: string[][], x: number, y: number): string[][] {
    setGrid(dataGrid);
    
    const elementCell = getElement(x, y);

    const elementDescriptor = getElementDescriptorByAcronym(elementCell);
    const elementBonds = getNumOfBonds(x, y);
    if (elementBonds === elementDescriptor.maxBonds) {
        throw new Error('Max number of bonds in select element.');
    }

    setSelectedElementCell(x, y);

    freePlaceholderCells();

    createPlaceholderCells(x, y);

    return getTransposedGrid(grid);
}

export function deselectElementCell(dataGrid: string[][]): string[][] {
    setGrid(dataGrid);
    
    selectedElementCell = undefined;

    freePlaceholderCells();

    return getTransposedGrid(grid);
}

export function makeBond(dataGrid: string[][], sourceX: number, sourceY: number, numOfBonds: number, destinationX?: number, destinationY?: number): string[][] {
    setGrid(dataGrid);

    // Bond index in sourceX and sourceY, get elements index
    if(typeof destinationX === 'undefined' && typeof destinationY === 'undefined') {
        if(sourceY % 2 === 0) {
            destinationX = sourceX + 1;
            destinationY = sourceY;

            sourceX = sourceX - 1;
            sourceY = sourceY;
        } else {
            const bond = Number(getCell(sourceX, sourceY));

            if(bond>0) {
                destinationX = sourceX + 1;
                destinationY = sourceY - 1;

                sourceX = sourceX - 1;
                sourceY = sourceY + 1;
            } else if(bond<0) {
                destinationX = sourceX - 1;
                destinationY = sourceY - 1;

                sourceX = sourceX + 1;
                sourceY = sourceY + 1;
            } else {
                const topRightCell = getCell(sourceX + 1, sourceY - 1);
                if(isElement(topRightCell)) {
                    destinationX = sourceX + 1;
                    destinationY = sourceY - 1;

                    sourceX = sourceX - 1;
                    sourceY = sourceY + 1;
                } else {
                    destinationX = sourceX - 1;
                    destinationY = sourceY - 1;

                    sourceX = sourceX + 1;
                    sourceY = sourceY + 1;
                }
            }
        }
    }
    destinationX = destinationX as number;
    destinationY = destinationY as number;

    setBond(sourceX, sourceY, destinationX, destinationY, numOfBonds);

    const sourceCell = getElement(sourceX, sourceY);
    const sourceElementDescriptor = getElementDescriptorByAcronym(sourceCell);
    const sourceElementBonds = getNumOfBonds(sourceX, sourceY);

    const destinationCellCell = getElement(destinationX, destinationY);
    const destinationElementDescriptor = getElementDescriptorByAcronym(destinationCellCell);
    const destinationElementBonds = getNumOfBonds(destinationX, destinationY);

    if(
        sourceElementBonds > sourceElementDescriptor.maxBonds || 
        destinationElementBonds > destinationElementDescriptor.maxBonds
    ) {
        setBond(sourceX, sourceY, destinationX, destinationY, 1);
    }

    return getTransposedGrid(grid);
}

export async function getCompoundName(dataGrid: string[][]): Promise<string> {
    setGrid(dataGrid);
    
    const textualCompound = getTextualCompound();

    console.log(textualCompound)

    const numOfExemplaries = 3;

    const exemplariesNamesPromises = Array.from({ length: numOfExemplaries }, 
        async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return getCompoundNameWithRequest(textualCompound);
        }
    );

    const responses = await Promise.all(exemplariesNamesPromises);
    const responsesBody = await Promise.all(responses.map(response => response.json()));

    const exemplariesNames = responsesBody
                                    .map(data => data.choices[0].message.content);

    const name = getMoreOccurrenceName(exemplariesNames);

    return name;
}

// Logic

function setGrid(dataGrid: string[][]): void {
    grid = [];

    for (let i = 0; i < dataGrid.length; i++) {
        let innerArray: string[] = [];
        for (let j = 0; j < dataGrid[i].length; j++) {
            innerArray.push(dataGrid[i][j]);
        }
        grid.push(innerArray);
    }
}

function getCompoundNameWithRequest(textualCompound: string): Promise<Response> {
    // General API
    const baseURL = "https://api.openai.com/v1/";
    const token  = "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";
    
    // chat/completions
    const endPoint = "chat/completions";

    // Request
    const body = {
        model: model,
        messages: [
            {
                role: "system",
                content: persona
            },
            {
                role: "user",
                content: textualCompound
            }
        ],
        temperature: temperature,
        logprobs: false,
        seed: 22194
    }
    const responsePromise = fetch(`${baseURL}${endPoint}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(body)
    });

    return responsePromise;
}

function getMoreOccurrenceName(exemplariesNames: string[]): string {
    const frequencyCounter = exemplariesNames.reduce((counter: { [key: string]: number }, name) => {
        counter[name] = (counter[name] || 0) + 1;
        return counter;
    }, {});

    return Object.keys(frequencyCounter).reduce((a, b) => frequencyCounter[a] > frequencyCounter[b] ? a : b);
}

function expandGrid(destinationX: number, destinationY: number): void {
    const newSize = getNewSizes(destinationX, destinationY);

    correctGlobalOffsets(destinationX, destinationY);

    const newGrid = Array.from({ length: newSize.newWidth }, () => Array(newSize.newHeight).fill(EMPTY_CELL));
    if (!grid) throw new Error('Grid is undefined');
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            newGrid[x + xGlobalOffset][y + yGlobalOffset] = grid[x][y];
        }
    }
    
    grid = newGrid;
}

function correctGlobalOffsets(destinationX: number, destinationY: number): void {
    const xNegativeOffset = destinationX - 2;
    if (xNegativeOffset < 0) {
        xGlobalOffset = Math.abs(xNegativeOffset);
    }

    const yNegativeOffset = destinationY - 2;
    if (yNegativeOffset < 0) {
        yGlobalOffset = Math.abs(yNegativeOffset);
    }
}

function getNewSizes(destinationX: number, destinationY: number): { newWidth: number, newHeight: number } {
    if (!grid) throw new Error('Grid is undefined');
    
    const newWidth =
        (destinationX - 2 < 0 ? 2 : 0) +
        grid.length +
        (destinationX + 2 > grid.length ? 2 : 0);

    const newHeight =
        (destinationY - 2 < 0 ? 2 : 0) +
        grid[0].length +
        (destinationY + 2 > grid[0].length ? 2 : 0);

    return {
        newWidth: newWidth,
        newHeight: newHeight
    };
}

function freePlaceholderCells(): void {
    if (!grid) throw new Error('Grid is undefined');
    grid = grid.map(row => 
        row.map(cell => cell === PLACEHOLDER_CELL ? EMPTY_CELL : cell)
    );
}

function createPlaceholderCells(x: number, y: number): void {
    const placeholderPositions = getNearElements(x, y);

    placeholderPositions.forEach(ph => {
        if (ph.element !== EMPTY_CELL) return;

        addPlaceholder(ph.x, ph.y, PLACEHOLDER_CELL);
    });
}

function makeNullBonds(x: number, y: number): void {
    const bonds = getBondsAndNearElements(x, y);

    bonds.forEach(bond => {
        const numOfBonds = Number(bond.numOfBonds);
        if (isNaN(numOfBonds)) {
            makeBond(grid, x, y, 0, bond.x, bond.y);
        }
    });
}

function getBondsAndNearElements(x: number, y: number): Array<{ x: number, y: number, numOfBonds: string }> {
    const elementCells = getNearElements(x, y);

    return elementCells.filter(cell => isElement(cell.element)).map(element => ({
        x: element.x,
        y: element.y,
        numOfBonds: getCell((x + element.x)/2, (y + element.y)/2)
    }));
}

function getNumOfBonds(x: number, y: number): number {
    const bonds = getBondsAndNearElements(x, y);
    const totalNumOfBonds = bonds.reduce((sum, bond) => sum + Math.abs(Number(bond.numOfBonds)), 0);

    return totalNumOfBonds;
}

export function promptGrid(): void {
    const transposedGrid = getTransposedGrid(grid);
    transposedGrid.forEach(row => console.log(row.join(' ')));
}

export function getTransposedGrid(grid: string[][]): string[][] {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}

function getTextualCompound(): string {
    if (!grid) throw new Error('Grid is undefined');
    const transposedGrid = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
    const result: string[] = [];
    for (let i = 0; i < transposedGrid.length; i++) {
        const row = transposedGrid[i];
        let rowString = "";
        for (let j = 0; j < row.length; j++) {
            const cell = transposedGrid[i][j];
            if (cell === "." || cell === "*" || cell === "0") {
                rowString += ".";
            } else if (Number(cell) < 0) {
                rowString += Math.abs(Number(cell)).toString();
            } else if (cell === " ") {
                rowString += "\t";
            } else {
                rowString += cell;
            }
        }
        result.push(rowString);
    }
    return result.join("\n");
}
