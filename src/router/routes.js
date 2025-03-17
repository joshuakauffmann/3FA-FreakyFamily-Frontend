const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ImportPage.vue") },
      { path: "/export", component: () => import("pages/ExportPage.vue") },
      { path: "/import", component: () => import("pages/ImportPage.vue") },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error/ErrorNotFound.vue"),
  },
];

export default routes;
