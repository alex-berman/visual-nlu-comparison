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
const numRows = 7;
const numRowsWithContent = 3;
const offsetForRowsWithContent = 2;
const horizontalMargin = 10;

var numColumns;
var itemWidth;
var itemHeight;
var fontSize;
var pageWidth;
var pageHeight;
var globalTop;
var globalLeft;
var itemsWithContent = [];
var itemsWithoutContent = [];
var itemCount = 0;

const States = {
    itemsWithContent: "itemsWithContent",
    itemsWithoutContent: "itemsWithoutContent"
};
var state = States.itemsWithContent;

function start() {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;
    itemHeight = pageHeight / (numRows - 1);
    itemWidth = itemHeight;
    fontSize = itemHeight * 0.14;
    numColumns = Math.floor(pageWidth / pageHeight * numRows) + 1;
    offsetForColumnsWithContent = Math.floor((numColumns - maxItemsPerRow) / 2) ;
    globalTop = -itemHeight / 2;
    globalLeft = -itemWidth;

    createItems();

    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceed();
        }
    });
}

function createItems() {
    var availablePositionsWithoutContent = new Set();
    var availablePositionsWithContent = new Set();
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

    function createItem(nlu) {
        var item = document.createElement("div");
        item.className = "item";
        item.style.width = itemWidth;
        item.style.height = itemHeight;
        item.style.fontSize = fontSize;
        item.style.visibility = "hidden";
        var content = document.createElement("div");
        content.className = "center";
        content.innerHTML = nlu.name;
        item.appendChild(content);
        var position = consumeRandom(availablePositionsWithContent);
        placeItem(item, position.row, position.column);
        document.body.appendChild(item);
        itemsWithContent.push(item);
    }

    nlusInfo.forEach(nluInfo => createItem(nluInfo));

    function createEmptyItem() {
        var item = document.createElement("div");
        item.className = "item withoutContent";
        item.style.width = itemWidth;
        item.style.height = itemHeight;
        item.style.fontSize = fontSize;
        item.style.visibility = "hidden";
        var content = document.createElement("div");
        content.className = "center";
        content.innerHTML = "?";
        item.appendChild(content);
        var position = consumeRandom(availablePositionsWithoutContent);
        placeItem(item, position.row, position.column);
        document.body.appendChild(item);
        itemsWithoutContent.push(item);
    }

    var numPositionsWithoutContent = availablePositionsWithoutContent.size;
    for(let i = 0; i < numPositionsWithoutContent; i++) {
        createEmptyItem();
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
    if(state == States.itemsWithContent) {
        if(itemCount < nlusInfo.length) {
            itemsWithContent[itemCount].style.visibility = 'visible';
            itemCount++;
        }
        else {
            state = States.itemsWithoutContent;
            itemCount = 0;
            proceed();
        }
    }
    else if(state == States.itemsWithoutContent) {
        if(itemCount < itemsWithoutContent.length) {
            itemsWithoutContent[itemCount].style.visibility = 'visible';
            itemCount++;
        }
    }
}

function consumeRandom(set) {
    var asList = [...set.values()];
    var randomValue = asList[Math.floor(Math.random() * asList.length)];
    set.delete(randomValue);
    return randomValue;
}

function placeItem(item, row, column) {
    var rowLeft = (1 - row % 2) * itemWidth / 2;
    item.style.top = globalTop + row * itemHeight;
    item.style.left = globalLeft + rowLeft + column * itemWidth + (column - 1) * horizontalMargin;
}