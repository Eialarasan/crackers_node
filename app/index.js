import express from 'express';
import ProcessRoutes from './ProcessRoutes';
import userRouters from './User/index'
import adminRouters from './Admin/index'
import storeRouters from './Stores/index'
import productRouters from './Products/index'
import superadminRouters from './Superadmin/index'
let userRouter = express.Router(ProcessRoutes);
if (userRouters && userRouters.length > 0) {
    userRouter = ProcessRoutes(userRouter, userRouters);
} else {
    console.error('There is no user route configured')
}


let adminRouter = express.Router(ProcessRoutes);
if (adminRouters && adminRouters.length > 0) {
    adminRouter = ProcessRoutes(adminRouter, adminRouters);
} else {
    console.error('There is no admin route configured')
}

let storeRouter = express.Router(ProcessRoutes);
if (storeRouters && storeRouters.length > 0) {
    storeRouter = ProcessRoutes(storeRouter, storeRouters);
} else {
    console.error('There is no store route configured')
}
let productRouter = express.Router(ProcessRoutes);
if (productRouters && productRouters.length > 0) {
    productRouter = ProcessRoutes(productRouter, productRouters);
} else {
    console.error('There is no store route configured')
}
let superadminRouter = express.Router(ProcessRoutes);
if (superadminRouters && superadminRouters.length > 0) {
    superadminRouter = ProcessRoutes(superadminRouter, superadminRouters);
} else {
    console.error('There is no store route configured')
}

export {
    adminRouter,userRouter,productRouter,storeRouter,superadminRouter
}