const nlusInfo = [
    {name: "Rasa", openSource: 1},
    {name: "Snips", openSource: 1, languages: 9},
    {name: "ConvLab", openSource: 1},
    {name: "DeepPavlov", openSource: 1},
    {name: "Plato", openSource: 1, href: "https://eng.uber.com/plato-research-dialogue-system/"},
    {name: "Dialogflow", openSource: 0, languages: 122},
    {name: "Wit.ai", openSource: 0, languages: 131},
    {name: "IBM Watson Assistant", openSource: 0, languages: 13},
    {name: "Amazon Lex", openSource: 0, languages: 13},
    {name: "LUIS", openSource: 0, languages: 20},
    {name: "Oracle Digital Assistant", openSource: 0},
    {name: "SAP Conversational AI", openSource: 0},
    {name: "Teneo", openSource: 0},
    {name: "Ada", openSource: 0, href: "https://www.ada.cx/platform/conversational-ai"},
    {name: "Cognigy", openSource: 0, href: "https://www.cognigy.com/products/cognigy-ai"},
    {name: "Ultimate", openSource: 0, href: "https://www.cognigy.com/products/cognigy-ai"},
    //{name: "Sprinklr", href: "https://www.sprinklr.com/platform/"},
];

const maxItemsPerRow = 6;
const numRows = 7;
const numRowsWithContent = 3;
const offsetForRowsWithContent = 2;
const horizontalMargin = 10;
const aspectRatio = 16 / 9;
const backgroundColorHighlight = [247, 255, 238];
const backgroundColorDim = [170, 204, 170];
const borderHighlight = 1.2;
const borderDim = 0;

var numColumns;
var itemWidth;
var itemHeight;
var fontSize;
var globalTop;
var globalLeft;
var itemsWithContent = [];
var itemsWithoutContent = [];
var itemCount = 0;
var title;
var root;

const States = {
    itemsWithContent: 0,
    itemsWithoutContent: 1,
    afterItemsWithoutContent: 2,
    beforeCompare: 3,
    compareOpenSource: 4,
    compareSupportedLanguages: 5
};
var state = States.itemsWithContent;

function start() {
    var pageAspectRatio = document.body.clientWidth / document.body.clientHeight;
    var rootWidth;
    var rootHeight;
    var rootLeft = 0;
    var rootTop = 0;

    if(pageAspectRatio > aspectRatio) {
        rootHeight = document.body.clientHeight;
        rootWidth = rootHeight * aspectRatio;
        rootLeft = (document.body.clientWidth - rootWidth) / 2;
    }
    else {
        rootWidth = document.body.clientWidth;
        rootHeight = rootWidth / aspectRatio;
        rootTop = (document.body.clientHeight - rootHeight) / 2;
    }
    root = document.getElementById("root");
    root.style.width = rootWidth;
    root.style.height = rootHeight;
    root.style.left = rootLeft;
    root.style.top = rootTop;
    itemHeight = rootHeight / (numRows - 1);
    itemWidth = itemHeight;
    fontSize = itemHeight * 0.14;
    numColumns = Math.floor(rootWidth / rootHeight * numRows) + 1;
    offsetForColumnsWithContent = Math.floor((numColumns - maxItemsPerRow) / 2) ;
    globalTop = -itemHeight / 2;
    globalLeft = -itemWidth;

    title = document.getElementById("title");
    title.style.fontSize = itemHeight * 0.2;
    title.style.top = rootHeight - itemHeight * 0.4;
    title.style.left = itemWidth * 0.2;

    prepareComparisonData();
    createItems();

    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceedInState();
        }
        else if(e.key == "PageDown") {
            navigateAcrossStates(1);
        }
        else if(e.key == "PageUp") {
            navigateAcrossStates(-1);
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
        root.appendChild(item);
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
        root.appendChild(item);
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
            navigateAcrossStates(1);
        }
    }
    else if(state == States.itemsWithoutContent) {
        if(itemCount < itemsWithoutContent.length) {
            itemCount++;
        }
        else {
            navigateAcrossStates(1);
        }
    }
    else {
        navigateAcrossStates(1);
    }
    updateScreen();
}

function updateScreen() {
    title.innerHTML = "";
    if(state == States.itemsWithContent) {
        for(let i = 0; i < itemsWithContent.length; i++) {
            resetStyle(itemsWithContent[i]);
            itemsWithContent[i].style.visibility = (i < itemCount) ? 'visible' : 'hidden';
        }
        itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
    }
    else if(state == States.itemsWithoutContent) {
        itemsWithContent.forEach(item => { resetStyle(item); });
        for(let i = 0; i < itemsWithoutContent.length; i++) {
            itemsWithoutContent[i].style.visibility = (i < itemCount) ? 'visible' : 'hidden';
        }
    }
    else if(state == States.afterItemsWithoutContent) {
        itemsWithContent.forEach(item => { resetStyle(item); });
        itemsWithoutContent.forEach(item => { item.style.visibility = 'visible'; });
    }
    else if(state == States.beforeCompare) {
        itemsWithContent.forEach(item => { resetStyle(item); });
        itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
    }
    else if(state == States.compareOpenSource) {
        applyComparison("openSource", "Open source");
    }
    else if(state == States.compareSupportedLanguages) {
        applyComparison("languagesRelative", "Supported languages");
    }
}

function resetStyle(item) {
    item.style.border = "";
    item.style.backgroundColor = "";
    item.style.visibility = 'visible';
    item.style.color = "";
    item.style.textShadow = "";
}

function applyComparison(propertyName, titleText) {
    for(let i = 0; i < nlusInfo.length; i++) {
        var nluInfo = nlusInfo[i];
        var item = itemsWithContent[i];
        var value = nluInfo[propertyName];
        resetStyle(item);
        if(isNaN(value)) {
            item.style.color = "transparent";
            item.style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
        }
        else {
            item.style.border = borderDim + (borderHighlight - borderDim) * value + 'mm solid #ee2';
            item.style.backgroundColor = backgroundColor(value);
        }
    }
    itemsWithoutContent.forEach(item => { item.style.visibility = 'hidden'; });
    title.innerHTML = titleText;
}

function backgroundColor(value) {
    function interpolateComponent(index) {
        return backgroundColorDim[index] + Math.round(
            backgroundColorHighlight[index] - backgroundColorDim[index]) * value;
    }
    const r = interpolateComponent(0);
    const g = interpolateComponent(1);
    const b = interpolateComponent(2);
    return "rgb(" + r + "," + g + "," + b + ")";
}

function navigateAcrossStates(delta) {
    const newState = Math.min(Math.max(0, state + delta), Object.entries(States).length - 1);
    if(newState != state) {
        state = newState;
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

function prepareComparisonData() {
    function setRelativeValues(absolutePropertyName, relativePropertyName) {
        const absoluteValues = nlusInfo.map(item => item[absolutePropertyName]).filter(item => item);
        const absoluteMax = absoluteValues.reduce((a, b) => Math.max(a, b), 0);
        nlusInfo.forEach(item => { item[relativePropertyName] = item[absolutePropertyName] / absoluteMax});
    }
    setRelativeValues("languages", "languagesRelative");
}
