import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import routes from './routers.js';
import App from './app.vue';
import store from './store/index.js';
import {SET_TICKET} from './store/constants';
import Toast from  '../../common/components/toast/toast.js';
import Loading from  '../../common/components/loading/loading.js';
import api from './api';


Vue.use(VueRouter);
Vue.use(VueResource);
window.onerror = function(e) {
	// send error to
};
window.Toast = Toast;
window.Loading = Loading;
// if(process.env.NODE_ENV == 'production'){}

const router = new VueRouter({
    mode: 'hash',
    routes
});

router.beforeEach((to, from, next) => {
    next();
});

// router.afterEach((to, from, next) => {

// });

new Vue({
    el: '#application',
    store,
    router,
    render: h => h(App)
});
