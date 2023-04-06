import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './view/Home.vue';
import Log from './view/Log.vue';
import Sign from './view/Sign.vue';
import Create from './view/Create.vue';
import Poll from './view/Poll.vue';
import Result from './view/Result.vue';
import Profil from './view/Profil.vue';
import NotFound from './view/NotFound.vue';

import './assets/main.css'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Log },
    { path: '/signup', component: Sign },
    { path: '/create', component: Create },
    { path: '/sondage/:id', component: Poll },
    { path: '/sondage/:id/results', component: Result },
    { path: '/profil', component: Profil },
    { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');