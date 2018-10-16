import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import routes from './routers.js';
import App from './app.vue';
import store from './store/index.js';
import Toast from  '../../common/components/toast/toast.js';
import api from './api';


Vue.use(VueRouter);
Vue.use(VueResource);
window.onerror = function(e) {
    // send error to
    console.log(e);
};
window.Toast = Toast;
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

if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
