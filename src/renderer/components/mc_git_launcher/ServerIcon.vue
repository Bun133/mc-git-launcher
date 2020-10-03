<template>
  <img src = "src"
       class = "img"
       alt = "Server Icon"/>
</template>

<script>
export default {
name: "ServerIcon",
  props : {
    src : {type:String,required:true}
  }
}
</script>

<style scoped>
.img{
  border-radius: 50%;
}
</style>
