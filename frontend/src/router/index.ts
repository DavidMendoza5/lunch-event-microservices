import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/app/layout/app-layout.vue'),
      redirect: 'home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/app/home/home.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../views/app/orders/order.vue'),
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../views/app/warehouse/warehouse.vue'),
        },
        {
          path: 'sales',
          name: 'sales',
          component: () => import('../views/app/sales/sale.vue'),
        },
      ],
    },
  ],
})

export default router
