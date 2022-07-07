import config from 'config';
import { app } from './app';
import mongoose from 'mongoose';
const { port } = config.get('api');
const mongoConfig: any = config.get('mongodb');
const start = async () => {
  try {
    await mongoose.connect(
      `mongodb://${mongoConfig.hostname}:${mongoConfig.port}/logs`
    );
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    console.log(`Usage: Open http://localhost:${port} in your browser.`);
  });
};

start();
