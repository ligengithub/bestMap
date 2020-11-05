<template>
  <div class="home">
    <div>
      <Header>
      </Header>
    </div>
    <div class = "middle">
      <LeftPart></LeftPart>
      <router-view></router-view>
      <RightPart></RightPart>
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
export default {
  name: "App",
  components: {RightPart, LeftPart,Bottom,Header}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
  .home{
    padding: 5px;
  }

  .middle{
    display: flex;
  }

  .mapContainer{
    border-radius: 10px;
    flex: 1;
    margin: 3px;
  }
</style>
