import { SVGPathData } from "svg-pathdata";

// This plugin creates 5 rectangles on the screen.
const numberOfRectangles = 5;

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

type Rectangle = [x: number, y: number, width: number, height: number];

function parseRectPathData(data: string): Rectangle | null {
  const commands = SVGPathData.parse(data);
  if (
    commands.length === 6 &&
    commands[0].type === SVGPathData.MOVE_TO &&
    commands[1].type === SVGPathData.LINE_TO &&
    commands[2].type === SVGPathData.LINE_TO &&
    commands[3].type === SVGPathData.LINE_TO &&
    commands[4].type === SVGPathData.LINE_TO &&
    commands[5].type === SVGPathData.CLOSE_PATH
  ) {
    const width = commands[2].x;
    const height = commands[2].y;
    return [commands[0].x, commands[1].y, width, height];
  }
  console.log(commands);
  return null;
}

function traverseNode(node: SceneNode) {
  if (node.type === "GROUP" || node.type === "FRAME") {
    traverseNodes(node.children);
  }
  if (node.type === "VECTOR" && node.vectorPaths.length === 1) {
    const rect = parseRectPathData(node.vectorPaths[0].data);
    if (rect !== null) {
      const [x, y, width, height] = rect;
      const rectNode = figma.createRectangle();
      rectNode.x = node.x;
      rectNode.y = node.y;
      rectNode.resize(width, height);
      rectNode.fills = node.fills;
      rectNode.strokeWeight = node.strokeWeight;
      rectNode.strokeMiterLimit = node.strokeMiterLimit;
      rectNode.strokeAlign = node.strokeAlign;
      rectNode.strokeCap = node.strokeCap;
      rectNode.strokeJoin = node.strokeJoin;
      rectNode.strokes = node.strokes;
      rectNode.effects = node.effects;
      const index = node.parent.children.findIndex((t) => t === node);
      (node.parent ?? figma.currentPage).insertChild(index, rectNode);
      node.remove();
    }
  }
}

function traverseNodes(nodes: readonly SceneNode[]) {
  for (const node of nodes) {
    traverseNode(node);
  }
}

traverseNodes(figma.currentPage.selection.slice());

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
