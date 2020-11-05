<template>
    <div class="left-part">
        <div class="left-item">
            <el-radio-group v-model="mapRadio" size="mini" @change="changeMap">
                <el-radio-button label='1'>高德</el-radio-button>
                <el-radio-button label='2'>百度</el-radio-button>
                <el-radio-button label='3'>google</el-radio-button>
            </el-radio-group>
        </div>

        <div class="left-item">
            <div class="input-text-desc">
                <span>上传excel解析(只能上传excel/csv文件)</span>
            </div>
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
            </el-upload>
            <div class="btn-list">
                <el-button type="primary" size="small">上传<i
                        class="el-icon-upload el-icon--right"></i>
                </el-button>
                <el-button class="down-btn" type="primary" size="small"
                           @click="downTemplate">下载<i
                        class="el-icon-download el-icon--right"></i>
                </el-button>
                <el-button class="down-btn" type="primary" size="small"
                           @click="downTemplate">预览<i
                        class="el-icon-view el-icon--right"></i>
                </el-button>
            </div>
        </div>

        <div class="left-item">
            <div class="input-text-desc">
                <span>地图绘制</span>
            </div>
            <div class="btn-list">
                <el-button class="down-btn" type="primary" size="small"
                           @click="downTemplate">开始画线
                </el-button>
                <el-button class="down-btn" type="primary" size="small"
                           @click="downTemplate">删除尾节点
                </el-button>
                <el-button class="down-btn" type="primary" size="small"
                           @click="downTemplate">导出数据<i
                        class="el-icon-down el-icon--right"></i>
                </el-button>
            </div>

        </div>

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
                            :rows="12"
                            placeholder="格式如下 :  112.59982,31.197446, 112.59423,31.197646, 112.59124,31.197246, 112.59382,31.197546"
                            v-model="gpsString">
                    </el-input>
                </div>
            </div>

        </div>

        <div class="left-item">
            <div class="btn-list">
                <el-button size="small" type="primary" @click="plotLineByString">解析</el-button>
                <el-button size="small" type="primary"
                           @click="clearGpsString"> 清空输入
                </el-button>
                <el-button size="small" type="primary" style="width: 90px" @click="clearMarkAndLine">清除标记
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
    export default {
        created() {
            console.log("create")
        },

        mounted() {
            console.log("mounte")
        },
        methods: {
            changeMap() {
                console.log(this.mapRadio)
                if (this.mapRadio === '2') {
                    this.$router.push({path: "/map/baidu"})
                } else if (this.mapRadio === '3') {
                    this.$router.push({path: "/map/google"})
                } else {
                    this.$router.push({path: "/map/gaode"})
                }
            },


            handleRemove() {
                this.clearMarkAndLine();
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
            clearGpsString() {
                this.gpsString = '';
            },
            clearMarkAndLine() {
                // 清除线
                this.linePath = [];
                this.setMarker(this.linePath);
                this.totalLength = 0;
            },
        },
        name: "LeftPart",
        data() {
            return {
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
        }
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
        padding-left: 1rem;
        text-align: start;
    }

    .anals-result {
        padding-top: 10px;
    }

    .result-item {
        padding: 5px;
    }

    .input-text-desc {
        padding-left: 1rem;
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


</style>
