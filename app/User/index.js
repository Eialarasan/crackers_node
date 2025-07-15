'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/register',
        type: MediaType.POST,
        middleware:[],
        method:Handler.UserRegister,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware:[],
        method:Handler.updateUser,
        options: {}
    },
    {
        path: '/login',
        type: MediaType.POST,
        middleware: [],
        method: Handler.UserLogin,
        options: {}
    },
    {
        path: '/delete',
        type: MediaType.POST,
        middleware: [authendicateToken],
        method: Handler.deleteUser,
        options: {}
    }
    ,{
        path: '/list',
        type: MediaType.GET,
        middleware: [authendicateToken],
        method: Handler.getUserList,
        options: {}
    },
   
]