function htmlCollectionToArray(htmlCollection) {
    const array = [];
    for (let i = 0; i < htmlCollection.length; i++) {
        array.push(htmlCollection[i]);
    }
    return array;
}

function getElementsByClassNameArray(className) {
    return htmlCollectionToArray(document.getElementsByClassName(className));
}
