<template>
  <v-app>
    <v-container class="outer-container">
      <div>
        <ClientsList
          :class="[{'clients-list-shadow': $vuetify.breakpoint.smAndUp }, 'py-12']"
          :clients="clients"
          @addClient="onClickAddClient"
          @removeClient="onRemoveClient"
          @editClient="onClickClientEdit"
        />
      </div>
      <CreateEditDialog
        v-if="dialog"
        v-model="dialog"
        :mode="dialogMode"
        :client="client"
        @saveNewClient="onSaveNewClient"
        @saveExistingClient="onSaveExistingClient"
        @close="cleanData"
      />
    </v-container>
  </v-app>
</template>

<script>
import { emptyClientData } from "./constants/clients";
import ClientsList from "./components/ClientsList";
import CreateEditDialog from "./components/CreateEditDialog";

export default {
  name: "App",
  components: { ClientsList, CreateEditDialog },
  data: () => ({
    dialog: false,
    dialogMode: "",
    client: null,
    editingClientIndex: null
  }),
  computed: {
    clients() {
      return this.$store.getters.getClients
    }
  },
  mounted() {
    this.$store.dispatch('loadClients')
  },
  methods: {
    onClickAddClient() {
      this.client = JSON.parse(JSON.stringify(emptyClientData))
      this.dialogMode = "create";
      this.dialog = true;
    },
    onSaveNewClient(client) {
      this.$store.dispatch('saveNewClient', client)
    },
    onSaveExistingClient(client) {
      const index = this.editingClientIndex
      this.$store.dispatch('editClient', { client, index})
      this.cleanData()
    },
    onRemoveClient(index) {
      this.$store.dispatch('removeClient', index)
    },
    onClickClientEdit(index) {
      this.client = this.clients[index];
      this.editingClientIndex = index;
      this.dialogMode = "edit";
      this.dialog = true;
    },
    saveClientsToStorage() {
      const parsed = JSON.stringify(this.clients);
      localStorage.setItem("clients", parsed);
      this.cleanData()
    },
    cleanData() {
      this.dialogMode = ''
      this.editingClientIndex = null
      this.client = emptyClientData
    }
  }
};
</script>

<style scoped>
  .outer-container {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
  }
  .clients-list-shadow {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
</style>
