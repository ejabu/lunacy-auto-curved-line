var onRun = function (context) {
  var sketch = require("sketch/dom");
  var UI = require("sketch/ui");

  main();

  function main() {
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
  }

  function validateLayer(layer) {
    if (layer.shapeType != "Custom") {
      return false;
    }
    if (layer.points.length != 3) {
      UI.message("Only arrows consist of three point will be processed");
      return false;
    }
    return true;
  }

  function processLayer(layer) {
    if (!validateLayer(layer)) {
      return;
    } else {
      let quadranPoints = layer.points.map(getQuadrant);
      let newCoor = makeNewPoint(quadranPoints[1]);
      const newPoint = {
        type: "CurvePoint",
        point: newCoor,
        curveFrom: newCoor,
        curveTo: newCoor,
        cornerRadius: 30.0,
        pointType: "Straight",
      };
      const newPoints = [layer.points[0], newPoint, layer.points[2]];
      layer.points = newPoints;
    }
  }

  function makeNewPoint(p1) {
    if (p1 == 1) {
      return {
        x: 0.0,
        y: 1.0,
      };
    } else if (p1 == 3) {
      return {
        x: 1.0,
        y: 0.0,
      };
    }
    return false;
  }

  function classifyPoint(point) {
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

  function getQuadrant(point) {
    if (point.type != "CurvePoint") {
      return;
    } else {
      let quadran = classifyPoint(point.point);
      return quadran;
    }
  }
};
