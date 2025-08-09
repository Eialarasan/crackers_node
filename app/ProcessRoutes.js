'use strict';

import { MediaType } from "../config";


export default (router, routes) => {
    console.log('Processing routes:', routes.map(r => ({ path: r.path, type: r.type })));

    return routes.map(route => {
        console.log(`Registering route: ${route.type} ${route.path}`);
        const middleWare = route.middleware || [];
        switch (route.type) {
            case MediaType.GET:
                return router.get(route.path, ...middleWare, route.method);
            case MediaType.POST:
                return router.post(route.path, ...middleWare, route.method);
            case MediaType.PUT:
                return router.put(route.path, ...middleWare, route.method);
            case MediaType.DELETE:
                return router.delete(route.path, ...middleWare, route.method);
        }
    })
}