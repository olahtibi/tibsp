
function printLine(content) {
    return printLineC(null, content);
}

function printLineC(color, content) {
    var newSpan = document.createElement('span');
    if(color != null) {
        newSpan.setAttribute('style', 'color: ' + color + ';');
    }
    newSpan.appendChild(document.createTextNode(content));
    document.getElementById('screen').appendChild(newSpan);
    document.getElementById('screen').appendChild(document.createTextNode('\n'));
    return null;
}

function listToStr(list) {
    var str = "";
    str += "(";
    for(var i = 0; i < list.length; i++) {
        var node = list[i];
        str += (i > 0 ? " " : "");
        if(Array.isArray(node)) {
            str += listToStr(node);
        }
        else {
            str += node;
        }
    }
    str += ")";
    return str;
}

tibsp.defaultScope.map["print"] = printLine;
tibsp.defaultScope.map["printc"] = function(list) {
    return printLineC(list[0][0], list[0][1]);
};
tibsp.defaultScope.map["printl"] = function(list) {
    printLine(listToStr(list));
};
