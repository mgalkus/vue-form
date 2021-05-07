export default {
  data() {
    return {
      rules: {
        noEmpty: (v) => {
          // n of whitespace characters only
          const pattern = /^\s*$/
          return (!pattern.test(v) && !!v) || "Field required"
        }
      }
    }
  }
}
