import Vue from "vue";
import Vuex from "vuex";
import { initialClients } from "../constants/clients";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clients: []
  },
  mutations: {
    SET_CLIENTS(state, newClients) {
      state.clients = newClients;
    }
  },
  actions: {
    loadClients({ dispatch, commit }) {
      if (localStorage.getItem("clients")) {
        // if client list is found in localStorage, get it (it may also be empty if user deleted all clients):
        commit('SET_CLIENTS', JSON.parse(localStorage.getItem("clients")))
      } else {
        // if no client list found in localStorage, get and save to storage some initial client data:
        dispatch('performSave', initialClients)
      }
    },
    editClient( { getters, dispatch }, { client, index }) {
      const newClients = getters.getClients
      newClients.splice(index, 1, client);
      dispatch('performSave', newClients)
    },
    saveNewClient( { getters, dispatch }, client) {
      const newClients = getters.getClients
      newClients.push(client);
      dispatch('performSave', newClients)
    },
    removeClient( { getters, dispatch }, index) {
      const newClients = getters.getClients
      newClients.splice(index, 1);
      dispatch('performSave', newClients)
    },
    performSave( { commit }, newClients) {
      commit('SET_CLIENTS', newClients)
      localStorage.setItem("clients", JSON.stringify(newClients));
    }
  },
  getters: {
    getClients: state => state.clients
  }
});
