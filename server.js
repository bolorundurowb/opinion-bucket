/**
 * Created by bolorundurowb on 11/11/16.
 */

import express from 'express';
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  dotenv.config({silent: true});
}

