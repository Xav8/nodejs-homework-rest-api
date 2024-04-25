const app = require("./app");
const Port = "8080";
app.listen(Port, () => {
  console.log(`Server is running. Use our API on port: ${Port}`);
});