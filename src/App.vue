<template>
  <div id="app">
    <GpsTool/>
  </div>
</template>

<script>
import GpsTool from "./components/GpsTool";

export default {
  name: 'App',
  components: {
    GpsTool
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
  margin-top: 60px;
}
</style>
