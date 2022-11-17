const nlusInfo = [
    {name: "Rasa", openSource: true},
    {name: "Snips", openSource: true},
    {name: "ConvLab", openSource: true},
    {name: "DeepPavlov", openSource: true},
    {name: "Plato", openSource: true, href: "https://eng.uber.com/plato-research-dialogue-system/"},
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
var title;

const States = {
    itemsWithContent: 0,
    itemsWithoutContent: 1,
    afterItemsWithoutContent: 2,
    beforeCompare: 3,
    compareOpenSource: 4
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

    title = document.getElementById("title");
    title.style.fontSize = itemHeight * 0.2;
    title.style.top = pageHeight - itemHeight * 0.4;
    title.style.left = itemWidth * 0.2;

    createItems();

    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceedInState();
        }
        else if(e.key == "PageDown") {
            proceedToNextState();
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

function proceedInState() {
    if(state == States.itemsWithContent) {
        if(itemCount < nlusInfo.length) {
            itemCount++;
        }
        else {
            proceedToNextState();
        }
    }
    else if(state == States.itemsWithoutContent) {
        if(itemCount < itemsWithoutContent.length) {
            itemCount++;
        }
    }
    updateScreen();
}

function updateScreen() {
    if(state == States.itemsWithContent) {
        for(let i = 0; i < itemsWithContent.length; i++) {
            itemsWithContent[i].style.visibility = (i < itemCount) ? 'visible' : 'hidden';
        }
        itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
    }
    else if(state == States.itemsWithoutContent) {
        itemsWithContent.forEach(item => { item.style.visibility = 'visible'; });
        for(let i = 0; i < itemsWithoutContent.length; i++) {
            itemsWithoutContent[i].style.visibility = (i < itemCount) ? 'visible' : 'hidden';
        }
    }
    else if(state == States.afterItemsWithoutContent) {
        itemsWithContent.forEach(item => { item.style.visibility = 'visible'; });
        itemsWithoutContent.forEach(item => { item.style.visibility = 'visible'; });
    }
    else if(state == States.beforeCompare) {
        itemsWithContent.forEach(item => { item.style.visibility = 'visible'; });
        itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
    }
    else if(state == States.compareOpenSource) {
        for(let i = 0; i < nlusInfo.length; i++) {
            var nluInfo = nlusInfo[i];
            var item = itemsWithContent[i];
            item.style.visibility = 'visible';
            item.className = (nluInfo.openSource ? "item highlight" : "item dim");
        }
        itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
        title.innerHTML = "Open source";
    }
}

function proceedToNextState() {
    if(state < Object.entries(States).length) {
        state += 1;
        itemCount = 0;
        updateScreen();
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