import Bmap from "../view/Bmap";
import Amap from "../view/Amap";
import Gmap from "../view/Gmap";
import Main from "../view/Main";

 const routes = [
    // 动态路径参数 以冒号开头
     {
         path: '/',
         component: Main
     },
     {
         path: '/map/amap',
         component: Amap
     },
    {
        path: '/map/baidu',
        component: Bmap
    },
    {
        path: '/map/gaode',
        component: Amap
    },
    {
        path: '/map/google',
        component: Gmap
    },
];


export default routes;
