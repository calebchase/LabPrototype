import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu';

import { register as trilayer } from 'cytoscape-trilayer';
import { register as htmlnode } from 'cytoscape-html-node';

import nodeData from './data.txt';

cytoscape.use(fcose);
cytoscape.use(cxtmenu);
cytoscape.use(trilayer);
cytoscape.use(htmlnode);

function setEdgesTaxi(cy, set, connectedEles) {
    set.forEach((node) => {
        connectedEles[node].edges.forEach((ele) => {
            if (ele.isEdge()) {
                ele.style({
                    'curve-style': 'taxi',
                });
            }
        });
    });
}

function resetEles(eles) {
    eles.forEach((ele) => {
        if (ele.isEdge()) {
            ele.data('_taxiSet', undefined);
            ele.style({
                'curve-style': 'straight',
                'control-point-distances': '',
                'control-point-weights': '',
            });
        }
    });
}

function addNodesFromSet(cy, set, connectedEles) {
    set.forEach((node) => {
        resetEles(connectedEles[node].edges);
    });
    set.forEach((node) => {
        cy.add(connectedEles[node].nodes);
        cy.add(connectedEles[node].edges);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var cy = (window.cy = cytoscape({
        container: document.getElementById('cy'),
        autounselectify: 'true',
        style: [
            {
                selector: 'node',
                css: {
                    content: ' ',
                },
                style: {
                    content: '',
                    'background-color': 'lightgrey',
                    shape: 'round-rectangle',
                    width: 100,
                    height: 100,
                },
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                },
            },
            {
                selector: '.person',
                style: {
                    'background-color': 'blue',
                },
            },
            {
                selector: '.redLine',
                style: {
                    'z-index': 3,
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    width: 10,
                },
            },
            {
                selector: '.htmlNodeBaseStyle',
                style: {
                    'background-color': 'lightgrey',
                },
            },

            {
                selector: '.htmlNodeAltStylePerson',
                style: {
                    'background-color': 'darkblue',
                },
            },
            {
                selector: '.htmlNodeAltStyleEvent',
                style: {
                    'background-color': 'darkred',
                },
            },
            {
                selector: '.htmlNodeAltStyleIden',
                style: {
                    'background-color': 'darkgreen',
                },
            },
        ],
        elements: {
            nodes: [],
            edges: [],
        },
    }));

    const htmlnode = cy.htmlnode();
    htmlnode.createHtmlNode(cytoscape, cy, {
        person: {
            query: "[type = 'person']",
            nodeStyle: {
                base: 'htmlNodeBaseStyle',
                alt: 'htmlNodeAltStylePerson',
            },
            template: [
                {
                    zoomRange: [0.2, 1],

                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="">
                      <div class=" largeFont">#{data.longName}</div>
                      <img src="#{data.image}" loading="lazy">
                    </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
                {
                    zoomRange: [1, 2.5],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="cardField">
                      <div class="cardField">
                        <i class="material-icons iconHeight">person</i>
                        <span class="">#{data.shortName}</span>
                      </div>
                      <img src="#{data.image}" loading="lazy">

                      <div class="">#{data.shortSum}</div>
                    </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
                {
                    zoomRange: [2.5, 100],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="cardField">
                      <div class="cardField">
                        <i class="material-icons iconHeight smallFont">person</i>
                        <span class="smallFont">#{data.longName}</span>
                      </div>
                      <img src="#{data.image}" loading="lazy">
                      <div class="smallFont">#{data.longSum}</div>
                    </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
            ],
        },

        event: {
            query: "[type = 'event']",
            nodeStyle: {
                base: 'htmlNodeBaseStyle',
                alt: 'htmlNodeAltStyleEvent',
            },
            template: [
                {
                    zoomRange: [0.2, 1],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div class="largeFont">#{data.identifierTitle}</div>
                      <i style="color:darkred;"class="material-icons font">#{data.icon}</i>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
                {
                    zoomRange: [1, 2.5],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div>#{data.identifierTitle}</div>
                      <i style="color:darkred;" class="material-icons font">#{data.icon}</i>
                      <div>#{data.shortSum}</div>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
                {
                    zoomRange: [2.5, 100],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div>
                        <i style="color:darkred;" class="material-icons iconHeight smallFont">#{data.icon}</i>
                        <span class="smallFont cardField">#{data.identifierTitle}</span>
                      </div>
                      
                      <div class="smallFont">#{data.longSum}</div>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
            ],
        },

        identifier: {
            query: "[type = 'identifier']",
            nodeStyle: {
                base: 'htmlNodeBaseStyle',
                alt: 'htmlNodeAltStyleIden',
            },
            template: [
                {
                    zoomRange: [0.2, 1],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div class="largeFont">#{data.identifierTitle}</div>
                      <i style="color:darkgreen;"class="material-icons font">#{data.icon}</i>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
                {
                    zoomRange: [1, 2.5],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div>#{data.identifierTitle}</div>
                      <i style="color:darkgreen;" class="material-icons font">#{data.icon}</i>
                      <div>#{data.shortSum}</div>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
                {
                    zoomRange: [2.5, 100],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" >
                      <div>
                        <i style="color:darkgreen;" class="material-icons iconHeight smallFont">#{data.icon}</i>
                        <span class="smallFont cardField">#{data.identifierTitle}</span>
                      </div>
                      
                      <div class="smallFont">#{data.longSum}</div>
                    </div>`,
                        cssClass: 'htmlidentifier',
                    },
                },
            ],
        },
    });

    let elements = cy.add(JSON.parse(nodeData));
    let idNamePair = {};

    let connectedEles = {};
    elements.forEach((ele) => {
        if (ele.data('type') == 'person') {
            connectedEles[ele.id()] = {};
            connectedEles[ele.id()].edges = ele.connectedEdges();
            connectedEles[ele.id()].nodes = ele.connectedEdges().connectedNodes();
            idNamePair[ele.id()] = ele.data('shortName');
        }
    });

    cy.remove(elements);

    let options = {
        name: 'trilayer',
        horizontalNodeOffset: 150,
        verticalNodeOffset: 125,
        parentToChildSpacing: 120,

        // Offset for shared nodes that are placed on the same level in taxi section of graph
        horizontalSharedOffset: 150,

        // Querey can be any cytoscape query
        parentQuery: 'node[type = "person"]',
        childAQuery: 'node[type = "identifier"]',
        childBQuery: 'node[type = "event"]',
    };

    let keys = [];
    let i = 0;
    for (let key in connectedEles) {
        keys.push(key);
    }

    let nodeSet = new Set();
    function onClickButton(id) {
        if (nodeSet.has(id)) {
            nodeSet.delete(id);
            document.getElementById(id).classList.remove('selected');

            if (nodeSet.size == 0) return;
        } else {
            nodeSet.add(id);
            let targetHtml = document.getElementById(id);
            console.log(targetHtml);

            document.getElementById(id).classList.add('selected');
        }

        cy.remove(elements);
        elements = cy.add(JSON.parse(nodeData));

        connectedEles = {};
        elements.forEach((ele) => {
            if (ele.data('type') == 'person') {
                connectedEles[ele.id()] = {};
                connectedEles[ele.id()].edges = ele.connectedEdges();
                connectedEles[ele.id()].nodes = ele.connectedEdges().connectedNodes();
            }
        });

        cy.remove(elements);

        addNodesFromSet(cy, nodeSet, connectedEles);

        cy.layout(options).run();
    }

    for (let i = 0; i < 10; i++) {
        let targetId = `ele-person-${i}`;
        document.getElementById(targetId).innerText = idNamePair[targetId];
        document.getElementById(targetId).onclick = () => onClickButton(targetId);
    }

    cy.cxtmenu({
        selector: 'core',
        commands: [
            {
                content: 'Add Node',
                select: function () {
                    onClickButton();
                },
            },
        ],
    });

    cy.on('mouseover', 'node', function (evt) {
        evt.target.connectedEdges().forEach((edge) => {
            edge.addClass('redLine');
        });
    });

    cy.on('mouseout', 'node', function (evt) {
        evt.target.connectedEdges().forEach((edge) => {
            edge.removeClass('redLine');
        });
    });
});
