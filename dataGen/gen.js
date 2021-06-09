fs = require('fs');
let eventImages = ['eventA.png', 'eventB.png'];
let personImages = ['m1', 'm2', 'm3', 'm4', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6'];
let idenImages = ['supervised_user_circle', 'work', 'timeline'];
let names = [
    { f: 'Manny', l: 'Otto' },
    { f: 'Zack', l: 'Haven' },
    { f: 'Archie', l: 'Ramirez' },
    { f: 'Darryl', l: 'Hammond' },
    { f: 'Philis', l: 'Lyn' },
    { f: 'Lisa', l: 'Everlee' },
    { f: 'Breana', l: 'Alyse' },
    { f: 'Jan', l: 'King' },
    { f: 'Cathy', l: 'Ingram' },
    { f: 'Kellie', l: 'Maldonado' },
];

function randomFromArray(arr) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

options = {
    event: {
        count: 10,
    },
    person: {
        rangePerNode: [5, 10],
        sharedRange: [1, 3],
        sharedPercent: 0.2,
    },
    identifier: {
        rangePerNode: [5, 10],
        sharedRange: [1, 2],
        sharedPercent: 0.4,
    },
};

function randomNumInRange(start, end) {
    return Math.floor(Math.random() * (end + 1 - start) + start);
}

function getOtherParent(parentId, parentTotal, childOptions) {
    let newParents = [];
    if (Math.random() <= childOptions.sharedPercent) {
        let edgeCount = randomNumInRange(childOptions.sharedRange[0], childOptions.sharedRange[1]);

        for (let i = 0; i < edgeCount; i++) {
            let newParent = Math.floor(Math.random() * parentTotal);

            while (newParent == parentId || newParents.includes(newParent)) {
                newParent = Math.floor(Math.random() * parentTotal);
            }
            newParents.push(newParent);
        }
    }
    return newParents;
}

function pushNodes(type, count, eles) {
    let img;
    let personCount = -1;
    let transactionType,
        longSum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere.',
        shortSum = 'Lorem ipsum.';

    for (let i = 0; i < count; i++) {
        if (type == 'event') {
            img = 'event';
            transactionType = 'Event';
        } else if (type == 'person') {
            personCount++;
            img = personImages[personCount];
            shortSum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            longSum =
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sapien ante, tristique nec.';
        } else if (type == 'identifier') {
            img = randomFromArray(idenImages);
            if (img == 'supervised_user_circle') transactionType = 'Meeting';
            else if (img == 'work') transactionType = 'Exchange';
            else transactionType = 'Timeline';
        }
        eles.push({
            group: 'nodes',
            data: {
                id: `ele-${type}-${i}`,
                type: type,
                icon: `${img}`,
                image: `./images/${img}.png`,
                shortName: personCount >= 0 ? names[personCount].l : undefined,
                identifierTitle: transactionType,
                longName:
                    personCount >= 0
                        ? names[personCount].f + ' ' + names[personCount].l
                        : undefined,
                shortSum: shortSum,
                longSum: longSum,
            },
        });
    }
}

function getChildNum(destOptions) {
    return randomNumInRange(destOptions.rangePerNode[0], destOptions.rangePerNode[1]);
}

function createEdge(srcType, srcNum, destType, destNum, eles) {
    eles.push({
        group: 'edges',
        data: {
            source: `ele-${srcType}-${srcNum}`,
            target: `ele-${destType}-${destNum}`,
        },
    });
}

function createEdges(srcType, srcArr, destType, destArr, eles) {
    let srcLength = srcArr.length;

    for (let i = 0; i < srcLength; i++) {
        createEdge(srcType, srcArr[i], destType, destArr[i], eles);
    }
}

function pushEdges(srcType, srcCount, destType, destOptions, eles) {
    let srcArr = [];
    let destArr = [];
    let srcEdge = [];
    let destEdge = [];
    let otherParents = [];
    let childId = 0;

    for (let i = 0; i < srcCount; i++) {
        let childNum = getChildNum(destOptions);
        for (let j = 0; j < childNum; j++) {
            srcArr.push(i);
            destArr.push(childId);

            let otherParents = getOtherParent(i, srcCount, destOptions);
            for (let k = 0; k < otherParents.length; k++) {
                srcEdge.push(otherParents[k]);
                destEdge.push(childId);
            }
            childId++;
        }
    }
    pushNodes(destType, destArr.length, eles);
    createEdges(srcType, srcArr, destType, destArr, eles);
    createEdges(srcType, srcEdge, destType, destEdge, eles);
    return childId;
}

function generateElements(options) {
    let eles = [];
    let childCount;

    pushNodes('person', options.event.count, eles);
    childCount = pushEdges('person', options.event.count, 'event', options.person, eles);
    pushEdges('person', options.event.count, 'identifier', options.identifier, eles);

    return eles;
}

for (let i = 0; i < 1; i++) {
    let elements = generateElements(options);

    fs.writeFile(`../src/data.txt`, JSON.stringify(elements), function (err) {
        if (err) return console.log(err);
    });
}
