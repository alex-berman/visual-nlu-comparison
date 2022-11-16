const nlusInfo = [
    // Open source
    {name: "Rasa"},
    {name: "Snips"},
    {name: "ConvLab"},
    {name: "DeepPavlov"},
    {name: "Plato", href: "https://eng.uber.com/plato-research-dialogue-system/"},

    // Proprietary
    {name: "Dialogflow"},
    {name: "Wit.ai"},
    {name: "IBM Watson Assistant"},
    {name: "Amazon Lex"},
    {name: "LUIS"},
    {name: "Oracle Digital Assistant"},
    {name: "SAP Conversational AI"},
    {name: "Teneo"},
    {name: "Ada", href: "https://www.ada.cx/platform/conversational-ai"},
    {name: "Cognigy", href: "https://www.cognigy.com/products/cognigy-ai"},
    {name: "Ultimate", href: "https://www.cognigy.com/products/cognigy-ai"},
    //{name: "Sprinklr", href: "https://www.sprinklr.com/platform/"},
];

const maxItemsPerRow = 6;
const numRows = 6;
const numRowsWithContent = 3;
const offsetForRowsWithContent = 2;
const horizontalMargin = 10;

var numColumns;
var itemWidth;
var itemHeight;
var displayedItems = [];
var pageWidth;
var pageHeight;
var globalTop;
var globalLeft;
var availablePositionsWithoutContent = new Set();
var availablePositionsWithContent = new Set();

function start() {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;
    itemHeight = pageHeight / numRows;
    itemWidth = itemHeight;
    numColumns = Math.floor(pageWidth / pageHeight * numRows);
    offsetForColumnsWithContent = Math.floor((numColumns - maxItemsPerRow) / 2);
    globalTop = -itemHeight / 2;
    globalLeft = 0;

    createAvailablePositions();

    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceed();
        }
    });
}

function createAvailablePositions() {
    for(let row = 0; row < numRows; row++) {
        for(let column = 0; column < numColumns; column++) {
            var position = {row: row, column: column};
            if(positionHasContent(row, column)) {
                availablePositionsWithContent.add(position);
            }
            else {
                availablePositionsWithoutContent.add(position);
            }
        }
    }
}

function positionHasContent(row, column) {
    if(row >= offsetForRowsWithContent && row < (offsetForRowsWithContent + numRowsWithContent)) {
        var columnsInRow = maxItemsPerRow - (1 - row % 2);
        if(column >= offsetForColumnsWithContent && column < (offsetForColumnsWithContent + columnsInRow)) {
            return true;
        }
    }
}

function proceed() {
    if(displayedItems.length < nlusInfo.length) {
        var nluCount = displayedItems.length;
        var nluInfo = nlusInfo[nluCount];
        var item = createItem(nluInfo);
        document.body.appendChild(item);
        displayedItems.push(item);
    }
}

function createItem(nlu) {
    var item = document.createElement("div");
    item.className = "item";
    item.style.width = itemWidth;
    item.style.height = itemHeight;
    var content = document.createElement("div");
    content.className = "center";
    content.innerHTML = nlu.name;
    item.appendChild(content);
    var position = consumeRandom(availablePositionsWithContent);
    placeItem(item, position.row, position.column);
    return item;
}

function consumeRandom(set) {
    var asList = [...set.values()];
    var randomValue = asList[Math.floor(Math.random() * asList.length)];
    set.delete(randomValue);
    return randomValue;
}

function placeItem(item, row, column) {
    var rowLeft = (1 - row % 2) * itemWidth / 2;
    item.style.top = globalTop + (row + offsetForRowsWithContent) * itemHeight;
    item.style.left = globalLeft + rowLeft + column * itemWidth + (column - 1) * horizontalMargin;
}