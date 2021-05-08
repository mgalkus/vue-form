export default {
  data() {
    return {
      rules: {
        noEmpty: (v) => {
          // n of whitespace characters only
          const pattern = /^\s*$/
          return (!pattern.test(v) && !!v) || "Field required"
        },
        isPhone: (v) => {
          const pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
          return pattern.test(v) || "Invalid phone format"
        }
      }
    }
  }
}
