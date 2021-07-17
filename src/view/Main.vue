<template>
    <div>
        <div v-for="(item,i) in images" class="img-figure" :style="styles[i]" @click="reRandom">
            <img :src="item.url" alt=""/>
        </div>
    </div>
</template>

<script>
    import ImgsData from '../util/imgsdata.json'

    let ImgInfos = ImgsData.map((img) => {
        return Object.assign({},
            img, {url: require('../assets/imgs/' + img.filename)}
        )
    })


    export default {
        name: "Main",
        components: {},
        props: [],
        data() {
            return {
                images: ImgInfos,
                styles: this.getRandomStyle()
            }
        },
        created() {

        },
        mounted() {
            console.log()
        },

        // 监测 data 变化
        watch: {},

        methods: {
            getRandomStyle() {

                let array = new Array();
                // console.log(this.images.size())

                // this.ImgInfos.forEach((item, i) => {

                // console.log(i)
                // })
                // 20.
                for (let i = 0; i < 20; i++) {
                    array.push({
                        top: Math.random() * 920 + "px",
                        left: Math.random() * 1271 + "px",
                        transform: this.getRandomDeg()
                    })
                }
                return array;
            },
            getRandomDeg() {
                let deg = (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
                console.log(deg)
               return "rotate("+deg+"deg)"
            },
            reRandom(){
                this.styles = this.getRandomStyle()
                console.log(this.styles)
            }
        }

    }


</script>

<style scoped lang="less">


    .img-figure {
        position: absolute;
        width: 280px;
        height: 300px;
        margin: 0;
        padding: 20px;
        border-radius: 3px;
        box-sizing: border-box;
        perspective: 1800px;
        box-shadow: 5px 5px 16px -1px rgba(0, 0, 0, 0.19);
        background: #fff;
        cursor: pointer;
        transform-style: preserve-3d;
        transform-origin: 0 50% 0;
        transition: left 2s ease-in-out,
        top 2s ease-in-out,
        transform 2s ease-in-out;

        img {
            width: 240px;
        }

        figcaption {
            text-align: center;
        }

        .img-title {
            font-size: 16px;
            color: #a7a2a0;
            margin: 5px 0 0 0;
        }
    }
</style>
