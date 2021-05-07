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
                :value="this.mode === 'create' ? '' : client.firstName"
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
                :value="this.mode === 'create' ? '' : client.lastName"
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
                :value="this.mode === 'create' ? '' : client.phone"
                :rules="[rules.noEmpty]"
                @input="onInputData('phone', $event)"
                label="Phone number"
                outlined
                dense
                id="phone"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="this.mode === 'create' ? '' : client.address.country"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('country', $event)"
                label="Country"
                outlined
                dense
                id="country"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="this.mode === 'create' ? '' : client.address.city"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('city', $event)"
                label="City"
                outlined
                dense
                id="city"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="this.mode === 'create' ? '' : client.address.street"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('street', $event)"
                label="Street name"
                outlined
                dense
                id="street"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="this.mode === 'create' ? '' : client.address.houseNr"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('houseNr', $event)"
                label="House number"
                outlined
                dense
                id="houseNr"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                :value="this.mode === 'create' ? '' : client.address.postCode"
                :rules="[rules.noEmpty]"
                @input="onInputAddress('postCode', $event)"
                label="Post code"
                outlined
                dense
                id="postCode"
              />
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-btn color="primary" @click="onSave"> Save </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import ValidationRules from "../mixins/ValidationRules";

export default {
  name: "CreateEditDialog",
  mixins: [ValidationRules],
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
    freshClientData: null,
    initialClientData: null
  }),
  created() {
    this.freshClientData = this.client
    // disconnecting from reference so initialClientData does not get changes in client:
    this.initialClientData = { ...this.client }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    getTitle() {
      return this.isCreateMode ? "Create new client" : "Edit client"
    },
    isCreateMode() {
      return this.mode === 'create'
    },
    isEditMode() {
      return this.mode === 'edit'
    }
  },
  methods: {
    onInputData(path, value) {
      this.freshClientData[path] = value;
    },
    onInputAddress(path, value) {
      this.freshClientData.address[path] = value;
    },
    onSave() {
      if (this.$refs.form.validate()) {
        this.isCreateMode ? this.$emit('saveNewClient', this.freshClientData) : this.$emit('saveExistingClient', this.freshClientData)
        this.dialog = false;
        this.$emit('closeDialog')
      }
    },
    onClickCloseDialog() {
      if (this.isEditMode) { this.$emit('revertExistingClient', this.initialClientData) }
      this.dialog = false;
      this.$emit('closeDialog')
    }
  }
};
</script>
