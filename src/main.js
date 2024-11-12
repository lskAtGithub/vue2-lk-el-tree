import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

const app = new Vue({
  render: (h) => h(App)
})

Vue.use(ElementUI);
app.$mount('#app')
