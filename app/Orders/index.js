'use strict';

import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/create',
        type: MediaType.POST,
        middleware: [],
        method: Handler.createOrder,
        options: {}
    },
    {
        path: '/list',
        type: MediaType.GET,
        middleware: [],
        method: Handler.getOrderList,
        options: {}
    },
    {
        path: '/update',
        type: MediaType.POST,
        middleware: [],
        method: Handler.updateOrder,
        options: {}
    },
    {
        path: '/status',
        type: MediaType.POST,
        middleware: [],
        method: Handler.updateOrderStatus,
        options: {}
    },
    {
        path: '/payment',
        type: MediaType.POST,
        middleware: [],
        method: Handler.updatePaymentStatus,
        options: {}
    }
];
