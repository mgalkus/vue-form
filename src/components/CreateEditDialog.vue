<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    light
    @keydown.esc="onClickCloseDialog"
    @keydown.enter.prevent="onSave"
  >
    <v-form lazy-validation @submit.stop.prevent="" ref="form">
      <v-card class="pa-4">
        <v-card-title class="mb-4">
          <h4>{{ getTitle }}</h4>
          <v-spacer />
          <v-icon @click="onClickCloseDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.firstName"
                :rules="[rules.noEmpty]"
                @input="onInputData('firstName', $event)"
                label="First name"
                outlined
                dense
                id="firstName"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.lastName"
                :rules="[rules.noEmpty]"
                @input="onInputData('lastName', $event)"
                label="Last name"
                outlined
                dense
                id="lastName"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.phone"
                :rules="[rules.noEmpty, rules.isPhone]"
                @input="onInputData('phone', $event)"
                label="Phone number"
                outlined
                dense
                id="phone"
              />
            </v-col>
            <v-col class="mt-n4 mb-4" cols="12">
              <vue-google-autocomplete
                autocomplete="off"
                id="map"
                placeholder="Start typing to look up address"
                @placechanged="getFetchedAddress"
                @error="onFetchError"
              ></vue-google-autocomplete>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-autocomplete
                :items="countries"
                :value="localClient.address.country"
                @input="onInputAddress('country', $event)"
                :rules="[rules.noEmpty]"
                dense
                label="Country"
                outlined
                id="country"
                ref="country"
              >
              </v-autocomplete>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.address.locality"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('locality', $event)"
                label="City"
                outlined
                dense
                id="city"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.address.route"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('route', $event)"
                label="Street name"
                outlined
                dense
                id="street"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.address.street_number"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('street_number', $event)"
                label="House number"
                outlined
                dense
                id="StreetNumber"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="localClient.address.postal_code"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('postal_code', $event)"
                label="Post code"
                outlined
                dense
                id="postCode"
              />
            </v-col>
            <v-col class="mt-n4" cols="12">
              <v-btn color="primary" @click="onSave"> Save </v-btn>
            </v-col>
            <v-col v-if="fetchError" cols="12">
              <span class="error-message">Something went wrong getting your address from Google API. Try again.</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import VueGoogleAutocomplete from "vuetify-vue-google-autocomplete";
import ValidationRules from "../mixins/ValidationRules";
import { countries } from "../constants/countries";

export default {
  name: "CreateEditDialog",
  mixins: [ValidationRules],
  components: { VueGoogleAutocomplete },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    client: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      required: true
    }
  },
  data: () => ({
    localClient: null,
    initialClientData: null,
    fetchError: false
  }),
  created() {
    this.localClient = JSON.parse(JSON.stringify(this.client));
    this.initialClientData = JSON.parse(JSON.stringify(this.client));
  },
  computed: {
    countries() {
      return countries
    },
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    getTitle() {
      return this.isCreateMode ? "Create new client" : "Edit client";
    },
    isCreateMode() {
      return this.mode === "create";
    },
    isEditMode() {
      return this.mode === "edit";
    }
  },
  methods: {
    getFetchedAddress(data) {
      const localThis = this;
      Object.entries(data).map((e) => {
        const param = e[0];
        const value = e[1];
        if (param === 'country' || param === 'locality' || param === 'route' || param === 'street_number' || param === 'postal_code') {
          localThis.onInputAddress(param, value)
        }
      })
    },
    onFetchError(err) {
      console.log(err);
      this.fetchError = true;
    },
    onInputData(path, value) {
      this.localClient[path] = value;
    },
    onInputAddress(path, value) {
      this.localClient.address[path] = value;
    },
    onSave() {
      if (this.$refs.form.validate()) {
        const eventName = this.isCreateMode ? "saveNewClient" : "saveExistingClient";
        this.$emit(eventName, this.localClient);
        this.cleanData()
      }
    },
    onClickCloseDialog() {
      this.$emit("close");
      this.cleanData();
    },
    cleanData() {
      this.dialog = false;
      this.fetchError = false;
    }
  }
};
</script>
<style scoped>
  .error-message {
    color: darkred
  }
</style>
