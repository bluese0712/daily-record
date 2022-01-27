import { RouteRecordRaw } from 'vue-router';
import layouts from '@/layouts/Index.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layouts',
        component: layouts,
        redirect: '/expense',
        children: [
            {
                path: '/expense',
                name: 'Expense',
                component: () => import('@/views/Expense/Index.vue')
            },
            {
                path: '/record',
                name: 'Record',
                component: () => import('@/views/Record/Index.vue')
            },
            {
                path: '/movement',
                name: 'Movement',
                component: () => import('@/views/Movement/Index.vue')
            },
            {
                path: '/settings',
                name: 'Settings',
                component: () => import('@/views/Settings/Index.vue')
            }
        ]
    }
];

export default routes;
