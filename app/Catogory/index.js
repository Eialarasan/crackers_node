'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/add',
        type: MediaType.POST,
        middleware:[authendicateToken],
        method:Handler.CatogoryAdd,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware:[authendicateToken],
        method:Handler.updateCategory,
        options: {}
    },
    
    {
        path: '/delete',
        type: MediaType.POST,
        middleware: [authendicateToken],
        method: Handler.deleteCategory,
        options: {}
    }
    ,{
        path: '/list',
        type: MediaType.GET,
        middleware: [authendicateToken],
        method: Handler.getCategoryList,
        options: {}
    },
   
]