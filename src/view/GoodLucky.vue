<template>
    <div class="body">
        <h1>{{this.wishes}}</h1>
    </div>
</template>

<script>

    export default {
        name: "GoodLucky",
        components: {},
        data() {
            return {
                wishes: "什么时候能中奖啊!!!"
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="less">

    .body{
        width: 100%;
        margin: auto;
        text-align: center;
        margin-top: 200px;
    }




</style>
