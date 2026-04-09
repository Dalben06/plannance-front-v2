export const templateRouter = [
    {
        path: 'template',
        name: 'template-new',
        component: () => import('@/views/TemplateView.vue')
    },
    {
        path: 'template/:id',
        name: 'template-edit',
        component: () => import('@/views/TemplateView.vue')
    }
];
