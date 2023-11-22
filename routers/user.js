const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Define the base URL for the external API
const externalApiBaseUrl = "https://reqres.in/api/users";

// Object to store the base64 representations of the images
const imageCache = {};

// Define the route for fetching a user by ID
async function handleUserInformation(request, reply) {
  try {
    // Get request param and prepare url
    const userId = request.params.userId;
    const userUrl = `${externalApiBaseUrl}/${userId}`;

    // Make a request to the external API
    const response = await axios.get(userUrl);

    // Extract the user data from the response
    const userData = response.data.data;

    // Return user data to response
    return userData;
  } catch (error) {
    // Handle errors
    reply
      .code(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
}

// Endpoint to get the user's avatar image and return base64 representation
async function handleUserAvatarImage(request, reply) {
  try {
    // Get request param and prepare url
    const userId = request.params.userId;
    const userUrl = `${externalApiBaseUrl}/${userId}`;

    if (imageCache[userUrl]) {
      // If the base64 representation of the image is already cached, return it
      return { base64Image: imageCache[userUrl] };
    }

    // Make a request to get the user data
    const user = await axios.get(userUrl);
    const avatarUrl = user.data.data.avatar;
    const firstName = user.data.data.first_name;

    // Make a request to get the image by avatar data
    const response = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });

    // Convert the binary image to base64 image
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    // Save the image into the FileSystem
    fs.writeFileSync(
      path.join(__dirname, `../avatars/${firstName}_Avatar_${userId}.jpg`),
      response.data
    );

    // Store the base64 representation of the image in the cache
    imageCache[userUrl] = base64Image;

    // Return base64 image
    return { base64Image };
  } catch (error) {
    reply.code(500).send({ error: "Failed to fetch user avatar" });
  }
}

// Endpoint to remove the saved file from the FileSystem storage
async function handleUserAvatarDelete(request, reply) {
  try {
    // Get request param and prepare url
    const userId = request.params.userId;
    const userUrl = `${externalApiBaseUrl}/${userId}`;

    // Make a request to get the user data
    const user = await axios.get(userUrl);
    const firstName = user.data.data.first_name;

    // Evaluate the user avatar image path
    const imagePath = path.join(
      __dirname,
      `../avatars/${firstName}_Avatar_${userId}.jpg`
    );

    // Check if the file exists and delete it
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove the image from the cache
    delete imageCache[userUrl];

    // Return success message to response
    return { message: "User avatar image deleted" };
  } catch (error) {
    reply.code(500).send({ error: "Failed to delete user avatar image" });
  }
}

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: "GET",
    url: "/api/user/:userId",
    handler: handleUserInformation,
  });

  fastify.route({
    method: "GET",
    url: "/api/user/:userId/avatar",
    handler: handleUserAvatarImage,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/user/:userId/avatar",
    handler: handleUserAvatarDelete,
  });

  done();
};
