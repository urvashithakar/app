// Get the API root URL
const path = window.location.pathname;
const parts = path.split("/");
const adminIndex = parts.indexOf("admin");
const apiRootPath = parts.slice(0, adminIndex).join("/") + "/";

// Get all the project keys
// TODO: fetch this from the /projects endpoint
// TODO: Check for needs-to-install flag
const projectKeys = ["_", "prod"];
const projects = projectKeys.map(key => ({
  key,
  status: null,
  data: null,
  error: null
}));

// Default state
export default {
  hydrated: false,
  hydratingError: null,
  latency: [],
  currentUser: {},
  bookmarks: [],
  sidebars: {
    nav: false,
    info: false
  },
  queue: [],
  currentProjectKey: projectKeys[0] || null,
  projects,
  apiRootPath
};
