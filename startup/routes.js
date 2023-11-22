const user = require("../routers/user");
const invoice = require("../routers/invoice");

module.exports = function (fastify) {
  fastify.register(user);
  fastify.register(invoice);
};
