export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', name: 'login', component: './User/Login' }
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            {
                path: '/',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
            },
            // article
            {
                path: '/article',
                icon: 'container',
                name: 'article',
                component: './Article/ArticleAdmin',
            },
            // tag
               {
                path: '/tag',
                icon: 'windows',
                name: 'tag',
                component: './Tag/TagAdmin',
            },
        ],
    },
]