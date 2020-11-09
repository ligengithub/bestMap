<template>
    <div class="mapContainer" id="container"></div>
</template>

<script>
    import point from '../assets/marker.png'
    import pointStart from '../assets/start.png'
    import pointEnd from '../assets/end.png'

    export default {
        name: "Amap",
        components: {},
        props: ['gpsData', 'clearMapFlag'],
        data() {
            return {
                linePath: [],
                markers: [],
                zoom: 17,
                map: {},
                ployline: {},
                lineMarkers: [],
                startMarker: {},
                endMarker: {},
                totalLength: 0,
                startEndLen: 0
            }
        },
        created() {

        },
        mounted() {
            this.map = new AMap.Map('container', {
                center: [116.40420669, 39.90887389],
                zoom: 17
            });
        },

        // 监测 data 变化
        watch: {
            gpsData(data) {
                console.log("gpaDATA")
                this.linePath = data.linePath;
                this.map.setCenter(this.linePath[0])
                this.plotLineAndMarker(this.map, this.linePath);
            },
            clearMapFlag(data) {
                if (data.flag) {
                    this.map.clearMap();
                    // this.map.remove(this.startMarker);
                    // this.map.remove(this.endMarker);
                    // this.map.remove(this.lineMarkers);
                    // this.map.remove(this.ployline);
                }
            }
        },

        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            },

            plotLineAndMarker(map, path) {
                let pathline = [];
                path.forEach(p => {
                        pathline.push(new AMap.LngLat(parseFloat(p[0]), parseFloat(p[1])))
                    }
                );
                // 画线
                this.plotLine(map, pathline);
                // // 画起点和终点
                this.plotStartEndMarker(map, pathline[0], pathline[pathline.length - 1]);
                // 画路径上的点
                this.plotMarker(map, pathline);
            },

            plotLine(map, path) {
                let polyline = new AMap.Polyline({
                    path: path,
                    borderWeight: 2, // 线条宽度，默认为 1
                    strokeColor: 'red', // 线条颜色
                    lineJoin: 'round' // 折线拐点连接处样式
                });
                this.ployline = polyline;
                map.add(polyline);
            },
            plotMarker(map, path) {

                let markers = [];

                if (path.length <= 2) {
                    return
                }

                path.forEach((p, index) => {
                    if (index === 0 || index === path.length - 1) {
                        return
                    }
                    let marker = new AMap.Marker({
                        position: p,
                        offset: new AMap.Pixel(-8, -8),
                        icon: point, // 添加 Icon 图标 URL,
                        size: 5,
                        title: '点'
                    });
                    this.lineMarkers.push(marker);
                    marker.on("click", this.showMarkerInfo);
                    map.add(marker)
                });
            },
            plotStartEndMarker(map, start, end) {

                let startMarker = new AMap.Marker({
                    position: start,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: '起点',
                    icon: pointStart,
                    offset: new AMap.Pixel(-16, -32),
                });
                let endMarker = new AMap.Marker({
                    position: end,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: '终点',
                    icon: pointEnd,
                    offset: new AMap.Pixel(-16, -32),
                });
                this.startMarker = startMarker;
                this.endMarker = endMarker;

                map.add(startMarker);
                map.add(endMarker);

                startMarker.on("click", this.showMarkerInfo)
                endMarker.on("click", this.showMarkerInfo)
            },
            showMarkerInfo(e) {
                //构建信息窗体中显示的内容
                var info = [];
                info.push("<p class='input-item'>经度 :" + e.lnglat.lng + "</p>");
                info.push("<p class='input-item'>维度 :" + e.lnglat.lat + "</p></div></div>");
                let infoWindow = new AMap.InfoWindow({
                    content: info.join("")  //使用默认信息窗体框样式，显示信息内容
                });
                infoWindow.open(this.map, e.lnglat);
            },
        }

    }


</script>

<style scoped>

    /*canvas{*/
    /*    width: auto !important;*/
    /*    max-width: none !important;*/
    /*}*/
</style>
