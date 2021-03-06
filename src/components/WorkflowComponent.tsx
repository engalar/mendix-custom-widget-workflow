import { createElement, useEffect, useRef, useState } from "react";
import { Graph, Shape, Addon } from '@antv/x6'

import { Store } from "../store";
import { useSize, useUpdateEffect } from "ahooks";

export interface WorkflowComponentProps {
    store: Store;
}

export function WorkflowComponent(props: WorkflowComponentProps) {
    console.log(props);
    const graphRef = useRef<any>();
    const wrapperRef = useRef<any>();
    const size = useSize(wrapperRef);
    const [graphInstance, setGraphInstance] = useState<Graph>();

    useEffect(() => {
        const graph = new Graph({
            container: graphRef.current!,
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3,
            },
            connecting: {
                router: {
                    name: 'manhattan',
                    args: {
                        padding: 1,
                    },
                },
                connector: {
                    name: 'rounded',
                    args: {
                        radius: 8,
                    },
                },
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: false,
                snap: {
                    radius: 20,
                },
                createEdge() {
                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: '#A2B1C3',
                                strokeWidth: 2,
                                targetMarker: {
                                    name: 'block',
                                    width: 12,
                                    height: 8,
                                },
                            },
                        },
                        zIndex: 0,
                    })
                },
                validateConnection({ targetMagnet }) {
                    return !!targetMagnet
                },
            },
            highlighting: {
                magnetAdsorbed: {
                    name: 'stroke',
                    args: {
                        attrs: {
                            fill: '#5F95FF',
                            stroke: '#5F95FF',
                        },
                    },
                },
            },
            resizing: true,
            rotating: true,
            selecting: {
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
            },
            snapline: true,
            keyboard: true,
            clipboard: true,
        });
        setGraphInstance(graph);

        const stencil = new Addon.Stencil({
            containerParent: wrapperRef.current,
            title: '?????????',
            target: graph,
            stencilGraphWidth: 200,
            stencilGraphHeight: 180,
            collapsable: true,
            groups: [
                {
                    title: '???????????????',
                    name: 'group1',
                },
                {
                    title: '???????????????',
                    name: 'group2',
                    graphHeight: 250,
                    layoutOptions: {
                        rowHeight: 70,
                    },
                },
            ],
            layoutOptions: {
                columns: 2,
                columnWidth: 80,
                rowHeight: 55,
            },
        });
        wrapperRef.current.prepend(stencil.container);

        // #region ??????????????????
        // copy cut paste
        graph.bindKey(['meta+c', 'ctrl+c'], () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.copy(cells)
            }
            return false
        })
        graph.bindKey(['meta+x', 'ctrl+x'], () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.cut(cells)
            }
            return false
        })
        graph.bindKey(['meta+v', 'ctrl+v'], () => {
            if (!graph.isClipboardEmpty()) {
                const cells = graph.paste({ offset: 32 })
                graph.cleanSelection()
                graph.select(cells)
            }
            return false
        })

        //undo redo
        graph.bindKey(['meta+z', 'ctrl+z'], () => {
            if (graph.history.canUndo()) {
                graph.history.undo()
            }
            return false
        })
        graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
            if (graph.history.canRedo()) {
                graph.history.redo()
            }
            return false
        })

        // select all
        graph.bindKey(['meta+a', 'ctrl+a'], () => {
            const nodes = graph.getNodes()
            if (nodes) {
                graph.select(nodes)
            }
        })

        //delete
        graph.bindKey('backspace', () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.removeCells(cells)
            }
        })

        // zoom
        graph.bindKey(['ctrl+1', 'meta+1'], () => {
            const zoom = graph.zoom()
            if (zoom < 1.5) {
                graph.zoom(0.1)
            }
        })
        graph.bindKey(['ctrl+2', 'meta+2'], () => {
            const zoom = graph.zoom()
            if (zoom > 0.5) {
                graph.zoom(-0.1)
            }
        })

        // ?????????????????????/??????
        const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
            for (let i = 0, len = ports.length; i < len; i = i + 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden'
            }
        }
        graph.on('node:mouseenter', () => {
            const container = graphRef.current!
            const ports = container.querySelectorAll(
                '.x6-port-body',
            ) as NodeListOf<SVGElement>
            showPorts(ports, true)
        })
        graph.on('node:mouseleave', () => {
            const container = graphRef.current!;
            const ports = container.querySelectorAll(
                '.x6-port-body',
            ) as NodeListOf<SVGElement>
            showPorts(ports, false)
        })
        // #endregion

        // #region ???????????????
        const ports = {
            groups: {
                top: {
                    position: 'top',
                    attrs: {
                        circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#5F95FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },
                right: {
                    position: 'right',
                    attrs: {
                        circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#5F95FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },
                bottom: {
                    position: 'bottom',
                    attrs: {
                        circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#5F95FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },
                left: {
                    position: 'left',
                    attrs: {
                        circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#5F95FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },
            },
            items: [
                {
                    group: 'top',
                },
                {
                    group: 'right',
                },
                {
                    group: 'bottom',
                },
                {
                    group: 'left',
                },
            ],
        }

        Graph.registerNode(
            'custom-rect',
            {
                inherit: 'rect',
                width: 66,
                height: 36,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
                ports: { ...ports },
            },
            true,
        )

        Graph.registerNode(
            'custom-polygon',
            {
                inherit: 'polygon',
                width: 66,
                height: 36,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
                ports: {
                    ...ports,
                    items: [
                        {
                            group: 'top',
                        },
                        {
                            group: 'bottom',
                        },
                    ],
                },
            },
            true,
        )

        Graph.registerNode(
            'custom-circle',
            {
                inherit: 'circle',
                width: 45,
                height: 45,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
                ports: { ...ports },
            },
            true,
        )

        Graph.registerNode(
            'custom-image',
            {
                inherit: 'rect',
                width: 52,
                height: 52,
                markup: [
                    {
                        tagName: 'rect',
                        selector: 'body',
                    },
                    {
                        tagName: 'image',
                    },
                    {
                        tagName: 'text',
                        selector: 'label',
                    },
                ],
                attrs: {
                    body: {
                        stroke: '#5F95FF',
                        fill: '#5F95FF',
                    },
                    image: {
                        width: 26,
                        height: 26,
                        refX: 13,
                        refY: 16,
                    },
                    label: {
                        refX: 3,
                        refY: 2,
                        textAnchor: 'left',
                        textVerticalAnchor: 'top',
                        fontSize: 12,
                        fill: '#fff',
                    },
                },
                ports: { ...ports },
            },
            true,
        )

        const r1 = graph.createNode({
            shape: 'custom-rect',
            label: '??????',
            attrs: {
                body: {
                    rx: 20,
                    ry: 26,
                },
            },
        })
        const r2 = graph.createNode({
            shape: 'custom-rect',
            label: '??????',
        })
        const r3 = graph.createNode({
            shape: 'custom-rect',
            attrs: {
                body: {
                    rx: 6,
                    ry: 6,
                },
            },
            label: '????????????',
        })
        const r4 = graph.createNode({
            shape: 'custom-polygon',
            attrs: {
                body: {
                    refPoints: '0,10 10,0 20,10 10,20',
                },
            },
            label: '??????',
        })
        const r5 = graph.createNode({
            shape: 'custom-polygon',
            attrs: {
                body: {
                    refPoints: '10,0 40,0 30,20 0,20',
                },
            },
            label: '??????',
        })
        const r6 = graph.createNode({
            shape: 'custom-circle',
            label: '??????',
        })
        stencil.load([r1, r2, r3, r4, r5, r6], 'group1')

        const imageShapes = [
            {
                label: 'Client',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg',
            },
            {
                label: 'Http',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
            },
            {
                label: 'Api',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg',
            },
            {
                label: 'Sql',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg',
            },
            {
                label: 'Clound',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg',
            },
            {
                label: 'Mq',
                image:
                    'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg',
            },
        ]
        const imageNodes = imageShapes.map((item) =>
            graph.createNode({
                shape: 'custom-image',
                label: item.label,
                attrs: {
                    image: {
                        'xlink:href': item.image,
                    },
                },
            }),
        )
        stencil.load(imageNodes, 'group2')
        // #endregion

        // #region ?????????/????????????
        graph.fromJSON({
            "cells": [
                {
                    "position": {
                        "x": 410,
                        "y": 120
                    },
                    "size": {
                        "width": 66,
                        "height": 36
                    },
                    "attrs": {
                        "text": {
                            "text": "??????"
                        },
                        "body": {
                            "rx": 20,
                            "ry": 26
                        }
                    },
                    "shape": "custom-rect",
                    "ports": {
                        "groups": {
                            "top": {
                                "position": "top",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "right": {
                                "position": "right",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "bottom": {
                                "position": "bottom",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "left": {
                                "position": "left",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            }
                        },
                        "items": [
                            {
                                "group": "top",
                                "id": "19469c2c-11ff-4935-8903-8ae7ca42d4a1"
                            },
                            {
                                "group": "right",
                                "id": "66434f9b-0f15-42d5-8c0b-1b0d50ae52d6"
                            },
                            {
                                "group": "bottom",
                                "id": "9db27bb0-e39e-4630-8750-8fb1089d8b49"
                            },
                            {
                                "group": "left",
                                "id": "6feb4ee8-5221-45bc-924a-2d08b23f20c7"
                            }
                        ]
                    },
                    "id": "328a52ee-acc4-4f78-88f6-6a56eb9fa991",
                    "zIndex": 1
                },
                {
                    "position": {
                        "x": 290,
                        "y": 240
                    },
                    "size": {
                        "width": 66,
                        "height": 36
                    },
                    "attrs": {
                        "text": {
                            "text": "????????????"
                        },
                        "body": {
                            "rx": 6,
                            "ry": 6
                        }
                    },
                    "shape": "custom-rect",
                    "ports": {
                        "groups": {
                            "top": {
                                "position": "top",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "right": {
                                "position": "right",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "bottom": {
                                "position": "bottom",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "left": {
                                "position": "left",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            }
                        },
                        "items": [
                            {
                                "group": "top",
                                "id": "105a804b-5bcd-438c-b694-3acc621e9000"
                            },
                            {
                                "group": "right",
                                "id": "14edd428-5b3b-414b-acd4-5dd43d274a3c"
                            },
                            {
                                "group": "bottom",
                                "id": "ef9c6b45-8ffc-45c9-9434-ae4e7b58a671"
                            },
                            {
                                "group": "left",
                                "id": "c8965df1-59bb-4af3-a58c-9408b41a2e7a"
                            }
                        ]
                    },
                    "id": "c032ba51-a7eb-4257-be4c-b2159bfa4cf5",
                    "zIndex": 2
                },
                {
                    "position": {
                        "x": 550,
                        "y": 240
                    },
                    "size": {
                        "width": 66,
                        "height": 36
                    },
                    "attrs": {
                        "text": {
                            "text": "??????"
                        },
                        "body": {
                            "refPoints": "10,0 40,0 30,20 0,20"
                        }
                    },
                    "shape": "custom-polygon",
                    "ports": {
                        "groups": {
                            "top": {
                                "position": "top",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "right": {
                                "position": "right",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "bottom": {
                                "position": "bottom",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            },
                            "left": {
                                "position": "left",
                                "attrs": {
                                    "circle": {
                                        "r": 4,
                                        "magnet": true,
                                        "stroke": "#5F95FF",
                                        "strokeWidth": 1,
                                        "fill": "#fff",
                                        "style": {
                                            "visibility": "hidden"
                                        }
                                    }
                                }
                            }
                        },
                        "items": [
                            {
                                "group": "top",
                                "id": "c42d82c0-3b9a-44b1-886c-c4266c630897"
                            },
                            {
                                "group": "bottom",
                                "id": "67064c25-92e7-4c6b-be89-72dc6683e22d"
                            }
                        ]
                    },
                    "id": "34a71a9e-cacd-42f3-9395-34115de1017c",
                    "zIndex": 3
                },
                {
                    "shape": "edge",
                    "attrs": {
                        "line": {
                            "stroke": "#A2B1C3",
                            "targetMarker": {
                                "name": "block",
                                "width": 12,
                                "height": 8
                            }
                        }
                    },
                    "id": "e3b88c99-5abd-4617-8156-82b876c7f4ad",
                    "zIndex": 0,
                    "source": {
                        "cell": "328a52ee-acc4-4f78-88f6-6a56eb9fa991",
                        "port": "9db27bb0-e39e-4630-8750-8fb1089d8b49"
                    },
                    "target": {
                        "cell": "c032ba51-a7eb-4257-be4c-b2159bfa4cf5",
                        "port": "105a804b-5bcd-438c-b694-3acc621e9000"
                    }
                }
            ]
        });


        const parse = () => {
            const data = JSON.stringify(graph.toJSON(), null, 2);
            console.dir(data);
        }

        parse()

        graph.on('cell:change:*', parse);
        // #endregion


    }, []);

    useUpdateEffect(() => {
        if (graphInstance) {
            graphInstance.resize(size.width! - 180, size.height);
        }
    }, [size, graphInstance]);

    return <div className="mxcn-resize-wrapper" ref={wrapperRef}>
      <div className="mxcn-resize" ref={graphRef}></div>
    </div>;
}
