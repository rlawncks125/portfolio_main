import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import Home from "@/views/Home.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
  {
    path: "/foodChat",
    name: "foodChat",
    component: () =>
      import(/* webpackChunkName: "foodChat" */ "../views/FoodChat/Main.vue"),
    children: [
      {
        path: "",
        name: "",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/MyRoomList.vue"
          ),
      },
      {
        path: "myRoomList",
        name: "myRoomList",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/MyRoomList.vue"
          ),
      },
      {
        path: "search",
        name: "RoomList",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/SearchRoomList.vue"
          ),
        meta: {
          title: "채팅방 찾기",
        },
      },
      {
        path: "MyPage",
        name: "MyPage",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/MyPage.vue"
          ),
      },
      {
        path: ":uuid",
        name: "foodChatRoomJoin",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/FoodChat.vue"
          ),
      },
    ],
    meta: {
      title: "주변 음식점 리뷰 채팅방",
    },
  },
  {
    path: "/SubWay",
    name: "SubWay",
    component: () =>
      import(/* webpackChunkName: "SubWay" */ "../views/SubWay/Main.vue"),
    meta: {
      title: "지하철 시간표",
    },
  },
  // {
  //   path: "/foodChat/:uuid",
  //   name: "foodChatRoomJoin",
  //   component: () =>
  //     import(/* webpackChunkName: "foodChat" */ "../views/FoodChat/FoodChat.vue"),
  // },
  {
    // 다른 경로로 접근하면 / 주소로 리다이렉트
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  // history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  const fixedTitle = "김주찬의 포트 폴리오";
  const title = to.meta.title || undefined;
  if (typeof title === "string") {
    document.title = `${fixedTitle} | ${title}`;
  } else {
    document.title = fixedTitle;
  }
});

export default router;
