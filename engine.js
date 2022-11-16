const nlus = [
    "Rasa",
    "Snips",
];

function start() {
    var nlu = createItem(nlus[0]);
    document.body.appendChild(nlu);

    nlu = createItem(nlus[1]);
    document.body.appendChild(nlu);
}

function createItem(title) {
    var item = document.createElement("div");
    item.className = "item";
    item.innerHTML = title;
    return item;
}