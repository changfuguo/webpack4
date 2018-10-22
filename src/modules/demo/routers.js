const Home = () => import(/* webpackChunkName: "demo/home" */ './pages/home/index.vue');
export default [
    {path: '/', component: Home, name: '/', meta: {}},
  	{path: '/home', component: Home, name: 'home', meta: {}}

];


