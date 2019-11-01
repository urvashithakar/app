export function signalStrength(state) {
  // eslint-disable-line
  let lastLatency = state.latency[state.latency.length - 1];

  if (!lastLatency) {
    return 0;
  }

  lastLatency = lastLatency.latency;

  if (lastLatency > 0 && lastLatency < 200) {
    return 4;
  }

  if (lastLatency >= 200 && lastLatency < 500) {
    return 3;
  }

  if (lastLatency >= 500 && lastLatency < 1000) {
    return 2;
  }

  if (lastLatency >= 1000) {
    return 1;
  }

  return 0;
}

export function currentProject(state) {
  if (!state.projects) return null;
  return state.projects[state.currentProjectIndex];
}

export function currentProjectID(state, getters) {
  return getters.currentProject.project;
}
