<template>
  <v-list-item>
    <v-list-item-icon>
      <ServerIcon :src="iconSrc" :server-name="serverName"></ServerIcon>
    </v-list-item-icon>

<!--    <v-list-item-content>-->
<!--      <v-list-item-title permanent>-->
<!--        {{serverName}}-->
<!--      </v-list-item-title>-->
<!--    </v-list-item-content>-->
  </v-list-item>
</template>

<script>
import ServerIcon from "./ServerIcon";

export default {
  name: "Server",
  components: {ServerIcon},
  props: {
    iconSrc: {type: String, required: true},
    serverName: {type: String, required: true}
  }
}
</script>

<style scoped>

</style>
