<template>
    <div class="left-part">
        <div class="left-item row-flex-mid">
            <el-radio-group v-model="mapRadio" size="mini" @change="changeMap">
                <el-radio-button label='1'>高德</el-radio-button>
                <el-radio-button label='2'>百度</el-radio-button>
                <!--                <el-radio-button label='3'>google</el-radio-button>-->
            </el-radio-group>
        </div>
        <div class="left-item">
            <div class="radio-group">
                <el-radio v-model="locationType" label="1">WGS84</el-radio>
                <el-radio v-model="locationType" label="2">GCJ02</el-radio>
                <el-radio v-model="locationType" label="3">BD09</el-radio>
            </div>
            <div title="坐标系说明" name="2">
                <P class="detail-text">WGS84:</label> 大地坐标系，如果您的经纬度是硬件直接输出的经纬度请选择此选项</P>
                <P class="detail-text">GCJ02: 火星坐标系，高德，google国内，腾讯 均使用此坐标系</P>
                <P class="detail-text">BD09: 百度坐标系，百度在火星坐标系上又经过一次加密</P>
                <P class="detail-text" style="font-weight: initial">注意: 输入的数据是什么坐标系就选择什么坐标系，一般硬件输出的坐标使用的都是WGS84坐标系</P>
            </div>
        </div>

        <div class="left-item">
            <div class="input-text-desc">
                <span>上传excel解析(只能上传excel/csv文件)</span>
            </div>
            <div style="display: flex;margin-left: 2rem">
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
                    <el-button type="primary" size="small" class="m-l-10 m-t-10">上传excel<i
                            class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </el-upload>
                <el-button class="m-l-10 m-t-10" type="primary" size="small"
                           @click="downTemplate">下载模板<i
                        class="el-icon-download el-icon--right"></i>
                </el-button>
            </div>
        </div>

        <!--        <div class="left-item">-->
        <!--            <div class="input-text-desc">-->
        <!--                <span>地图绘制</span>-->
        <!--            </div>-->
        <!--            <div class="btn-list">-->
        <!--                <el-button class="down-btn" type="primary" size="small"-->
        <!--                           @click="downTemplate">开始画线-->
        <!--                </el-button>-->
        <!--                <el-button class="down-btn" type="primary" size="small"-->
        <!--                           @click="downTemplate">删除尾节点-->
        <!--                </el-button>-->
        <!--                <el-button class="down-btn" type="primary" size="small"-->
        <!--                           @click="downTemplate">导出数据<i-->
        <!--                        class="el-icon-down el-icon&#45;&#45;right"></i>-->
        <!--                </el-button>-->
        <!--            </div>-->

        <!--        </div>-->

        <div class="left-item">
            <div class="input-text-desc">
                        <span>
                        输入经纬度查询
                        </span>
            </div>
            <div class="row-flex-mid">
                <div class="input-contain">
                    <el-input
                            class="input-text"
                            type="textarea"
                            :rows="8"
                            placeholder="格式如下 :  112.59982,31.197446, 113.58782,32.196446, 114.57682,33.195446, 115.56582,34.194446, 116.55482,35.193446, 117.54382,36.192446"
                            v-model="gpsString">
                    </el-input>
                </div>
            </div>

        </div>

        <div class="left-item">
            <div class="btn-list">
                <el-button size="small" type="primary" @click="plotLineByString">解析数据</el-button>
                <el-button size="small" type="primary"
                           @click="clearGpsString"> 清空输入
                </el-button>
                <el-button type="danger" style="margin-left: 20px" @click="clearMarkAndLine">清空标记
                </el-button>
            </div>

        </div>
        <div class="left-item align-left">
            <div>
                <span>统计结果:</span>
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
</template>

<script>
    import EventBus from '../event_bus'
    import XLSX from 'xlsx'
    import {bd09togcj02, calculateLineDistance, gcj02tobd09, transLinePath, wgs84togcj02} from "../util/util";
    import {addRecord} from '../api/service/recordServices'
    import {throwMessage} from '../api/request';

    export default {

        name: "LeftPart",
        data() {
            return {
                detailInfoFlag: false,
                // 坐标系类型
                locationType: '2',
                mapRadio: '1',
                //输入的gpsString
                gpsString: '',
                pointCnt: 0,
                totalLength: 0,
                startEndLen: 0,
                //excel
                fileList: [],
                importData: [],
                wb: '',
                linePath: [],
            }
        },

        created() {
            console.log("create")
        },

        mounted() {
            console.log("mounte")
            let data = {};
            // 页面刷新的时候记录
            let result = addRecord(data);
            // throwMessage(result, false).then((data = {}) => {
            //     console.log("111111111111111111", data)
            // })

        },
        methods: {
            changeMap() {
                console.log(this.mapRadio);
                this.initData();
                if (this.mapRadio === '2') {
                    this.$router.push({path: "/map/baidu"})
                } else if (this.mapRadio === '3') {
                    this.$router.push({path: "/map/google"})
                } else {
                    this.$router.push({path: "/map/gaode"})
                }
            },

            // 删除上传的文件
            handleRemove() {
                this.clearMarkAndLine();
                this.linePath = [];
                this.startEndLen = 0;
                this.totalLength = 0;
            },
            handlePreview(file) {
                console.log(file);
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

                    let emitData = this.getEmitData(this.linePath);
                    this.getAnalysResult(this.linePath);
                    this.sendMessageToMap(emitData)
                }
            },
            // 校验文件类型
            beforeUpload(file) {
                const typeList = ["xls", "xlsx", "csv"];
                const extension = file.name.substr(file.name.lastIndexOf(".") + 1);
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


            plotLineByString() {
                if (this.linePath.length > 0) {
                    this.clearMarkAndLine()
                }

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
                // console.log(gpsData)
                this.linePath = points;
                let emitData = this.getEmitData(this.linePath);
                this.getAnalysResult(this.linePath);
                setTimeout(() => {
                    this.sendMessageToMap(emitData);
                }, 100);

            },
            //清除输入
            clearGpsString() {
                this.gpsString = '';
            },
            //清除地图标记
            clearMarkAndLine() {
                // 清除线
                console.log("clwarMarker");
                let data = {flag: true};
                EventBus.$emit("clearMapFlag", data);
                this.linePath = [];
                this.startEndLen = 0;
                this.totalLength = 0;
            },
            // 获取路径距离
            getPathLen(path) {
                let total = 0;
                for (var i = 0; i < path.length - 1; i++) {
                    let p1 = path[i];
                    let p2 = path[i + 1];
                    let distance = calculateLineDistance(p1, p2);
                    total += distance;
                }
                return total.toFixed(2);
            },
            getStartEndLen(path) {
                let distance = calculateLineDistance(path[0], path[path.length - 1]).toFixed(2);
                return distance;
            },
            initData() {
                this.linePath = [];
                this.totalLength = 0;
                this.startEndLen = 0;
            },

            // 将元数据发送给地图子组件
            sendMessageToMap(gpsData) {
                EventBus.$emit("gpsData", gpsData);
            },
            // 解析数据
            getAnalysResult(linePath) {
                this.totalLength = this.getPathLen(linePath);
                this.startEndLen = this.getStartEndLen(linePath);
            },
            getEmitData(linePath) {
                // 坐标系转化
                let type = this.getTargetLocationType();
                let result = transLinePath(linePath, type);
                let gpsData = {
                    center: result[0],
                    linePath: result,
                    zoom: 17,
                };
                return gpsData;
            },
            getTargetLocationType() {
                if (this.locationType === '1' && this.mapRadio === '1') {
                    // 硬件坐标系转 转 火星坐标系
                    return 1;
                } else if (this.locationType === '1' && this.mapRadio === '2') {
                    // 硬件坐标系转百度坐标系
                    return 2
                } else if (this.locationType === '2' && this.mapRadio === '1') {
                    // 火星坐标系转高德 不操作
                    return 0;
                } else if (this.locationType === '2' && this.mapRadio === '2') {
                    // 火星坐标系转百度坐标系
                    return 3
                } else if (this.locationType === '3' && this.mapRadio === '1') {
                    // 百度坐标系转高德坐标系
                    return 4
                } else if (this.locationType === '3' && this.mapRadio === '2') {
                    // 百度转百度，不转
                    return 0
                }
            },

        },

    }
</script>

<style scoped>
    .left-part {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        margin: 3px;
    }

    .left-item {
        width: 100%;
        margin: 1rem 5px 5px;
    }

    .align-left {
        padding-left: 4rem;
        text-align: start;
    }

    .anals-result {
        padding-top: 10px;
    }

    .result-item {
        padding: 5px;
    }

    .input-text-desc {
        margin-left: 3rem;
        font-size: 12px;
        text-align: start;
    }

    .btn-list {
        display: flex;
        margin: 2px;
        justify-content: center;
    }

    .input-contain {
        width: 220px;
    }

    .row-flex-mid {
        display: flex;
        justify-content: center;
    }

    .m-l-10 {
        margin-left: 10px;
    }

    .m-t-10 {
        margin-top: 10px;
    }

    .radio-group {
        display: flex;
        justify-content: center;
        padding-top: 5px;
    }

    .radio-group > label {
        margin-right: 4px;
    }

    .detail-text {
        /*text-indent: 2rem;*/
        width: 210px;
        font-size: x-small;
        font-weight: 1;
        margin: 5px auto;
    }


</style>
