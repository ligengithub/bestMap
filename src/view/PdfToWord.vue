<template>
    <div class="body">
        <h1>{{this.wishes}}</h1>
    </div>
</template>

<script>

    export default {
        name: "PdfToWord",
        components: {},
        data() {
            return {
                wishes: "开发中，这将是一个在线的Pdf转Word"
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="less">

    .body{
        text-align: center;
        margin-top: 200px;
    }




</style>
