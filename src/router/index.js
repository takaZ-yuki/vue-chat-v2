import Vue from "vue";
import VueRouter from "vue-router";
// import HomeView from '../views/HomeView.vue'
import RoomListView from "../views/RoomListView.vue";
import ChatBoardView from "../views/ChatBoardView.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
// import Firebase from "@/firebase/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// const auth = Firebase.auth;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RoomListView",
    component: RoomListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat",
    name: "ChatBoardView",
    component: ChatBoardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "SignUpView",
    component: SignUpView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    const user = sessionStorage.getItem('user');
    console.log(JSON.parse(user));

    if (user) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }

    // Firebaseのログイン情報を取得
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     next();
    //   } else {
    //     next({
    //       path: '/login',
    //       query: { redirect: to.fullPath },
    //     });
    //   }
    // });
  } else {
    next();
  }
})

export default router;
