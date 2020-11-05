<template>
    <div class="mapContainer" id="container">Gmap</div>
</template>

<script>
    export default {
        name: "Gmap",
        components: {},
        mounted() {
            let map = new google.maps.Map(document.getElementById("container"), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8,
            });
        }
    }
</script>

<style scoped>

</style>
