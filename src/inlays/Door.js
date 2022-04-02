var makerjs = require('makerjs');
import { saveAs } from 'file-saver';

export class Door {
  static drawTDoor() {
    let tDoorOutline = {}
    let tDoorContainer = {}
    let tDoorPoints = [
      [-375,750],
      [-315,750],
      [-315,0],
      [-375,0],
    ]
    tDoorOutline[0] = new makerjs.models.ConnectTheDots(true, tDoorPoints)
    tDoorOutline[1] = new makerjs.paths.Arc([-375,0], 750, 0, 90 )
    tDoorContainer = {
      models: {
        tDoorOutlineM: tDoorOutline[0]
      },
      paths: {
        tDoorOutlineP: tDoorOutline[1]
      }
    }
    return tDoorContainer
  }
  static drawTDoubleDoor() {
    let tDoubleDoorOutline = {}
    let tDoubleDoorContainer = {}
    let tDoubleDoorPoints1 = [
      [-750,750],
      [-690,750],
      [-690,0],
      [-750,0],
    ]
    let tDoubleDoorPoints2 = [
      [750,750],
      [690,750],
      [690,0],
      [750,0],
    ]
    tDoubleDoorOutline[0] = new makerjs.models.ConnectTheDots(true, tDoubleDoorPoints1)
    tDoubleDoorOutline[1] = new makerjs.paths.Arc([-750,0], 750, 0, 90 )
    tDoubleDoorOutline[2] = new makerjs.models.ConnectTheDots(true, tDoubleDoorPoints2)
    tDoubleDoorOutline[3] = new makerjs.paths.Arc([750,0], 750, 90, 180 )
    tDoubleDoorContainer = {
      models: {
        tDoubleDoorOutlineM1: tDoubleDoorOutline[0],
        tDoubleDoorOutlineM2: tDoubleDoorOutline[2]
      },
      paths: {
        tDoubleDoorOutlineP1: tDoubleDoorOutline[1],
        tDoubleDoorOutlineP2: tDoubleDoorOutline[3]
      }
    }
    return tDoubleDoorContainer
  }
  static drawTMoveDoor() {
    let tMoveDoorOutline = {}
    let tMoveDoorContainer = {}
    let tMoveDoorPoints1 = [
      [-750,120],
      [750,120],
      [750,-120],
      [-750,-120],
    ]
    let tMoveDoorPoints2 = [
      [-735,60],
      [245,60],
      [245,0],
      [-735,0],
    ]
    let tMoveDoorPoints3 = [
      [-245,0],
      [735,0],
      [735,-60],
      [-245,-60],
    ]
    tMoveDoorOutline[0] = new makerjs.models.ConnectTheDots(true, tMoveDoorPoints1)
    tMoveDoorOutline[1] = new makerjs.models.ConnectTheDots(true, tMoveDoorPoints2)
    tMoveDoorOutline[2] = new makerjs.models.ConnectTheDots(true, tMoveDoorPoints3)
    tMoveDoorContainer = {
      models: tMoveDoorOutline
    }
    return tMoveDoorContainer
  }
}