export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api",
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "#S^sk%Y1c@cFteZ7",
};
