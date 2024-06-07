//Constants
const EMPTY_CELL = '.';
const PLACEHOLDER_CELL = '*';
const ELEMENTS = [
    { name: 'Carbon', acronym: 'C', maxBonds: 4 }
];

//Global variable
let grid = undefined;
let xGlobalOffset = 0;
let yGlobalOffset = 0;
let selectedElementCell = undefined;

//Fundatamental blocks
function getCell(x, y) {
    const cellContent = grid[x+xGlobalOffset][y+yGlobalOffset];
    return cellContent;
}

function setCell(x, y, content) {
    grid[x+xGlobalOffset][y+yGlobalOffset] = content;
}

function getElement(x, y) {
    const elementContent = getCell(x*2, y*2);

    return elementContent;
}

function setElement(x, y, content) {
    const destinationCell = getCell(x*2, y*2);

    if(destinationCell !== PLACEHOLDER_CELL){
        throw new Error('Invalid cell.');
    }

    if(!isElement(content) && content != '*'){
        throw new Error('Not supported element.')
    }

    setCell(x*2, y*2, content);
}

function addPlaceholder(x, y, content) {
    setCell(x*2, y*2, content);
}

function getNearElements(x, y) {
    const nearElements = [
        {x: x+1, y: y,   element: getElement(x+1, y)},
        {x: x-1, y: y,   element: getElement(x-1, y)},
        {x: x+1, y: y+1, element: getElement(x+1, y+1)},
        {x: x-1, y: y+1, element: getElement(x-1, y+1)},
        {x: x+1, y: y-1, element: getElement(x+1, y-1)},
        {x: x-1, y: y-1, element: getElement(x-1, y-1)},
    ]

    return nearElements;
}

function removeElement(x, y) {
    setCell(x*2, y*2, EMPTY_CELL);
}

function setBond(sourceX, sourceY, destinationX, destinationY, numOfBonds) {
    const bondX = (sourceX*2 + destinationX*2) / 2;
    const bondY = (sourceY*2 + destinationY*2) / 2;

    setCell(bondX, bondY, numOfBonds);
}

function removeBond(sourceX, sourceY, destinationX, destinationY) {
    setBond(sourceX, sourceY, destinationX, destinationY, EMPTY_CELL);
}

function getElementDescriptorByAcronym(acronym) {
    const elementDescriptor = ELEMENTS.find(el => el.acronym === acronym);
    if(typeof elementDescriptor === 'undefined'){
        throw new Error('Invalid acronym.');
    }

    return elementDescriptor;
}

function isElement(acronym) {
    return ELEMENTS.find(el => el.acronym === acronym) ? true : false;
}

function setSelectedElementCell(x, y) {
    selectedElementCell = { x: x, y: y };
}

//Actions
function addElementCell(acronym, destinationX=0, destinationY=0, sourceX=undefined, sourceY=undefined) {
    expandGrid(destinationX, destinationY);

    setElement(destinationX, destinationY, acronym);

    makeNullBonds(destinationX, destinationY);

    if(
        typeof sourceX  !== 'undefined' && 
        typeof sourceY  !== 'undefined'
    ) {
        const sourceCell = getElement(sourceX, sourceY);
        const sourceElementDescriptor = getElementDescriptorByAcronym(sourceCell);
        const sourceElementBonds = getNumOfBonds(sourceX, sourceY);
        if(sourceElementBonds === sourceElementDescriptor.maxBonds) {
            throw new Error('Max number of bonds in source element.');
        }

        makeBond(sourceX, sourceY, destinationX, destinationY, 1);
    }

    selectElementCell(destinationX, destinationY);
}
// TO-DO: If theres no more elements, but a placeholder in the removed one
function removeElementCell(x, y) {
    removeElement(x, y);

    const nearElements = getNearElements(x, y);

    nearElements.forEach(nearElement => {
        removeBond(x, y, nearElement.x, nearElement.y);
    })

    deselectElementCell();
}

function selectElementCell(x, y) {
    const elementCell = getElement(x, y);

    const elementDescriptor = getElementDescriptorByAcronym(elementCell);
    const elementBonds = getNumOfBonds(x, y);
    if(elementBonds === elementDescriptor.maxBonds) {
        throw new Error('Max number of bonds in select element.');
    }

    setSelectedElementCell(x, y);

    freePlaceholderCells();

    createPlaceholderCells(x, y);
}
function deselectElementCell() {
    selectedElementCell = undefined;

    freePlaceholderCells();
}

function makeBond(sourceX, sourceY, destinationX, destinationY, numOfBonds) {
    const sourceCell = getElement(sourceX, sourceY);

    const sourceElementDescriptor = getElementDescriptorByAcronym(sourceCell);
    const sourceElementBonds = getNumOfBonds(sourceX, sourceY) + numOfBonds;
    if(sourceElementBonds > sourceElementDescriptor.maxBonds) {
        throw new Error('Not sufficient number of available bonds in source element.');
    }

    const destinationCellCell = getElement(destinationX, destinationY);

    const destinationElementDescriptor = getElementDescriptorByAcronym(destinationCellCell);
    const destinationElementBonds = getNumOfBonds(destinationX, destinationY) + numOfBonds;
    if(destinationElementBonds > destinationElementDescriptor.maxBonds) {
        throw new Error('Not sufficient number of available bonds in destination element.');
    }
    
    setBond(sourceX, sourceY, destinationX, destinationY, numOfBonds)
}

// TO-DO: open-ia, getCompoundName()

//Logic
// getGridElements

function expandGrid(destinationX, destinationY) {
    const newSize = getNewSizes(destinationX, destinationY);
    const oldXGlobalOffset = xGlobalOffset;
    const oldYGlobalOffset = yGlobalOffset;

    correctGlobalOffsets(destinationX, destinationY);

    const newGrid = Array.from({ length: newSize.newWidth }, () => Array(newSize.newHeight).fill(EMPTY_CELL));
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            newGrid[x + xGlobalOffset - oldXGlobalOffset][y + yGlobalOffset - oldYGlobalOffset] = grid[x][y];
        }
    }
    
    grid = newGrid;
}

function correctGlobalOffsets(destinationX, destinationY) {
    const xNegativeOffset = (destinationX * 2) + xGlobalOffset - 2;
    if (xNegativeOffset < 0) {
        xGlobalOffset += Math.abs(xNegativeOffset);
    }

    const yNegativeOffset = (destinationY * 2) + yGlobalOffset - 2;
    if (yNegativeOffset < 0) {
        yGlobalOffset += Math.abs(yNegativeOffset);
    }
}

function getNewSizes(destinationX, destinationY) {
    const adjustedDestinationX = (destinationX * 2) + xGlobalOffset;
    const adjustedDestinationY = (destinationY * 2) + yGlobalOffset;

    const newWidth =
        (adjustedDestinationX - 2 < 0 ? 2 : 0) +
        grid.length +
        (adjustedDestinationX + 2 > grid.length ? 2 : 0);

    const newHeight =
        (adjustedDestinationY - 2 < 0 ? 2 : 0) +
        grid[0].length +
        (adjustedDestinationY + 2 > grid[0].length ? 2 : 0);

    return {
        newWidth: newWidth,
        newHeight: newHeight
    };
}

function freePlaceholderCells() {
    grid = grid.map(row => 
        row.map(cell => cell === PLACEHOLDER_CELL ? EMPTY_CELL : cell)
    );
}

function createPlaceholderCells(x, y) {
    const placeholderPositions = getNearElements(x, y);

    placeholderPositions.forEach(ph => {
        if(ph.element !== EMPTY_CELL) return;

        addPlaceholder(ph.x, ph.y, PLACEHOLDER_CELL);
    });
}

function makeNullBonds(x, y) {
    const bonds = getBondsAndNearElements(x, y);

    bonds.forEach(bond => {
        const numOfBonds = Number(bond.numOfBonds);
        if(isNaN(numOfBonds)) {
            makeBond(x, y, bond.x, bond.y, 0);
        }
    });
}

function getBondsAndNearElements(x, y) {
    const elementCells = getNearElements(x, y);
    
    const bonds = elementCells.filter(cell => isElement(cell.element)).map(element => ({
        x: element.x,
        y: element.y,
        numOfBonds: getCell(element.x, element.y)
    }))

    return bonds;
}

function getNumOfBonds(x, y) {
    const bonds = getBondsAndNearElements(x, y);
    const totalNumOfBonds = bonds.reduce((sum, bond) => sum + bond.numOfBonds, 0);

    return totalNumOfBonds;
}

function promptGrid() {
    const transposedGrid = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
    transposedGrid.forEach(row => console.log(row.join(' ')));
}

function init() {
    grid = [[
        PLACEHOLDER_CELL
    ]];

    xGlobalOffset = 0;
    yGlobalOffset = 0;
    selectedElementCell = undefined;
}

let testCount = 0;

// Test
testCount++
console.log(`Test ${testCount}:`);
init();
addElementCell('C');
addElementCell('C', -1, 0, 0, 0);
selectElementCell(0, 0);
addElementCell('C', 1, 0, 0, 0);
selectElementCell(0, 0);
addElementCell('C', 1, -1, 0, 0);
addElementCell('C', 0, -1, 1, -1);
promptGrid();
