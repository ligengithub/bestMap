<template>
    <div class="mapContainer" id="container">Bmap</div>
</template>

<script>
    import point from '../assets/marker.png'
    import pointStart from '../assets/start.png'
    import pointEnd from '../assets/end.png'
    import {bd09togcj02, bd09towgs84} from "../util/util";

    export default {
        name: "Bmap",
        components: {},
        props: ['gpsData', 'clearMapFlag'],
        data() {
            return {
                linePath: [],
                realLinePath: [],
                markers: [],
                zoom: 14,
                map: {},
                ployline: {},
                lineMarkers: [],
                startMarker: {},
                endMarker: {},
                totalLength: 0,
                startEndLen: 0
            }
        },

        mounted() {
            var map = new BMap.Map("container");    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.40420669, 39.90887389), 17);  // 初始化地图,设置中心点坐标和地图级别
            //添加地图类型控件
            map.addControl(new BMap.MapTypeControl({
                mapTypes: [
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]
            }));
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            this.map = map;
        },

        watch: {
            gpsData(data) {
                console.log("gpaDATA-----------", data);
                this.linePath = data.linePath;
                this.realLinePath = data.realLinePath;
                let center = new BMap.Point(parseFloat(this.linePath[0][0]), parseFloat(this.linePath[0][1]));
                this.map.setCenter(center);
                this.plotLineAndMarker(this.map, this.linePath);
            },
            clearMapFlag(data) {
                console.log("clearMap", data);
                if (data.flag) {
                    this.map.clearOverlays();
                }
            }
        },
        methods: {
            plotLineAndMarker(map, path) {
                let pathline = [];
                path.forEach(p => {
                        pathline.push(new BMap.Point(parseFloat(p[0]), parseFloat(p[1])));
                    }
                );
                // 画线
                this.plotLine(map, pathline);
                // // 画起点和终点
                this.plotStartEndMarker(map, pathline[0], pathline[pathline.length - 1]);
                // // 画路径上的点
                this.plotMarker(map, pathline);
            },

            plotLine(map, path) {
                let polyline = new BMap.Polyline(
                    path, {
                        strokeWeight: 2, // 线条宽度，默认为 1
                        strokeColor: 'red', // 线条颜色
                    });
                this.ployline = polyline;
                map.addOverlay(polyline);
            },
            plotMarker(map, path) {
                let _this = this;
                let markers = [];
                if (path.length <= 2) {
                    return
                }
                var myIcon = new BMap.Icon(point, new BMap.Size(16, 16));

                path.forEach((p, index) => {
                    if (index === 0 || index === path.length - 1) {
                        return
                    }
                    let marker = new BMap.Marker(p, {
                        icon: myIcon
                    });
                    this.lineMarkers.push(marker);
                    map.addOverlay(marker)

                    marker.addEventListener("click", function (e) {
                        let opts = {
                            // width: 100,     // 信息窗口宽度
                            height: 220,     // 信息窗口高度
                        };
                        let infoWindow = new BMap.InfoWindow(
                            "<div>" +
                            "<p class='input-item'>当前地图坐标系：</p>" +
                            "<p class='input-item'>经度 :" + e.point.lng + "</p>" +
                            "<p class='input-item'>维度 :" + e.point.lat + "</p>" +
                            "<p class='input-item'>录入数据坐标系：</p>" +
                            "<p class='input-item'>经度 :" + _this.realLinePath[index][0] + "</p>" +
                            "<p class='input-item'>维度 :" + _this.realLinePath[index][1] + "</p>" +
                            "</div>", opts);  // 创建信息窗口对象

                        this.map.openInfoWindow(infoWindow, p); //开启信息窗口
                    });

                });
            },
            plotStartEndMarker(map, start, end) {
                let _this = this;
                var startIcon = new BMap.Icon(pointStart, new BMap.Size(32, 48));
                var endIcon = new BMap.Icon(pointEnd, new BMap.Size(32, 48));

                let startMarker = new BMap.Marker(start, {
                    icon: startIcon
                });
                let endMarker = new BMap.Marker(end, {
                    icon: endIcon,
                });
                this.startMarker = startMarker;
                this.endMarker = endMarker;

                map.addOverlay(startMarker);
                map.addOverlay(endMarker);


                this.startMarker.addEventListener("click", function (e) {
                    let opts = {
                        width: 80,     // 信息窗口宽度
                        height: 220,     // 信息窗口高度
                    };
                    let infoWindow = new BMap.InfoWindow("<div>" +
                        "<p class='input-item'>当前地图坐标系：</p>" +
                        "<p class='input-item'>经度 :" + e.point.lng + "</p>" +
                        "<p class='input-item'>维度 :" + e.point.lat + "</p>" +
                        "<p class='input-item'>录入数据坐标系：</p>" +
                        "<p class='input-item'>经度 :" + _this.realLinePath[0][0] + "</p>" +
                        "<p class='input-item'>维度 :" + _this.realLinePath[0][1] + "</p>" +
                        "</div>", opts);  // 创建信息窗口对象

                    this.map.openInfoWindow(infoWindow, start); //开启信息窗口
                });
                this.endMarker.addEventListener("click", function (e) {
                    let opts = {
                        width: 80,     // 信息窗口宽度
                        height: 220,     // 信息窗口高度
                    };
                    let infoWindow = new BMap.InfoWindow("<div>" +
                        "<p class='input-item'>当前地图坐标系：</p>" +
                        "<p class='input-item'>经度 :" + e.point.lng + "</p>" +
                        "<p class='input-item'>维度 :" + e.point.lat + "</p>" +
                        "<p class='input-item'>录入数据坐标系：</p>" +
                        "<p class='input-item'>经度 :" + _this.realLinePath[_this.realLinePath.length - 1][0] + "</p>" +
                        "<p class='input-item'>维度 :" + _this.realLinePath[_this.realLinePath.length - 1][1] + "</p>" +
                        "</div>", opts);  // 创建信息窗口对象

                    this.map.openInfoWindow(infoWindow, end); //开启信息窗口
                });
            },
        }
    }
</script>

<style scoped>
    .mapContainer{
        border-radius: 20px;
        width: 90%;
    }

</style>
