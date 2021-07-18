<template>
    <div class="mapbody">
        <LeftPart></LeftPart>
<!--        <div class="">-->
            <Amap v-if="this.mapRadio == 1" :gpsData="gpsData" :clearMapFlag="clearMapFlag"></Amap>
            <Bmap v-if="this.mapRadio == 2" :gpsData="gpsData" :clearMapFlag="clearMapFlag"></Bmap>
<!--        </div>-->
    </div>
</template>

<script>
    import LeftPart from "../components/LeftPart";
    import Bottom from "../components/Bottom";
    import Header from "../components/Header";
    import RightPart from "../components/RightPart";
    import EventBus from "../event_bus";
    import Amap from "./Amap";
    import Bmap from "./Bmap";


    export default {
        name: "Map",
        components: {Bmap, Amap, RightPart, LeftPart, Bottom, Header, EventBus},
        data() {
            return {
                gpsData: {},
                clearMapFlag: {},
                mapRadio:1
            }
        },
        mounted() {
            EventBus.$on("gpsData", (val) => {
                this.gpsData = val;
            });
            EventBus.$on("clearMapFlag", (val) => {
                this.clearMapFlag = val;
            });
            EventBus.$on("mapRadio", (val) => {
                this.mapRadio = val;
            });
        }
    }
</script>

<style scoped lang="less">

    .mapbody{
        display: flex;
    }




</style>
