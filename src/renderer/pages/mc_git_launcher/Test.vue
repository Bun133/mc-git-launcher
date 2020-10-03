<template>
  <v-app>
    <v-navigation-drawer app permanent width=auto>
<!--      <v-list-item>-->
<!--        <v-list-item-content>-->
<!--          <v-list-item-title class="title">-->
<!--            MC Git Launcher-->
<!--          </v-list-item-title>-->
<!--        </v-list-item-content>-->
<!--      </v-list-item>-->
<!--      <v-divider></v-divider>-->
      <v-list
        class="pl-0"
        dence
        nav
      >
        <Server icon-src="/maezawa.png"
                v-for="server in servers"
                :key="server"
                :server-name="server"/>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import ServerIcon from "../../components/mc_git_launcher/ServerIcon"
import Server from "../../components/mc_git_launcher/Server";

export default {
  name: "Test",
  components: {Server, ServerIcon},
  data() {
    return {
      servers: [
        "Server 1","Server 2","Server 3"
      ]
    }
  }
}
</script>

<style scoped>

</style>
