import { createRouter, createWebHistory } from "vue-router";
import Home from '@/views/Home.vue';

const routes = [  
  {
    path: '/', component: Home, name: 'Home'
  },
  {
    path: '/:name', component: () => import('@/views/PokemonDetail.vue'), name: 'PokemonDetail'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

export default router;
