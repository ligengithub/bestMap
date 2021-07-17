<template>
    <div class="home">
        <div>
            <Header>
            </Header>
        </div>
        <div class="middle">
<!--            <LeftPart></LeftPart>-->
<!--            <router-view :gpsData="gpsData" :clearMapFlag="clearMapFlag"></router-view>-->
<!--            <RightPart></RightPart>-->
            <Main></Main>
        </div>
        <div>
            <Bottom>
            </Bottom>
        </div>
    </div>
</template>

<script>
    // import GpsTool from "./components/GpsTool";
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
        /*padding: 5px;*/
    }

    html{
        height: 100%;
    }
    body{
        height: 100%;
        background: #dedede;
    }

    .middle {
        display: flex;
    }

    .mapContainer {
        border-radius: 10px;
        flex: 1;
        margin: 3px;
        height: 750px;
    }
</style>
