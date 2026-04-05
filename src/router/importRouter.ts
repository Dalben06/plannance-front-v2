export const importRouter = [
    {
        path: 'import',
        name: 'import',
        component: () => import('@/views/ImportView.vue')
    },
    {
        path: 'import/register',
        component: () => import('@/views/ImportRegister.vue'),
        children: [
            {
                path: '',
                name: 'import-register',
                component: () => import('@/components/import/ImportFile.vue')
            },
            {
                path: ':id/review',
                name: 'import-review',
                component: () => import('@/components/import/UpdateRecord.vue')
            },
            {
                path: ':id/confirm',
                name: 'import-confirm',
                component: () => import('@/components/import/ConfirmImportRecords.vue')
            }
        ]
    }
];
