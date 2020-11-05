<template>
      <div class="mapContainer" id="container">Amap</div>
</template>

<script>
    export default {
        name: "Amap",
      components: {},
      mounted() {
        var map = new AMap.Map('container', {
          center:[117.000923,36.675807],
          zoom:11
        });
      }
    }
</script>

<style scoped>

</style>
