// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, { size: 'small'})


import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(codemirror)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {App},
    template: '<App/>'
})
