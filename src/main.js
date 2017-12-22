import Vue from 'vue'
import App from 'src/App.vue'

import Transfer from 'src/components/transfer'

Vue.component('Transfer', Transfer)

new Vue({
  el: '#app',
  render: h => h(App)
})
