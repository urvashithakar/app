import splitURL from "@/utils/split-url";

const config = window.__DirectusConfig__;

const api = Array.isArray(config.api) ? config.api : Object.keys(config.api);

const projects = api.map(fullUrl => {
  const { url, project } = splitURL(fullUrl);
  console.log(url, project);
  return {
    project_name: null,
    project_logo: null,
    project_color: null,
    project_image: null,
    project_icon: null,
    url,
    project,
    authenticated: null,
    requires2FA: null
  };
});

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
  projects: projects,
  currentProjectIndex: 0
};
