import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios';
import VueAxios from 'vue-axios';

const vm = createApp(App)

vm.use(VueAxios, axios)
vm.mount('#app');

