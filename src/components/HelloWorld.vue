<template>
  <div class="show" @click="readFiles">展示</div>
  <div class="stage" ref="stage" v-html="svg"></div>
</template>
<script>
import { ref } from "vue";
// 获取本地静态数据
// 获取本地dxf模板文件
const axios = require("axios");
import { DrawData } from "../draw/demo";
import { saveAs } from "file-saver";
import { Tool } from "@/Tool/Tool";
var makerjs = require("makerjs");

export default {
  data() {
    return {
      svg: [],
    };
  },
  methods: {
    async readFiles() {
      let font = await opentype.load('fonts/stsong.ttf');
      axios
        .get("test.json")
        .then((response) => {
          axios.get("model.dxf").then((res) => {
            let modelData = DrawData.drawModels(res);
            let modelDataMeasure = new Tool().getSpaceSize(modelData);

            let drawDataArr = new DrawData(font, response.data[0]);

            let roomContainer = {
              models: {
                wallContainer: drawDataArr.dataArr.models.wallContainer,
                inlayContainer: drawDataArr.dataArr.models.inlayContainer,
                // wallMarkLineContainer: drawDataArr.dataArr.models.wallMarkLineContainer,
                // wallMarkTextContainer: drawDataArr.dataArr.models.wallMarkTextContainer,
                outMarkTextContainer: drawDataArr.dataArr.models.outMarkTextContainer,
              }
            }
            
            makerjs.model.scale(roomContainer, 10);
            roomContainer = new makerjs.model.mirror(
              roomContainer,
              false,
              true
            );
            let roomContainerMeasure = new Tool().getSpaceSize(roomContainer)

            if (roomContainerMeasure.height > modelDataMeasure.height / 10 * 9) {
              console.log('>h')
              new makerjs.model.scale(modelData, 1.5)
              modelDataMeasure = new Tool().getSpaceSize(modelData);
              new makerjs.model.zero(modelData, true, true)
            }
            if (roomContainerMeasure.height < modelDataMeasure.height / 10 * 9) {
              console.log('<h')
              new makerjs.model.scale(modelData, roomContainerMeasure.height / modelDataMeasure.height / 10 * 9 )
              modelDataMeasure = new Tool().getSpaceSize(modelData);
              new makerjs.model.zero(modelData, true, true)
            }
            if (roomContainerMeasure.width > modelDataMeasure.width / 7 * 6) {
              console.log('>w')
              new makerjs.model.scale(modelData, roomContainerMeasure.width / (modelDataMeasure.width / 8 * 6))
              modelDataMeasure = new Tool().getSpaceSize(modelData);
              new makerjs.model.zero(modelData, true, true)
            }
            if (roomContainerMeasure.width < modelDataMeasure.width / 7 * 6) {
              console.log('<w')
              new makerjs.model.scale(modelData, 1.2)
              modelDataMeasure = new Tool().getSpaceSize(modelData);
              new makerjs.model.zero(modelData, true, true)
            }

            // new makerjs.model.move(roomContainer, [modelDataMeasure.width / 2 - modelDataMeasure.width / 14 - roomContainerMeasure.width / 2, modelDataMeasure.height / 2 + roomContainerMeasure.height / 2])
            new makerjs.model.move(roomContainer, [modelDataMeasure.width / 2 - modelDataMeasure.width / 14, modelDataMeasure.height / 2 ])
            let allContainer = {
              models: {
                roomContainer: roomContainer,
                modelData: modelData
              }
            }
            // makerjs.model.move(allContainer.models.roomContainer.models.outMarkTextContainer, [10,10])

            console.log(allContainer)
            new makerjs.model.scale(allContainer, 0.05)
            
            this.svg = makerjs.exporter.toSVG(allContainer);
            // 导出dxf文件
            // var blob = new Blob([this.svg], {
            //   type: "text/plain;charset=utf-8",
            // });
            // saveAs(blob, "stair.dxf");
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {},
};
</script>

<style scoped></style>
