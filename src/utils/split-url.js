/**
 * Splits up the project name and URL from a Directus API URL
 */
import clone from "lodash/clone";

export default function splitURL(fullUrl) {
  let url = clone(fullUrl);
  if (url.endsWith("/") === false) url += "/";
  const urlParts = url.split("/").filter(s => s);
  const project = urlParts[urlParts.length - 1];
  url = url.slice(0, -1);
  url = url.substring(0, url.lastIndexOf("/"));

  return { url, project };
}
