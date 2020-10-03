<template>
  <v-app>
    <v-card
      height=auto
      width=100px
      class="mx-auto"
    >
      <v-navigation-drawer permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              MC Git Launcher
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list
          dence
          nav
        >
          <v-list-item>
            <v-list-item-icon>
              <ServerIcon src="../../static/vuetify-logo.svg"></ServerIcon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Test Server
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-navigation-drawer>
    </v-card>
  </v-app>
</template>

<script>
import ServerIcon from "../../components/mc_git_launcher/ServerIcon"
export default {
  name: "Test",
  components: {ServerIcon}
}
</script>

<style scoped>

</style>
