import { SDK } from "@directus/sdk-js";

const client = new SDK({
  mode: "cookie"
});

export default client;
