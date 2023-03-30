import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './view/Home.vue';
import Log from './view/Log.vue';
import Sign from './view/Sign.vue';
import NotFound from './view/NotFound.vue';

import './assets/main.css'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Log },
    { path: '/signup', component: Sign },
    { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');