const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/_HomePage.vue") },
      { path: "/learned", component: () => import("pages/LearnedPage.vue") },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error/ErrorNotFound.vue"),
  },
];

export default routes;
