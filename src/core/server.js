import express from 'express';
import colors from 'colors';

export default async (service, basePath) => {

  const app = express();
  app.use(express.json());
  app.use(`${basePath}/${service.name}`, service.routes);

  app.start = () => new Promise(resolve => {
    const server = app.listen(service.port, () => {
      console.log(`[Basic-Auth-${service.name}] running on port ${service.port}`.green);
      resolve(server);
    });
  });

  return app;
};
