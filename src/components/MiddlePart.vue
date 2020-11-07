<template>
    <div style="flex: 1">
        <router-view :gpsData = "gpsData"></router-view>
    </div>
</template>

<script>
    import EventBus from "../event_bus";

    export default {
        name: "MiddlePart",
        mounted() {
            EventBus.$on("gpsData", (val) => {
               this.gpsData = val;
            })
        },

        data(){
            return{
                gpsData:{}
            }
        },
    }
</script>

<style scoped>

</style>
