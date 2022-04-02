var makerjs = require('makerjs');

export class Window {
  static drawTWindow() {
    let tWindowOutline = {};
    let tWindowContainer = {};
    let tWindowPoints = [
      [400, 120],
      [400, -120],
      [-400, -120],
      [-400, 120],
    ];
    tWindowOutline[0] = new makerjs.models.ConnectTheDots(true, tWindowPoints);
    tWindowOutline[1] = new makerjs.paths.Line([
      [400, 0],
      [-400, 0],
    ]);
    tWindowContainer = {
      models: {
        tWindowOutlineM: tWindowOutline[0],
      },
      paths: {
        tWindowOutlineP: tWindowOutline[1],
      },
    };
    return tWindowContainer;
  }
  static drawGroundWindow() {
    let GroundWindowOutline = {};
    let GroundWindowContainer = {};
    let GroundWindowPoints1 = [
      [-750, 120],
      [750, 120],
      [750, -120],
      [-750, -120],
    ];
    let GroundWindowPoints2 = [
      [-750, 40],
      [750, 40],
      [750, -40],
      [-750, -40],
    ];
    GroundWindowOutline[0] = new makerjs.models.ConnectTheDots(true, GroundWindowPoints1);
    GroundWindowOutline[1] = new makerjs.paths.Line([
      [-750, 0],
      [750, 0],
    ]);
    GroundWindowOutline[2] = new makerjs.models.ConnectTheDots(true, GroundWindowPoints2);
    GroundWindowOutline[3] = new makerjs.paths.Line([
      [0, 40],
      [0, -40],
    ]);
    GroundWindowContainer = {
      models: {
        GroundWindowOutlineM1: GroundWindowOutline[0],
        GroundWindowOutlineM2: GroundWindowOutline[2],
      },
      paths: {
        GroundWindowOutlineP1: GroundWindowOutline[1],
        GroundWindowOutlineP2: GroundWindowOutline[3],
      },
    };
    return GroundWindowContainer;
  }
  tflutter_window
  static drawFlutterWindow() {
    let GroundWindowOutline = {};
    let GroundWindowContainer = {};
    let GroundWindowPoints = [
      [-750, 500],
      [750, 500],
      [750, 0],
      [-750, 0],
    ];
    GroundWindowOutline[0] = new makerjs.models.ConnectTheDots(true, GroundWindowPoints);
    GroundWindowOutline[1] = new makerjs.paths.Line([
      [-750, 240],
      [-990, 240],
    ]);
    GroundWindowOutline[2] = new makerjs.paths.Line([
      [-990, 240],
      [-990, 740],
    ]);
    GroundWindowOutline[3] = new makerjs.paths.Line([
      [-990, 740],
      [990, 740],
    ]);
    GroundWindowOutline[4] = new makerjs.paths.Line([
      [990, 740],
      [990, 240],
    ]);
    GroundWindowOutline[5] = new makerjs.paths.Line([
      [990, 240],
      [750, 240],
    ]);
    GroundWindowOutline[6] = new makerjs.paths.Line([
      [-870, 240],
      [-870, 620],
    ]);
    GroundWindowOutline[7] = new makerjs.paths.Line([
      [-870, 620],
      [870, 620],
    ]);
    GroundWindowOutline[8] = new makerjs.paths.Line([
      [870, 620],
      [870, 240],
    ]);
    GroundWindowContainer = {
      models: {
        GroundWindowOutlineM1: GroundWindowOutline[0],
      },
      paths: {
        GroundWindowOutlineP1: GroundWindowOutline[1],
        GroundWindowOutlineP2: GroundWindowOutline[2],
        GroundWindowOutlineP3: GroundWindowOutline[3],
        GroundWindowOutlineP4: GroundWindowOutline[4],
        GroundWindowOutlineP5: GroundWindowOutline[5],
        GroundWindowOutlineP6: GroundWindowOutline[6],
        GroundWindowOutlineP7: GroundWindowOutline[7],
        GroundWindowOutlineP8: GroundWindowOutline[8],
      },
    };
    return GroundWindowContainer;
  }
}
