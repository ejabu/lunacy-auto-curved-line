var onRun = function(context) {
function validateLayer(layer) {
  if (layer.shapeType != "Custom") {
    return false;
  }
  if (layer.points.length != 2) {
    UI.message("Only arrows consist of two point will be processed");
    return false;
  }
  return true;
}

function processLayer(layer) {
  if (!validateLayer(layer)) {
    return;
  } else {
    let quadranPoints = layer.points.map(processPoint);
    let newCoor = makeNewPoint(quadranPoints[0], quadranPoints[1]);
    if (!newCoor) {
      UI.message("Only diagonal arrows will be processed");
      return;
    }
    const newPoint = {
      type: "CurvePoint",
      point: newCoor,
      curveFrom: newCoor,
      curveTo: newCoor,
      cornerRadius: 30.0,
      pointType: "Straight",
    };
    const newPoints = [layer.points[0], newPoint, layer.points[1]];
    layer.points = newPoints;
  }
}

function makeNewPoint(p1, p2) {
  if ((p1 == 1 && p2 == 3) || (p1 == 3 && p2 == 1)) {
    return {
      x: 0.0,
      y: 0.0,
    };
  } else if ((p1 == 2 && p2 == 4) || (p1 == 4 && p2 == 2)) {
    return {
      x: 1.0,
      y: 0.0,
    };
  }
  return false;
}
function getQuadran(point) {
  if (point.x == 1 && point.y == 0) {
    return 1;
  } else if (point.x == 1 && point.y == 1) {
    return 2;
  } else if (point.x == 0 && point.y == 1) {
    return 3;
  } else if (point.x == 0 && point.y == 0) {
    return 4;
  }
}

function processPoint(point) {
  if (point.type != "CurvePoint") {
    return;
  } else {
    let quadran = getQuadran(point.point);
    return quadran;
  }
}

var sketch = require("sketch");
var UI = require("sketch/ui");
var document = sketch.getSelectedDocument();

var selectedLayers = document.selectedLayers;

if (selectedLayers.length < 1) {
  UI.alert(
    "Curved line creation Error",
    "Please select some line(s) or arrow(s)"
  );
} else {
  selectedLayers.layers.forEach(processLayer);
}

};