import { rotate } from "@jscad/modeling/src/operations/transforms";
import * as THREE from 'three';
var makerjs = require("makerjs");

const io = require("@jscad/io");
const jscad = require("@jscad/modeling");
// 输出dxf方式
import { saveAs } from "file-saver";
// 获取本地静态数据
// 获取本地dxf模板文件
const axios = require("axios");
// 解析本地dxf模板文件
import parse, { DxfParser } from "dxf-parser";
import { Door } from "@/inlays/Door";
import { Tool } from "@/Tool/Tool";

export class DrawData {
  constructor(font ,data) {
    console.log(data)
    this.font = font
    this.data = data;
    this.originPosition = null;
    this.dataArr = {
      models: {
        wallContainer: this.drawWalls(this.data.rooms),
        inlayContainer: this.drawInlays(this.data.inlays),
        wallMarkLineContainer: this.drawWallLineMarks(this.font ,this.data.rooms),
        wallMarkTextContainer: this.drawWallTextMarks(this.font ,this.data.rooms),
        outMarkTextContainer: this.drawOutMarkLine(this.font ,this.data.vertexlist),
      },
    };
    this.scale = 10;

    this.wallContainerMeasure;
    this.inlayContainerMeasure;
  }

  // -------------------- 绘制区域---------------------//

  drawOutMarkLine(tFont, data) {
    let lineArr = data
    // lineArr.push(lineArr[0])
    let outMarkLine = []
    let outMarkLineC = {}
    let outMarkTextContainer = {}
    let outMarkLinePoints = []
    
    let minPoint = new THREE.Vector2(lineArr[0].x, lineArr[0].y)
    let maxPoint = new THREE.Vector2(lineArr[0].x, lineArr[0].y)
    let outMarkLineEdges = []
    for (let i = 0; i < lineArr.length; i++) {
      minPoint = minPoint.min(new THREE.Vector2(lineArr[i].x, lineArr[i].y))
      maxPoint = maxPoint.max(new THREE.Vector2(lineArr[i].x, lineArr[i].y))
      if (i <= lineArr.length - 2) {
        outMarkLineEdges.push(({
          p1: new THREE.Vector2(lineArr[i].x, lineArr[i].y),
          p2: new THREE.Vector2(lineArr[i+1].x, lineArr[i+1].y),
        }))
      }
      if (i === lineArr.length - 1) {
        outMarkLineEdges.push(({
          p1: new THREE.Vector2(lineArr[i].x, lineArr[i].y),
          p2: new THREE.Vector2(lineArr[0].x, lineArr[0].y),
        }))
      }
    }

    outMarkLineEdges.forEach((edges, index) => {
      outMarkLine[index] = new makerjs.models.ConnectTheDots(true, [
        [edges.p1.x, edges.p1.y],
        [edges.p2.x, edges.p2.y],
      ])
      outMarkLine[index].paths.ShapeLine1.layer = 'red'
    })
    outMarkLineC = {
      models: outMarkLine
    }
    let outMarkLineMeasure = new Tool().getSpaceSize(outMarkLineC)
    let edges = []
    outMarkLineEdges.forEach((edge,index) => {
      let normal = new THREE.Vector2().subVectors(edge.p1, edge.p2).normalize()
      // console.log(normal)
      if (Math.round(normal.x * 10) === 10) {
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.low[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.low[1]),
        })
      }
      else if (Math.round(normal.x * 10) === -10) {
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.high[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.high[1]),
        })
      }
      else if (Math.round(normal.y * 10) === 10) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p2.y),
        })
      }
      else if (Math.round(normal.y * 10) === -10) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p2.y),
        })
      }
      if (normal.x > 0 && normal.y > 0) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p2.y),
        })
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.low[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.low[1]),
        })
      }
      else if (normal.x > 0 && normal.y < 0) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p2.y),
        })
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.low[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.low[1]),
        })
      }
      else if (normal.x < 0 && normal.y < 0) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.low[0], edge.p2.y),
        })
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.high[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.high[1]),
        })
      }
      else if (normal.x < 0 && normal.y > 0) {
        edges.push({
          p1: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p1.y),
          p2: new THREE.Vector2(outMarkLineMeasure.high[0], edge.p2.y),
        })
        edges.push({
          p1: new THREE.Vector2(edge.p1.x, outMarkLineMeasure.high[1]),
          p2: new THREE.Vector2(edge.p2.x, outMarkLineMeasure.high[1]),
        })
      }
    })
    for (let j = 0; j < edges.length; j++) {
      console.log(edges[j])

    }
    let bigOutLine = []
    let bigOutLineText = []
    let arrow = []
    // console.log(edges.length)
    edges.forEach((edge, index) => {
      let normal = new THREE.Vector2().subVectors(edge.p1, edge.p2).normalize()
      if (Math.round(normal.x * 10) === 10) {
        edge.p1.y -= 250
        edge.p2.y -= 250
      }
      else if (Math.round(normal.x * 10) === -10) {
        edge.p1.y += 250
        edge.p2.y += 250
      }
      else if (Math.round(normal.y * 10) === 10) {
        edge.p1.x += 250
        edge.p2.x += 250
      }
      else if (Math.round(normal.y * 10) === -10) {
        edge.p1.x -= 250
        edge.p2.x -= 250
      }
      bigOutLine[index] = new makerjs.models.ConnectTheDots(true, [
        [edge.p1.x, edge.p1.y],
        [edge.p2.x, edge.p2.y],
      ])
      bigOutLineText[index] = new Tool().createMarkText(tFont, edge.p1, edge.p2)
      bigOutLine[index].paths.ShapeLine1.layer = 'blue'

      arrow[index] = new Tool().createArrow(edge.p1, edge.p2)
    })
    let arrowC = {
      models: arrow
    }
    let bigOutLineC = {
      models: bigOutLine
    }
    let bigOutLineTextC = {
      models: bigOutLineText
    }
    

    outMarkTextContainer = {
      models: {
        outMarkLineC: outMarkLineC,
        bigOutLineC: bigOutLineC,
        bigOutLineTextC: bigOutLineTextC,
        arrowC: arrowC,
      }
    }
    // let outMarkTextContainerMeasure = new Tool().getSpaceSize(outMarkTextContainer)
    // new makerjs.model.zero(outMarkTextContainer, true, true);
    new makerjs.model.center(outMarkTextContainer, true, true);
    return outMarkTextContainer
  }


  drawWallLineMarks(tFont, rooms) {
    let wallMarkLine = {};
    let wallMarkLineC = {};
    let wallMarkLineContainer = {};
    rooms.forEach((room) => {
      room.walls.forEach((wall) => {
        const { inPoint1, inPoint2, outPoint1, outPoint2 } = wall
        let angle = new Tool().getCenterPonitAndAngle(outPoint1, outPoint2).angle
        let inP1 = new THREE.Vector2(inPoint1.x, inPoint1.y)
        let inP2 = new THREE.Vector2(inPoint2.x, inPoint2.y)
        let inEdgeLength = inP1.distanceTo(inP2)
        let outP1 = new THREE.Vector2(outPoint1.x, outPoint1.y)
        let outP2 = new THREE.Vector2(outPoint2.x, outPoint2.y)
        let outEdgeLength = outP1.distanceTo(outP2)
        if (inEdgeLength > outEdgeLength) {
          wallMarkLine['Line-' + wall.hash] = new Tool().createMarkLine(tFont, inPoint1, inPoint2)
          // wallMarkLine['LineArrow-' + wall.hash] = new Tool().createMarkLineArrow(tFont, inPoint1, inPoint2)
        }else {
          wallMarkLine['Line-' + wall.hash] = new Tool().createMarkLine(tFont, outPoint1, outPoint2)
          // wallMarkLine['LineArrow-' + wall.hash] = new Tool().createMarkLineArrow(tFont, outPoint1, outPoint2)
        }
      });
    });
    wallMarkLineC = {
      models: wallMarkLine
    }
    wallMarkLineContainer = {
      models: {
        wallMarkLineC: wallMarkLineC,
      }
    }
    new makerjs.model.zero(wallMarkLineContainer, true, true);
    this.originPosition = wallMarkLineContainer.origin;
    return wallMarkLineContainer;
  }
  drawWallTextMarks(tFont, rooms) {
    let wallMarkText = {};
    let wallMarkTextC = {};
    let wallMarkTextContainer = {};
    rooms.forEach((room) => {
      room.walls.forEach((wall) => {
        const { inPoint1, inPoint2, outPoint1, outPoint2, point1, point2 } = wall
        let angle = new Tool().getCenterPonitAndAngle(outPoint1, outPoint2).angle
        let inP1 = new THREE.Vector2(inPoint1.x, inPoint1.y)
        let inP2 = new THREE.Vector2(inPoint2.x, inPoint2.y)
        let inEdgeLength = inP1.distanceTo(inP2)
        let outP1 = new THREE.Vector2(outPoint1.x, outPoint1.y)
        let outP2 = new THREE.Vector2(outPoint2.x, outPoint2.y)
        let outEdgeLength = outP1.distanceTo(outP2)
        if (inEdgeLength > outEdgeLength) {
          wallMarkText['Line-' + wall.hash] = new Tool().createMarkText(tFont, inPoint1, inPoint2)
        }else {
          wallMarkText['Line-' + wall.hash] = new Tool().createMarkText(tFont, outPoint1, outPoint2)
        }
      });
    });
    wallMarkTextC = {
      models: wallMarkText
    }
    wallMarkTextContainer = {
      models: {
        wallMarkTextC: wallMarkTextC,
      }
    }
    new makerjs.model.zero(wallMarkTextContainer, true, true);
    this.originPosition = wallMarkTextContainer.origin;
    return wallMarkTextContainer;
  }


  /**
   *
   * @param {多个房间数据} rooms
   * 画墙
   */
  drawWalls(rooms) {
    let wallOutline = {};
    let wallOutlineArc = {};
    let wallOutlineC = {};
    let wallOutlineArcC = {};
    let wallContainer = {};
    rooms.forEach((room) => {
      room.walls.forEach((wall) => {
        const {
          inPoint1,
          inPoint2,
          outPoint1,
          outPoint2,
          position,
          radius,
          startAngle,
          endAngle,
          width,
        } = wall;
        if (wall.isCurve) {
          wallOutlineArc[0 + wall.hash] = new makerjs.paths.Arc(
            [position.x, position.y],
            radius + width / 2,
            (startAngle * 180) / Math.PI,
            (endAngle * 180) / Math.PI
          );
          wallOutlineArc[1 + wall.hash] = new makerjs.paths.Arc(
            [position.x, position.y],
            radius - width / 2,
            (startAngle * 180) / Math.PI,
            (endAngle * 180) / Math.PI
          );
        }
        if (!wall.isCurve) {
          let wallPoints = [
            [inPoint1.x, inPoint1.y],
            [inPoint2.x, inPoint2.y],
            [outPoint2.x, outPoint2.y],
            [outPoint1.x, outPoint1.y],
          ];
          wallOutline[wall.hash] = new makerjs.models.ConnectTheDots(
            true,
            wallPoints
          );
        }
      });
    });
    wallOutlineArcC = {
      paths: wallOutlineArc,
    };

    wallOutlineC = {
      models: wallOutline,
    };
    wallContainer = {
      models: {
        wallOutlineC: wallOutlineC,
        wallOutlineArcC: wallOutlineArcC,
      },
    };
    // new makerjs.model.zero(wallContainer, true, true);
    new makerjs.model.center(wallContainer, true, true);
    this.originPosition = wallContainer.origin;
    this.wallContainerMeasure = new Tool().getSpaceSize(wallContainer);
    return wallContainer;
  }

  drawInlays(inlays) {
    let inlayContainer = {};
    var tdoor = {};
    let tdoorC = {};

    let tdouble_door = {};
    let tdouble_doorC = {};

    let tmove_door = {};
    let tmove_doorC = {};

    let twindow = {};
    let twindowC = {};

    let tground_window = {};
    let tground_windowC = {};

    let tflutter_window = {};
    let tflutter_windowC = {};
    inlays.forEach((inlay) => {
      const { position, rotation, thickness, width } = inlay;

      // 门
      if (inlay.type === "tdoor") {
        tdoor[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }
      if (inlay.type === "tdouble_door") {
        tdouble_door[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }
      if (inlay.type === "tmove_door") {
        tmove_door[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }

      // 窗
      if (inlay.type === "twindow") {
        twindow[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }
      if (inlay.type === "tground_window") {
        tground_window[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }
      if (inlay.type === "tflutter_window") {
        tflutter_window[inlay.type + inlay.uuid] = new Tool().createInlay(
          inlay,
          position,
          rotation,
          this.originPosition
        );
      }
    });
    tdoorC = {
      models: tdoor,
    };
    tdouble_doorC = {
      models: tdouble_door,
    };
    tmove_doorC = {
      models: tmove_door,
    };
    twindowC = {
      models: twindow,
    };
    tground_windowC = {
      models: tground_window,
    };
    tflutter_windowC = {
      models: tflutter_window,
    };

    inlayContainer = {
      models: {
        tdoorC: tdoorC,
        tdouble_doorC: tdouble_doorC,
        tmove_doorC: tmove_doorC,
        twindowC: twindowC,
        tground_windowC: tground_windowC,
        tflutter_windowC: tflutter_windowC,
      },
    };
    this.inlayContainerMeasure = new Tool().getSpaceSize(inlayContainer);
    return inlayContainer;
  }

  static drawModels(data) {
    /**
     *
     * @param {dxf文件流} dxfText
     * @returns
     */
    function parseDxf(dxfText) {
      console.log("进入解析");
      let dxf = null;
      const parser = new DxfParser();
      try {
        dxf = parser.parseSync(dxfText);
      } catch (err) {
        return console.error(err.stack);
      }
      // 解析数据类型
      console.log(dxf);
      return dxf;
    }
    let entityOutline = {};
    let entityContainer = {};
    let modelData = parseDxf(data.data);
    let entities = modelData.entities;
    entities.forEach((entity, index) => {
      if (entity.type === "LINE") {
        let vertices = entity.vertices;
        let entityPoints = [
          [vertices[0].x, vertices[0].y],
          [vertices[1].x, vertices[1].y],
        ];
        entityOutline[entity.type + "-" + index] =
          new makerjs.models.ConnectTheDots(true, entityPoints);
      }
      if (entity.type === "POLYLINE" || entity.type === "LWPOLYLINE") {
        let vertices = entity.vertices;
        let entityPoints = [];
        vertices.forEach((vertice) => {
          entityPoints.push([vertice.x, vertice.y]);
        });
        entityOutline[entity.type + "-" + index] =
          new makerjs.models.ConnectTheDots(true, entityPoints);
      }
      // if (entity.type === "TEXT") {
      //   const { text, startPoint, textHeight } = entity
      //   // let getFont =async () => {
      //   //   let fonts = awaitnew new Tool().createText(text, startPoint, textHeight)
      //   //   return fonts
      //   // }
      //   // getFont().then((res) => {
      //   //   console.log(res)
      //   // })
      //   // entityOutline[entity.type + '-' + index] = new Tool().createText(text, startPoint, textHeight)
      // }
    });
    entityContainer = {
      models: entityOutline,
    };
    // new makerjs.model.zero(entityContainer, true, true);
    new makerjs.model.center(entityContainer);
    return entityContainer;
  }
}
