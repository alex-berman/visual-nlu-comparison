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
    {name: "Sprinklr", href: "https://www.sprinklr.com/platform/"},
];

const numRows = 3;

var displayedItems = [];
var pageWidth;
var pageHeight;

function start() {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;

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
    var content = document.createElement("div");
    content.className = "center";
    content.innerHTML = nlu.name;
    item.appendChild(content);
    placeItem(item, count);
    return item;
}

function placeItem(item, count) {
    item.style.top = pageHeight / 2 - 200/2;
    item.style.left = pageWidth / 2 - 200/2;
}