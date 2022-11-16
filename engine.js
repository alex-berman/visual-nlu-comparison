const nlusInfo = [
    {name: "Rasa"},
    {name: "Snips"},
];

var displayedItems = [];

function start() {
    document.addEventListener("keydown", function(e) {
        e = e || window.event;
        if(e.key == "ArrowRight") {
            proceed();
        }
    });
}

function proceed() {
    console.log("proceed");
    if(displayedItems.length < nlusInfo.length) {
        var nluCount = displayedItems.length;
        var item = createItem(nlusInfo[nluCount]);
        document.body.appendChild(item);
        displayedItems.push(item);
    }
}

function createItem(nlu) {
    var item = document.createElement("div");
    item.className = "item";
    item.innerHTML = nlu.name;
    return item;
}