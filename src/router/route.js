import Bmap from "../view/Bmap";
import Amap from "../view/Amap";
import Gmap from "../view/Gmap";
import Main from "../view/Main";
import Map from "../view/Map"
import GoodLucky from "../view/GoodLucky";
import PdfToWord from "../view/PdfToWord";

 const routes = [
    // 动态路径参数 以冒号开头
     {
         path: '/',
         component: Main
     },
     {
         path: '/map/amap',
         component: Map
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
     {
         path: '/goodLucky',
         component: GoodLucky
     },
     {
         path: '/pdfToWord',
         component: PdfToWord
     },
];


export default routes;
