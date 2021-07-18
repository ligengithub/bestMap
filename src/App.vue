<template>
    <div class="home">
        <div class="header">
            <Header>
            </Header>
        </div>
        <div class="middle">
            <router-view :gpsData="gpsData" :clearMapFlag="clearMapFlag"></router-view>
        </div>
    </div>
</template>

<script>
    import LeftPart from "./components/LeftPart";
    import Bottom from "./components/Bottom";
    import Header from "./components/Header";
    import RightPart from "./components/RightPart";
    import EventBus from "./event_bus";
    import Main from "./view/Main";


    export default {
        name: "App",
        components: {RightPart, LeftPart, Bottom, Header, EventBus,Main},
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

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 5px;*/
    }

    .home {
        /*height: -webkit-fill-available;*/
       height: 80%;
    }

    html{
        height: 100%;
        touch:auto
    }
    body{
        height: 100%;
        background: #dedede;
    }
    .header{
        height: 10%;
    }

    .middle {
        height: 80%;
    }

    .bottom{
        height: 10%;
    }

    .mapContainer {
        border-radius: 10px;
        flex: 1;
        margin: 3px;
        height: 750px;
    }
</style>
