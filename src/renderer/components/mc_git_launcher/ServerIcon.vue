<template>
  <v-img :src="src"
         class="img"
         :alt="serverName"
         max-height=75px
         max-width=75px
  />
</template>

<script>
export default {
  name: "ServerIcon",
  props: {
    src: {type: String, required: true},
    serverName:{type:String,required: true}
  }
}
</script>

<style scoped>
.img {
  border-radius: 50%;
}
</style>
