<template>
  <v-container>
    <nuxt-link to="mc_git_launcher/Test">To Test Link</nuxt-link>
    <nuxt-link to="mc_git_launcher/ExpandHover">To ExpandHover Link</nuxt-link>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.remote"
          label="Remote URL"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.local"
          label="Local Path"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.mc.email"
          label="Minecraft Email"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.mc.password"
          label="Minecraft Password"
          :append-icon="password.show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[password.required]"
          :type="password.show ? 'text' : 'password'"
          name="input-10-1"
          counter
          @click:append="password.show = !password.show"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.version"
          label="Minecraft Version"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="data.forge"
          label="Forge"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <action-button
          name="Clone"
          channel="clone"
          :data="data"
          @onResult="notification"
        ></action-button>
        <action-button
          name="Fetch"
          channel="fetch"
          :data="data"
          @onResult="notification"
        ></action-button>
        <action-button
          name="Update"
          channel="update"
          :data="data"
          @onResult="notification"
        ></action-button>
        <action-button
          name="ForceUpdate"
          channel="update.force"
          :data="data"
          @onResult="notification"
        ></action-button>
        <action-button
          name="Install Java"
          channel="java"
          :data="data"
          @onResult="notification"
        ></action-button>
        <action-button
          name="Launch"
          channel="launch"
          :data="data"
          @onResult="notification"
        ></action-button>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-progress-linear :value="progress.modpack"></v-progress-linear>
  </v-container>
</template>

<script>
import actionButton from '~/components/actionButton.vue'

export default {
  components: {
    actionButton
  },
  data() {
    return {
      data: {
        local: 'C:\\softdata\\git\\hello-git',
        remote: 'https://github.com/kokoa0429/hello-git.git',
        mc: {
          email: '',
          password: '',
        },
        version: '1.15.2',
        forge: 'forge/forge-1.15.2-31.2.31-installer.jar',
      },
      snackbar: false,
      text: '',
      password: {
        show: false,
        required: value => !!value || 'Required.',
      },
      progress: {
        download: 0,
        modpack: 0,
      }
    }
  },
  created() {
    api.on('modpack-progress', (event, value) => {
      this.progress.modpack = value
    })
  },
  methods: {
    notification(newValue) {
      this.text = newValue.success ? ('Success: ' + newValue.result) : ('Failed: ' + newValue.reason)
      this.snackbar = true
    },
  }
}
</script>

<style>
</style>
