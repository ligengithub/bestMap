<template>
    <section class="home">
        <div class="tool-body">
            <div class="left-part">
                <div class="left-item">
                    <el-radio-group v-model="mapRadio" size="mini">
                        <el-radio-button label="高德"></el-radio-button>
                        <el-radio-button label="百度"></el-radio-button>
                        <el-radio-button label="google"></el-radio-button>
                    </el-radio-group>
                </div>

                <div class="left-item">
                    <el-upload
                            class="upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            multiple
                            :limit=1
                            :file-list="fileList"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :http-request="analysExcel"
                            :before-upload="beforeUpload">
                        <el-button type="primary" size="small" style="width: 90px">上传<i
                                class="el-icon-upload el-icon--right"></i>
                        </el-button>
                        <el-button class="down-btn" type="primary" size="small" style="width: 90px"
                                   @click="downTemplate">下载模板<i
                                class="el-icon-download el-icon--right"></i>
                        </el-button>

                        <div slot="tip" class="el-upload__tip">只能上传excel/csv文件</div>
                    </el-upload>
                </div>
                <div class="left-item">
                    <el-button size="small" type="primary" style="width: 90px" @click="plotLineByString">解析</el-button>
                    <el-button size="small" type="primary" style="width: 90px" @click="clearMarkAndLine">清除标记
                    </el-button>
                </div>
                <div class="left-item">
                    <div class="input-text-desc">
                        <span>
                        输入经纬度查询
                        </span>
                        <el-button size="small" style="width: 60px;margin-left: 3rem" type="primary"
                                   @click="clearGpsString"> 清空
                        </el-button>
                    </div>
                    <div>
                        <el-input
                                class="input-text"
                                type="textarea"
                                :rows="12"
                                placeholder="格式如下 :  112.59982,31.197446, 112.59423,31.197646, 112.59124,31.197246, 112.59382,31.197546"
                                v-model="gpsString">
                        </el-input>
                    </div>

                    <div class="anals-result">
                        <div class="result-item">
                            <span>点个数:</span> <span>{{linePath.length}}</span>
                        </div>
                        <div class="result-item">
                            <span>路径总长度(单位:米):</span> <span>{{totalLength}}</span>
                        </div>
                        <div class="result-item">
                            <span>起点终点距离(单位:米):</span> <span>{{startEndLen}}</span>
                        </div>
                    </div>

                </div>

            </div>
            <div class="right-part">
                <div class="map-wrapper">
                    <el-amap :vid="mapDiv" :center="center" ref="map" :zoom="zoom"
                             :amap-manager="amapManager" :events="mapEvent">
                        <div v-if="this.benginMarker.position.length!==0">
                            <el-amap-marker vid="'marker-begin'"
                                            :position="benginMarker.position"
                                            :label="benginMarker.label"
                            >
                            </el-amap-marker>
                        </div>
                        <div v-if="this.endMarker.position.length!==0">
                            <el-amap-marker vid="'marker-end'"
                                            :position="endMarker.position"
                                            :label="endMarker.label">
                            </el-amap-marker>
                            <el-amap-circle-marker
                                    :key="marker.index"
                                    v-for="marker in markers"
                                    :center="marker.center"
                                    :radius="marker.radius"
                                    :fill-color="marker.fillColor"
                                    :fill-opacity="marker.fillOpacity"
                                    :events="marker.events"
                                    :strokeWight="0">
                            </el-amap-circle-marker>
                        </div>
                        <el-amap-polyline :path="linePath" strokeColor="#f5222d"></el-amap-polyline>
                    </el-amap>
                </div>
                <!--                <div class="map-wrapper">-->
                <!--&lt;!&ndash;                    <GmapMap ref="mapRef" :center = "{lat:31.197446,lng:112.59982}" :zoom="7">&ndash;&gt;-->
                <!--&lt;!&ndash;                    </GmapMap>&ndash;&gt;-->
                <!--                    <baidu-map style="height: 500px; width: 500px" center="{lng: 112.59982, lat: 31.19744}" zoom="17">-->
                <!--                    </baidu-map>-->
                <!--                </div>-->
            </div>
        </div>
    </section>
</template>

<script>
    // global AMap
    import VueAMap from "vue-amap";
    import {calculateLineDistance} from "../util/util";
    import XLSX from 'xlsx'

    const amapManager = new VueAMap.AMapManager();

    export default {
        name: "GpsTool",
        components: {
        },
        data() {
            return {
                mapRadio: '高德',
                mapDiv: "mapDiv",
                amapManager: amapManager,
                center: [112.59982, 31.197446],
                zoom: 16,
                //输入的gpsString
                gpsString: '',
                mapEvent: {
                },
                linePath: [],
                benginMarker: {
                    position: [],
                    label: {
                        content: "起点",
                        offset: [-5, -22]
                    }
                },
                endMarker: {
                    position: [],
                    label: {
                        content: "终点",
                        offset: [-5, -22]
                    }
                },
                markers: [],
                //总点数和总长度
                pointCnt: 0,
                totalLength: 0,
                startEndLen: 0,
                //excel
                fileList: [],
                importData: [],
                wb: ''
            }
        },
        methods: {
            handleRemove( ) {
                this.clearMarkAndLine();
            },
            handlePreview(file) {
                console.log(file);
            },
            action() {
                console.log("action")
            },
            // 获取路径距离
            getPathLen() {
                let total = 0;
                for (var i = 0; i < this.linePath.length - 1; i++) {
                    let p1 = this.linePath[i];
                    let p2 = this.linePath[i + 1];
                    // let distance = parseFloat(AMap.GeometryUtil.distance(p1, p2).toFixed(2));
                    let distance = calculateLineDistance(p1, p2);
                    total += distance;
                }
                return total.toFixed(2);
            },
            getStartEndLen(path) {
                let distance = calculateLineDistance(path[0], path[path.length - 1]).toFixed(2);
                return distance;
            },
            setBeginAndEndMarker(linePath) {
                console.log(linePath);
                let length = linePath.length;
                console.log(linePath[length - 1]);
                this.center = linePath[0];
                this.benginMarker = {
                    position: linePath[0],
                    label: {
                        content: "起点",
                        offset: [-5, -22]
                    }
                };
                this.endMarker = {
                    position: linePath[length - 1],
                    label: {
                        content: "终点",
                        offset: [-5, -22]
                    }
                };

                if (linePath.length >= 3) {

                    linePath.forEach((p,index) => {
                        let temp = {};
                        temp.center = p;
                        temp.fillColor = 'rgba(0,0,255,1)';
                        temp.opacity = 0.5;
                        temp.radius = 3;
                        temp.index = index;
                        this.markers.push(temp)
                    });
                }
            },
            plotLineByString() {
                let gpsString = this.gpsString;
                if (gpsString.length === 0) {
                    this.$message.error("输入数据为空");
                    return
                }
                let data = gpsString.split(',');
                let longitudes = [];
                let latitudes = [];
                let points = [];
                data.forEach((data, index) => {
                    index % 2 === 0 ? longitudes.push(data) : latitudes.push(data);
                });
                if (longitudes.length !== latitudes.length) {
                    this.$message.error("请检查输入，经纬度必须成对出现");
                    return
                }
                for (let i = 0; i < longitudes.length; i++) {
                    points.push([longitudes[i], latitudes[i]])
                }
                this.linePath = points;
                this.setMarker(points)
            },

            setMarker(linePath) {
                // 设置起点和终点
                if (linePath.length === 0) {
                    // 清除起始点和终点
                    this.benginMarker = {
                        position: [],
                        label: {}
                    };
                    this.endMarker = {
                        position: [],
                        label: {}
                    };
                    return null;
                } else if (linePath.length === 1) {
                    this.benginMarker = {
                        position: linePath[0],
                        label: {}
                    }
                } else if (linePath.length > 1) {
                    // 设置起点终点
                    this.setBeginAndEndMarker(linePath);
                    // 计算总距离
                    this.totalLength = this.getPathLen(linePath);
                    this.startEndLen = this.getStartEndLen(linePath);
                }
            },
            clearMarkAndLine() {
                // 清除线
                this.linePath = [];
                this.setMarker(this.linePath);
                this.totalLength = 0;
            },
            // 解析上传的excel
            analysExcel(content) {
                // 先清空 linePath
                this.linePath = [];

                var reader = new FileReader();
                reader.readAsBinaryString(content.file);


                reader.onload = (e) => {
                    let data = e.target.result; //获取上传的文件内容
                    this.wb = XLSX.read(data, {
                        type: 'binary'
                    });
                    // 转化成json数据，每行是一个对象
                    this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]]);
                    if (this.importData.length === 0) {
                        this.$message.error("表数据为空");
                        return
                    }
                    this.importData.forEach(raw => {
                        if (raw.lat === undefined || raw.lng === undefined) {
                            this.$message.error("表头字段错误，请检查表头");
                            return
                        }
                        let temp = [parseFloat(raw.lng), parseFloat(raw.lat)];
                        this.linePath.push(temp)
                    });
                    // 设置marcker
                    this.setBeginAndEndMarker(this.linePath);
                    // 计算总距离
                    this.totalLength = this.getPathLen(this.linePath);
                    this.startEndLen = this.getStartEndLen(this.linePath);
                }
            },
            // 校验文件类型
            beforeUpload(file) {
                const typeList = ["xls", "xlsx", "csv"];
                const extension = file.name.substr(file.name.lastIndexOf(".") + 1);

                console.log(extension);
                if (!typeList.includes(extension)) {
                    this.$message.error("文件格式不正确");
                    return false;
                } else {
                    return true;
                }
            },
            // 下载模板
            downTemplate() {
                let a = document.createElement('a');
                a.href = '/temp/gpsTemplate.xlsx';
                a.download = "gps数据导入模板";
                a.click();
            },

            clearGpsString() {
                this.gpsString = '';
            }

        },
        mounted: function () {
            // this.$refs.mapRef.$mapPromise.then((map) => {
            //     map.panTo({lat: 31.197446, lng: 112.59982})
            // })
        }
    }
</script>

<style scoped>

    .map-wrapper {
        width: 1200px;
        height: 700px;
        flex: 1;
        background: pink;
    }

    .left-part {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 4;
    }

    .input-text {
        padding: 5px;
        width: 250px;
        height: 300px;
    }

    .tool-body {
        display: flex;
    }

    .input-text-desc {
        padding-top: 2rem;
        padding-left: 1rem;
        font-weight: bolder;
        font-size: 15px;
    }

    .right-part {
        padding-left: 5px;
    }

    .anals-result {
        padding-top: 2rem;
    }

    .result-item {
        padding: 5px;
    }

    .result-item > span {
        font-size: 17px;
        font-weight: bolder;
    }

    .left-item {
        width: 100%;
        padding: 2rem 5px 5px;
    }

    .down-btn {
        margin-left: 10px;
    }

    .left-part {
        display: flex;
        flex-direction: column;
    }

</style>
