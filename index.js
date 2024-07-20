const app = require("./src/app");
require("dotenv").config();
const router = require("./src/server/router");

const bodyParser = require("body-parser");
const swagger = require("./swagger");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
swagger(app);

app.use("/", router);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
