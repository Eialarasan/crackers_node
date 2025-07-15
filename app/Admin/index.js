'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/register',
        type: MediaType.POST,
        middleware:[],
        method:Handler.AdminRegister,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware:[],
        method:Handler.updateAdmin,
        options: {}
    },
    {
        path: '/login',
        type: MediaType.POST,
        middleware: [],
        method: Handler.AdminLogin,
        options: {}
    },
    {
        path: '/delete',
        type: MediaType.POST,
        middleware: [authendicateToken],
        method: Handler.deleteAdmin,
        options: {}
    }
    ,{
        path: '/list',
        type: MediaType.GET,
        middleware: [authendicateToken],
        method: Handler.getAdminList,
        options: {}
    },
   
]