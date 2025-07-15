'use strict';

import { authendicateToken } from "../../Security/JwtAuth";
import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    
    {
        path: '/login',
        type: MediaType.POST,
        middleware: [],
        method: Handler.SuperadminLogin,
        options: {}
    }
   
]