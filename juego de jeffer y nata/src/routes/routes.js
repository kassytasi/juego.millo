import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Cabina from "../views/Cabina.vue";
import Avarage from "../views/Avarage.vue";
import Levels from "../views/Levels.vue"
import Ranking from "../views/Ranking.vue";
import Name from "../views/Name.vue";


const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/cabina",
    name: "cabina",
    component: Cabina
  },
  {
    path: "/avarage",
    name: "avarage",
    component: Avarage
  },
  {
    path: "/levels",
  name: "levels",
    component: Levels
  },
  {
    path: "/ranking",
    name: "ranking",
    component: Ranking
  },
  {
    path: "/name",
    name: "name",
    component: Name
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
