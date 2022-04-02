import { Door } from '@/inlays/Door';
import { Window } from '@/inlays/Window';
import { saveAs } from "file-saver";
import * as THREE from 'three';

var makerjs = require('makerjs');
export class Tool {
  getSpaceSize (model) {
    let modelSize = new makerjs.measure.modelExtents(model)
    return modelSize
  }


  createInlay(tInlay, tPosition, tRotation, tOriginPosition) {
    let name = {}
    let nameC = {}
    let method = null
    if (tInlay.type === 'tdoor') {
      method = Door.drawTDoor()
    }
    if (tInlay.type === 'tdouble_door') {
      method = Door.drawTDoubleDoor()
    }
    if (tInlay.type === 'tmove_door') {
      method = Door.drawTMoveDoor()
    }
    if (tInlay.type === 'twindow') {
      method = Window.drawTWindow()
    }
    if (tInlay.type === 'tground_window') {
      method = Window.drawGroundWindow()
    }
    if (tInlay.type === 'tflutter_window') {
      method = Window.drawFlutterWindow()
    }

    name[tInlay.type + '-' + tInlay.uuid] = new makerjs.model.scale(method, 0.1)
    let nameSize = new Tool().getSpaceSize(name[tInlay.type  + '-' + tInlay.uuid])
    if (['twindow', 'tground_window', 'tmove_door'].includes(tInlay.type)) {
      console.log(nameSize.width, nameSize.height, tInlay.type)
      name[tInlay.type  + '-' + tInlay.uuid] = new makerjs.model.distort(name[tInlay.type  + '-' + tInlay.uuid], tInlay.width / nameSize.width, tInlay.thickness / nameSize.height)
    }
    if (['tdoor', 'tdouble_door'].includes(tInlay.type)) {
      name[tInlay.type  + '-' + tInlay.uuid] = new makerjs.model.distort(name[tInlay.type  + '-' + tInlay.uuid], tInlay.width / nameSize.width, tInlay.width / nameSize.width)
    }
    if (['tflutter_window'].includes(tInlay.type)) {
      name[tInlay.type  + '-' + tInlay.uuid] = new makerjs.model.distort(name[tInlay.type  + '-' + tInlay.uuid], tInlay.width / nameSize.width, 1)
    }
    new makerjs.model.rotate(name[tInlay.type  + '-' + tInlay.uuid], tRotation.y * 180 / Math.PI)
    name[tInlay.type  + '-' + tInlay.uuid].origin = [tPosition.x + tOriginPosition[0], tPosition.y + tOriginPosition[1]] 

    nameC = {
      models: name
    }
    return nameC
  }

  createMarkLine(tFont, tPoint1, tPoint2) {
    let angle = this.getCenterPonitAndAngle(tPoint1, tPoint2).angle
    let normal = this.getCenterPonitAndAngle(tPoint1, tPoint2).normal
    let singleLine = new makerjs.models.ConnectTheDots(true,[
      [tPoint1.x, tPoint1.y],
      [tPoint2.x, tPoint2.y]
    ])
    singleLine.paths.ShapeLine1.layer = 'red'
    let lines = {
      models: {
        singleLine: singleLine,
      }
    }
    return lines
  }
  createMarkLineArrow(tFont, tPoint1, tPoint2) {
    let angle = this.getCenterPonitAndAngle(tPoint1, tPoint2).angle
    let normal = this.getCenterPonitAndAngle(tPoint1, tPoint2).normal
    let arrowLine1 = new makerjs.models.Rectangle(10,4)
    let arrowLine2 = new makerjs.models.Rectangle(10,4)
    arrowLine1 = new makerjs.model.center(arrowLine1)
    arrowLine1.origin = [tPoint1.x, tPoint1.y]
    arrowLine2.origin = [tPoint2.x, tPoint2.y]
    // arrowLine2 = new makerjs.model.move(arrowLine1, [tPoint2.x, tPoint2.y])
    arrowLine1.paths.ShapeLine1.layer = 'blue'
    arrowLine2.paths.ShapeLine1.layer = 'blue'
    let lines = {
      models: {
        arrowLine1: arrowLine1,
        arrowLine2: arrowLine2,
      }
    }
    return lines
  }
  createMarkText(tFont, tPoint1, tPoint2) {
    let text = []
    let edges = ({
      p1: new THREE.Vector2(tPoint1.x,tPoint1.y),
      p2: new THREE.Vector2(tPoint2.x,tPoint2.y),
    })
    let lineLength = Math.round(edges.p1.distanceTo(edges.p2))
    let centerPoint = this.getCenterPonitAndAngle(tPoint1, tPoint2).centerPoint
    let angle = this.getCenterPonitAndAngle(tPoint2, tPoint1).angle
    let normal = this.getCenterPonitAndAngle(tPoint1, tPoint2).normal
    
    text[0] = new makerjs.models.Text(tFont, String(lineLength * 10), 20)
    text[0] = new makerjs.model.rotate(text[0], angle * 180 / Math.PI )
    text[0] = new makerjs.model.mirror(text[0], false, true)
    let textMeasure = this.getSpaceSize(text[0])

    if (Math.round(normal.x) === 1) {
      new makerjs.model.move(text[0], [centerPoint.x - textMeasure.width / 2, centerPoint.y - textMeasure.height / 2])
    }
    else if (Math.round(normal.x) === -1) {
      new makerjs.model.move(text[0], [centerPoint.x + textMeasure.width / 2, centerPoint.y + textMeasure.height / 2])
    }
    else if (Math.round(normal.y) === 1) {
      new makerjs.model.move(text[0], [centerPoint.x - textMeasure.width / 2, centerPoint.y + textMeasure.height / 2])
    }
    else if (Math.round(normal.y) === -1) {
      new makerjs.model.move(text[0], [centerPoint.x + textMeasure.width / 2, centerPoint.y - textMeasure.height / 2])
    }

    let texts = {
      models: text
    }
    return texts
  }
  getCenterPonitAndAngle(tPoint1, tPoint2) {
    let centerPoint = new THREE.Vector2((tPoint1.x + tPoint2.x) / 2, (tPoint1.y + tPoint2.y) / 2)
    let edges = ({
      p1: new THREE.Vector2(tPoint1.x,tPoint1.y),
      p2: new THREE.Vector2(tPoint2.x,tPoint2.y),
    })
    let angle = new THREE.Vector2().subVectors(edges.p2, edges.p1).normalize().angle()
    let normal = new THREE.Vector2().subVectors(edges.p1, edges.p2).normalize()
    // console.log(normal)
    return {
      centerPoint,
      angle,
      normal
    }
  }
  createArrow(tPoint1, tPoint2) {
    let arrow = []
    arrow[0] = new makerjs.paths.Circle(3)
    arrow[0] = new makerjs.path.center(arrow[0])
    arrow[0].origin = [tPoint1.x, tPoint1.y]
    arrow[1] = new makerjs.paths.Circle(3)
    arrow[1] = new makerjs.path.center(arrow[1])
    arrow[1].origin = [tPoint2.x, tPoint2.y]
    arrow[0].layer = 'blue'
    arrow[1].layer = 'blue'
    let arrowC = {
      paths: arrow
    }
    return arrowC
  }
}