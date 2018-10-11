const Home = () => import(/* webpackChunkName: "ucar/home" */ './pages/home/index.vue');
const License = () => import(/* webpackChunkName: "ucar/license" */ './pages/license/index.vue');
export default [
    {path: '/', component: Home, name: 'home', meta: {}},
    {path: '/home', component: Home, name: 'home', meta: {}},
    {path: '/license', component: License, name: 'license', meta: {}}
];


