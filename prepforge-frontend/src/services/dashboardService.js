import api from "./api";

export function getDashboard() {
  return api.get("/api/dashboard/").then((res) => res.data);
}

export function getProgress() {
  return api.get("/api/dashboard/progress/").then((res) => res.data);
}