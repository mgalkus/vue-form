<template>
  <v-form class="d-flex flex-column align-center" @submit.stop.prevent="">
    <h2 class="mb-2">Client List</h2>
    <v-btn color="primary" @click="$emit('addClient')">Add Client</v-btn>
    <v-list max-width="100%">
      <template v-for="(client, index) in clients">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ getClientFullName(client) }}</v-list-item-title>
            <v-list-item-subtitle class="text--primary">{{client.phone}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ getClientFullAddress(client) }}</v-list-item-subtitle>
          </v-list-item-content>
          <div class="d-flex align-center">
            <v-icon class="mr-2" @click="removeClient(index)">mdi-delete</v-icon>
            <v-icon @click="editClient(index)">mdi-pencil</v-icon>
          </div>
        </v-list-item>
        <v-divider :key="`divider-${index}`"></v-divider>
      </template>
    </v-list>
  </v-form>
</template>

<script>
export default {
  name: "ClientsList",
  props: {
    clients: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    newClient: {}
  }),
  methods: {
    getClientFullName(client) {
      return client.firstName + ' ' + client.lastName
    },
    getClientFullAddress(client) {
      return client.address.street + ' ' + client.address.houseNr + ', ' + client.address.city + ', ' + client.address.postCode + ', ' + client.address.country
    },
    removeClient(index) {
      this.$emit("removeClient", index);
    },
    editClient(index) {
      this.$emit("editClient", index);
    }
  }
};
</script>
