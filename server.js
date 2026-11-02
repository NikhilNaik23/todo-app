const app = require("./app.js");

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`todo-app listening on ${port}`),
);

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down");
  server.close(() => process.exit(0));
});
