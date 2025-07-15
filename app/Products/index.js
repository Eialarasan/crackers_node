'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/add',
        type: MediaType.POST,
        middleware:[],
        method:Handler.ProductAdd,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware:[],
        method:Handler.updateProduct,
        options: {}
    },
    {
        path: '/login',
        type: MediaType.POST,
        middleware: [],
        method: Handler.ProductLogin,
        options: {}
    },
    {
        path: '/delete',
        type: MediaType.POST,
        middleware: [authendicateToken],
        method: Handler.deleteProduct,
        options: {}
    }
    ,{
        path: '/list',
        type: MediaType.GET,
        middleware: [authendicateToken],
        method: Handler.getProductList,
        options: {}
    },
   
]