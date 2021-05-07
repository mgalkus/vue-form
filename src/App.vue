<template>
  <v-app>
    <v-container>
      <ClientsList
        :clients="clients"
        @addClient="onClickAddClient"
        @removeClient="onRemoveClient"
        @editClient="onInitiateClientEdit"
      />
      <CreateEditDialog
        v-model="dialog"
        :mode="dialogMode"
        :client="client"
        @saveNewClient="onSaveNewClient"
        @saveExistingClient="onSaveExistingClient"
        @revertExistingClient="onRevertExistingClient"
        @closeDialog="onCloseDialog"
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
    client: { ...emptyClientData },
    editingClientIndex: null
  }),
  mounted() {
    // if client list is found in localStorage, display it (it may also be empty if user deleted all clients):
    if (localStorage.getItem("clients")) {
      this.clients = JSON.parse(localStorage.getItem("clients"));
    } else {
      // if no client list found in localStorage, save and display some initial client data:
      this.clients = initialClients;
      this.saveCLientsToStorage();
    }
  },
  methods: {
    onClickAddClient() {
      this.dialogMode = "create";
      this.dialog = true;
    },
    onSaveNewClient(client) {
      this.clients.push(client);
      this.saveCLientsToStorage();
    },
    onSaveExistingClient(client) {
      this.clients.splice(this.editingClientIndex, 1, client);
      this.saveCLientsToStorage();
    },
    onRevertExistingClient(initialClientData) {
      this.clients.splice(this.editingClientIndex, 1, initialClientData);
    },
    onRemoveClient(index) {
      this.clients.splice(index, 1);
      this.saveCLientsToStorage();
    },
    onInitiateClientEdit(index) {
      this.client = this.clients[index];
      this.editingClientIndex = index;
      this.dialogMode = "edit";
      this.dialog = true;
    },
    saveCLientsToStorage() {
      const parsed = JSON.stringify(this.clients);
      localStorage.setItem("clients", parsed);
    },
    onCloseDialog() {
      this.client = emptyClientData;
    }
  }
};
</script>
