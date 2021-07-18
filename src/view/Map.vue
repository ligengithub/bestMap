<template>
    <div class="mapbody">
        <LeftPart></LeftPart>
        <!--            <Amap></Amap>-->
        <!--            <router-view :gpsData="gpsData" :clearMapFlag="clearMapFlag"></router-view>-->
<!--        <RightPart></RightPart>-->
        <Amap></Amap>
        <Bmap></Bmap>
    </div>
</template>

<script>
    // import GpsTool from "./components/GpsTool";
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
                clearMapFlag: {}
            }
        },
        mounted() {
            EventBus.$on("gpsData", (val) => {
                this.gpsData = val;
            });
            EventBus.$on("clearMapFlag", (val) => {
                this.clearMapFlag = val;
            });

        }
    }
</script>

<style scoped lang="less">

    .mapbody{
        display: flex;
    }



</style>
