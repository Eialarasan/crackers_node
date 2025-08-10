'use strict';

import express from 'express';
import cors from 'cors';
import {
  storeRouter,
  userRouter,
  adminRouter,
  productRouter,
  superadminRouter,
  categoryRouter,
  orderRouter,
  customerRouter
} from './app';

const app = express();

// Use ONLY Express' built-in parsers (no body-parser), with higher limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

// Routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/store', storeRouter);
app.use('/api/product', productRouter);
app.use('/api/superadmin', superadminRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/customer', customerRouter);

// Optional: friendlier 413 response
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  next(err);
});

export default app;
