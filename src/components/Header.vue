<template>
    <div class="header">
        <div class="nav">
            <div class="nav-item">
                <a href="/#/">
                    HOME PAGE
                </a>
            </div>
            <div class="nav-item">
                <a href="/#/map/amap">
                    MAPTOOL
                </a>
            </div>
            <div class="nav-item">一夜暴富</div>
            <div class="nav-item">个人中心</div>
        </div>
        <input v-if="this.$route.path=='/'" class="input" placeholder="Search" @keyup.enter="searchAction"></input>
    </div>
</template>

<script>
    export default {
        name: "Header",
        created() {
            console.log(this.$route.path)
        },
        methods: {
            searchAction() {
                window.location.href = "https://www.baidu.com/s?ie=utf-8&word=12312"
            }
        }
    }
</script>

<style scoped lang="less">

    #search {
        width: 10%;
        position: absolute;
        top: 20%;
        left: 45%;
        z-index: 10;
        touch-action: pan-y;
    }

    .input {
        z-index: 10;
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 230px;
        max-width: 80%;
        outline: none;
        /* border: 1px solid rgba(255,255,255,0.3); */
        border: none;
        padding: 13px 15px;
        border-radius: 30px;
        color: rgba(255, 255, 255, 0.8);
        font-size: small;
        font-weight: normal;
        font-family: "Microsoft Yahei", sans-serif;
        text-align: center;
        background-color: rgba(255, 255, 255, .25);
        box-shadow: rgb(0 0 0 / 20%) 0 0 10px;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, top 0.25s, width 0.25s;
    }

    .input:hover {
        width: 460px;
    }

    .header{
        height: 90%;
        .nav{
            display: flex;
            height: 100%;
            float: right!important;
            margin-right: -15px;
        }
        .nav-item{
            width: 200px;
            height: 100%;
            text-transform: uppercase;
            font-size: 12px;
            line-height: 20px;
            font-weight: 800;
            letter-spacing: 1px;
            color: white;
            padding: 20px;
        }
        a {
            text-transform: uppercase;
            font-size: 12px;
            line-height: 20px;
            font-weight: 800;
            letter-spacing: 1px;
            color: white;
            text-decoration: none;
        }
    }

</style>
