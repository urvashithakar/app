import { SDK } from "@directus/sdk-js";
import store from "@/store";

const client = new SDK({
  mode: "cookie",
  url: store.state.apiRootPath,
  project: store.state.currentProjectKey
});

export default client;
