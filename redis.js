const { Redis } = require("ioredis");

const client = new Redis("rediss://default:AXbRAAIjcDEyODQzN2FhMDM5YjU0NTI1YTIxMGM5NWRkMWVkNGYxMnAxMA@amused-kit-30417.upstash.io:6379");

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});


module.exports = { client };
