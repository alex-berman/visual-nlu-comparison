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
const numRows = 3;
const itemWidth = 200;
const itemHeight = 200;
const horizontalMargin = 10;

var displayedItems = [];
var pageWidth;
var pageHeight;
var globalTop;
var globalLeft;

function start() {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;
    globalTop = (pageHeight - numRows * itemHeight) / 2;
    globalLeft = (pageWidth - maxItemsPerRow * itemWidth) / 2;

    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceed();
        }
    });
}

function proceed() {
    if(displayedItems.length < nlusInfo.length) {
        var nluCount = displayedItems.length;
        var nluInfo = nlusInfo[nluCount];
        var item = createItem(nluInfo, nluCount);
        document.body.appendChild(item);
        displayedItems.push(item);
    }
}

function createItem(nlu, count) {
    var item = document.createElement("div");
    item.className = "item";
    item.style.width = itemWidth;
    item.style.height = itemHeight;
    var content = document.createElement("div");
    content.className = "center";
    content.innerHTML = nlu.name;
    item.appendChild(content);
    placeItem(item, count);
    return item;
}

function placeItem(item, positionIndex) {
    var row;
    var count = 0;
    for(row = 0; row < numRows; row++) {
        let numItemsInRow = maxItemsPerRow - (1 - row % 2);
        if(positionIndex < count + numItemsInRow) {
            break;
        }
        count += numItemsInRow;
    }
    const column = positionIndex - count;
    var rowLeft = (1 - row % 2) * itemWidth / 2;
    item.style.top = globalTop + row * itemHeight;
    item.style.left = globalLeft + rowLeft + column * itemWidth + (column - 1) * horizontalMargin;
}