<template>
    <div class="mapContainer" id="container">Gmap</div>
</template>

<script>

    import point from '../assets/marker.png'
    import pointStart from '../assets/start.png'
    import pointEnd from '../assets/end.png'

    export default {
        name: "Gmap",
        components: {},
        props: ['gpsData', 'clearMapFlag'],
        data() {
            return {
                linePath: [],
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
            let map = new google.maps.Map(document.getElementById("container"), {
                center: {lat: 36.964, lng: -122.015},
                zoom: 15,
            });
            this.map = map;
        },
        watch: {
            gpsData(data) {
                console.log("gpaDATA-----------", data);
                this.linePath = data.linePath;
                // let center = new BMap.Point(parseFloat(this.linePath[0][0]), parseFloat(this.linePath[0][1]));
                let center = {};
                center.lng = parseFloat(this.linePath[0][0]);
                center.lat = parseFloat(this.linePath[0][1]);
                this.map.setCenter(center);
                this.plotLineAndMarker(this.map, this.linePath);
            },
            clearMapFlag(data) {
                console.log("clearMap", data);
                if (data.flag) {
                    // this.map.clearOverlays();
                    this.startMarker.setMap(null);
                    this.endMarker.setMap(null);
                    this.lineMarkers.forEach(m => {
                        m.setMap(null);
                    });
                    this.ployline.setMap(null)
                }
            }
        },
        methods: {
            plotLineAndMarker(map, path) {
                let pathline = [];
                path.forEach(p => {
                        let temp = {};
                        temp.lng = parseFloat(p[0]);
                        temp.lat = parseFloat(p[1]);
                        pathline.push(temp);
                    }
                );
                // 画线
                this.plotLine(map, pathline);
                // // 画起点和终点
                this.plotStartEndMarker(map, pathline[0], pathline[pathline.length - 1]);
                // // // 画路径上的点
                this.plotMarker(map, pathline);
            },

            plotLine(map, path) {
                console.log(path)
                let polyline = new google.maps.Polyline(
                    {
                        path: path,
                        strokeWeight: 2, // 线条宽度，默认为 1
                        strokeColor: '#FF0000', // 线条颜色
                        geodesic: true
                    });
                this.ployline = polyline;
                polyline.setMap(map);
            },
            plotMarker(map, path) {
                if (path.length <= 2) {
                    return
                }
                path.forEach((p, index) => {
                    if (index === 0 || index === path.length - 1) {
                        return
                    }

                    // const icon = {
                    //     url:point,
                    //     size: new google.maps.Size(16, 16),
                    //     origin: new google.maps.Point(100, 100)
                    // };
                    const image = {
                        url:point,
                        size: new google.maps.Size(20, 32),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(5, 10),
                    };

                    let marker = new google.maps.Marker({
                        position: p,
                        map,
                        title: "Hello World!",
                        icon: image
                    });
                    this.lineMarkers.push(marker);
                });
            },
            plotStartEndMarker(map, start, end) {

                let startMarker = new google.maps.Marker({
                    position: start,
                    map,
                    title: "Hello World!",
                    icon: pointStart
                });
                let endMarker = new google.maps.Marker({
                    position: end,
                    map,
                    title: "Hello World!",
                    icon: pointEnd
                });

                this.startMarker = startMarker;
                this.endMarker = endMarker;

            },
        }
    }
</script>

<style scoped>

</style>
