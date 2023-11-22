const axios = require("axios");

// Endpoint to get invoice status based on invoiceId
async function handleInvoiceStatus(request, reply) {
  try {
    // Get request body data
    const { invoiceId } = request.body;

    // Make a request to the external API to get the invoice status
    const response = await axios.get(
      `https://api.forgingblock.io/invoice/status?invoiceId=${invoiceId}&paymentMethodId=BTC&_=1575903768088`,
      {
        timeout: 10000,
      }
    );

    // Error message
    if (!response || !response.data) {
      return {
        error: "Given invoice ID doesn't correspond to the correct invoice ID",
      };
    }

    // Destructure necessary data
    const { btcAddress, status, orderAmount, orderAmountFiat } = response.data;

    // Return data to the response
    return { btcAddress, status, orderAmount, orderAmountFiat };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      reply.code(500).send({
        error: "Given invoice ID doesn't correspond to the correct invoice ID",
      });
    } else {
      reply.code(500).send({ error: "Failed to fetch invoice status" });
    }
  }
}

// Endpoint to get Etherium rate status based on invoiceId
async function handleInvoiceRate(request, reply) {
  try {
    // Get request body data
    const { invoiceId } = request.body;

    // Fetch original invoice details
    const originalInvoiceResponse = await axios.get(
      `https://api.forgingblock.io/invoice/status?invoiceId=${invoiceId}&paymentMethodId=BTC&_=1575903768088`,
      {
        timeout: 10000,
      }
    );
    const originalInvoiceData = originalInvoiceResponse.data;

    // Fetch rate for Ethereum
    const coinGeckoResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const coinGeckoData = coinGeckoResponse.data;
    const ethRate = coinGeckoData.ethereum.usd;

    // Calculate order amount in Ethereum
    const orderAmountInEth = originalInvoiceData.orderAmountFiatClear / ethRate;

    // Return JSON response with Ethereum rate and amount
    return { ethRate, orderAmountInEth };
  } catch (error) {
    reply.code(500).send({ error: "Internal Server Error" });
  }
}

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: "POST",
    url: "/status/invoice",
    handler: handleInvoiceStatus,
  });

  fastify.route({
    method: "POST",
    url: "/status/eth/invoice",
    handler: handleInvoiceRate,
  });

  done();
};
