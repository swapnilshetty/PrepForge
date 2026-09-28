import api from "./api";

export function getProblems(filters = {}) {
  const params = {};
  if (filters.difficulty && filters.difficulty !== "all") {
    params.difficulty = filters.difficulty;
  }
  if (filters.topic && filters.topic !== "all") {
    params.topic = filters.topic;
  }

  return api.get("/api/coding/problems/", { params }).then((res) => res.data);
}

export function getProblem(slug) {
  return api.get(`/api/coding/problems/${slug}/`).then((res) => res.data);
}

export function getSubmissions() {
  return api.get("/api/coding/submissions/").then((res) => res.data);
}

export function getCodingProgress() {
  return api.get("/api/coding/progress/").then((res) => res.data);
}

export function createSubmission(submissionData) {
  return api
    .post("/api/coding/submissions/create/", submissionData)
    .then((res) => res.data);
}

export function runCode(data) {
  return api
    .post("/api/coding/run/", data)
    .then((res) => res.data);
}