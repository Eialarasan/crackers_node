'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/add',
        type: MediaType.POST,
        middleware:[],
        method:Handler.StoreAdd,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware:[],
        method:Handler.updateStore,
        options: {}
    },
    {
        path: '/login',
        type: MediaType.POST,
        middleware: [],
        method: Handler.StoreLogin,
        options: {}
    },
    {
        path: '/delete',
        type: MediaType.POST,
        middleware: [authendicateToken],
        method: Handler.deleteStore,
        options: {}
    }
    ,{
        path: '/list',
        type: MediaType.GET,
        middleware: [authendicateToken],
        method: Handler.getStoreList,
        options: {}
    },
   
]