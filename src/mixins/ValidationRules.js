export default {
  data() {
    return {
      rules: {
        noEmpty: (v) => {
          // n of whitespace characters only
          const pattern = /^\s*$/
          return (!pattern.test(v) && !!v) || "Field required"
        },
        isLink: (v) => {
          const pattern = /^(https:\/\/www\.|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
          return (pattern.test(v) && !!v) || this.$t('link_required')
        }
      }
    }
  }
}
