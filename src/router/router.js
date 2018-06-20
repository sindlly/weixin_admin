import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/team',
    meta: {
        title: ''
    },
    name: '团队管理',
    component: Main,
    children: [
        { path: 'index/:id/:name', title: 'team', name: 'team', component: resolve => { require(['@/views/team/team.vue'], resolve); } }
    ]
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = [
    // {
    //     path: '/home',
    //     name: 'otherRouter',
    //     component: Main,
    //     children: [
    //         { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/newUser',
        name: 'newUser',
        component: Main,
        children: [
            { path: '/', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/user/userTemplate.vue'], resolve); } }
        ]
    },{
        path: '/userDetail',
        name: 'userDetail',
        component: Main,
        children: [
            { path: '/', title: {i18n: 'home'}, name: 'userDetail', component: resolve => { require(['@/views/user/userDetail.vue'], resolve); } }
        ]
    },{
        path: '/editRight',
        name: 'editRight',
        component: Main,
        children: [
            { path: '/', title: {i18n: 'home'}, name: 'editRight', component: resolve => { require(['@/views/right/rightTemplate.vue'], resolve); } }
        ]
    }
];

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/home',
    //     icon: 'ios-folder',
    //     name: 'group',
    //     title: 'dashboard',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'home',
    //             icon: 'ios-paper-outline',
    //             name: 'home',
    //             title: '首页',
    //             component: resolve => { require(['@/views/home/home.vue'], resolve); }
    //         },
    //     ]
    // },
    {
        path: '/group',
        icon: 'ios-folder',
        name: 'group',
        title: '部门管理',
        component: Main,
        children: [
            {
                path: 'group',
                icon: 'ios-paper-outline',
                name: 'page1',
                title: '部门管理',
                component: resolve => { require(['@/views/group/group.vue'], resolve); }
            },
        ]
    },

    {
        path: '/user',
        icon: 'ios-paper',
        title: '人员管理',
        name: 'user',
        component: Main,
        children: [
            { path: 'user', title: 'user', name: 'user', component: resolve => { require(['@/views/user/user.vue'], resolve); } }
        ]
    },
    {
        path: '/right',
        icon: 'ios-paper',
        title: '权限管理',
        name: 'right',
        component: Main,
        children: [
            { path: 'right', title: 'right', name: 'right', component: resolve => { require(['@/views/right/right.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    ...otherRouter,
    ...appRouter,
    page500,
    page403,
    page404,
    // team,

];
