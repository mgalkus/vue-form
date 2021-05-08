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
        @close="onCloseDialog"
      />
    </v-container>
  </v-app>
</template>

<script>
import { emptyClientData, initialClients } from "./constants/clients";
import ClientsList from "./components/ClientsList";
import CreateEditDialog from "./components/CreateEditDialog";

export default {
  name: "App",
  components: { ClientsList, CreateEditDialog },
  data: () => ({
    dialog: false,
    dialogMode: "",
    clients: [],
    client: null,
    editingClientIndex: null
  }),
  mounted() {
    if (localStorage.getItem("clients")) {
      // if client list is found in localStorage, display it (it may also be empty if user deleted all clients):
      this.clients = JSON.parse(localStorage.getItem("clients"));
    } else {
      // if no client list found in localStorage, save and display some initial client data:
      this.clients = initialClients;
      this.saveClientsToStorage();
    }
  },
  methods: {
    onClickAddClient() {
      this.client = JSON.parse(JSON.stringify(emptyClientData));
      this.dialogMode = "create";
      this.dialog = true;
    },
    onSaveNewClient(client) {
      this.clients.push(client);
      this.saveClientsToStorage();
    },
    onSaveExistingClient(client) {
      this.clients.splice(this.editingClientIndex, 1, client);
      this.saveClientsToStorage();
    },
    onRemoveClient(index) {
      this.clients.splice(index, 1);
      this.saveClientsToStorage();
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
    },
    onCloseDialog(initialClientData) {
      if (this.dialogMode === 'edit') {
        this.clients.splice(this.editingClientIndex, 1, initialClientData)
        this.client = { ...emptyClientData };
      } else { this.client = initialClientData }
      this.cleanData();
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
