const fastify = require("fastify")({ logger: true });

// Get api routes
require("./startup/routes")(fastify);

// Run the server on port 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
