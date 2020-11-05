<template>
  <div id="app">
    123
    <p>
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <router-link to="/map/baidu">Go to baidu</router-link>
      <router-link to="/map/gaode">Go to gaode</router-link>
    </p>
    <div style="width: 100px;height: 100px;background: red">
      <router-view></router-view>
    </div>
<!--    <GpsTool/>-->
  </div>
</template>

<script>
import GpsTool from "./components/GpsTool";
import Bmap from "./view/Bmap";
import Gmap from "./view/Gmap";
import Amap from "./view/Amap";

export default {
  name: 'App',
  components: {
    GpsTool,
    Bmap,
    Gmap,
    Amap
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
  margin-top: 10px;
}
</style>
