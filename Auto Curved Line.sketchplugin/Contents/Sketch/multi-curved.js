var onRun = function (context) {
  var sketch = require("sketch/dom");
  var Settings = require("sketch/settings");
  var UI = require("sketch/ui");

  UI.getInputFromUser(
    "Setup Borner Radius",
    {
      initialValue: Settings.globalSettingForKey("defaultBorderRadius") || "30",
    },
    (err, value) => {
      if (err) {
        return;
      }
      var borderRadius = parseInt(value);
      if (!borderRadius) {
        UI.alert(
          "Incorrect Border Radius Value ",
          "Please input integer value, e.g 30, 40, 50"
        );
        return;
      }
      if (borderRadius < 0) {
        UI.alert(
          "Incorrect Border Radius Value ",
          "Please input positive integer value, e.g 30, 40, 50"
        );
        return;
      }
      Settings.setGlobalSettingForKey("defaultBorderRadius", value);
      main(borderRadius);
    }
  );

  function main(borderRadiusValue) {
    var document = sketch.getSelectedDocument();
    var selectedLayers = document.selectedLayers;
    if (selectedLayers.length < 1) {
      UI.alert(
        "Curved line creation Error",
        "Please select some line(s) or arrow(s)"
      );
    } else {
      selectedLayers.layers.forEach(
        processLayer.bind({ borderRadiusValue: borderRadiusValue })
      );
    }
  }

  function validateLayer(layer) {
    if (layer.shapeType != "Custom") {
      return false;
    }
    if (layer.points.length <= 2) {
      UI.message("Only arrows consist of multi points will be processed");
      return false;
    }
    return true;
  }

  function processLayer(layer) {
    if (!validateLayer(layer)) {
      return;
    } else {
      layer.points.forEach((item) => {
        item.cornerRadius = this.borderRadiusValue;
      });
    }
  }
};
