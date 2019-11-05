import store from "./store/";

let fastInterval = null;

export function startPolling() {
  fastInterval = setInterval(() => {
    store.dispatch("latency");
  }, 10000);
}

export function stopPolling() {
  clearInterval(fastInterval);
}
