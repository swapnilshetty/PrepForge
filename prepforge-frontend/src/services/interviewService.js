import api from "./api";

export function getQuestions(filters = {}) {
  const params = {};

  if (filters.type && filters.type !== "all") {
    const typeMap = {
      technical: "Technical",
      behavioral: "Behavioral",
      system_design: "System Design",
    };

    params.type = typeMap[filters.type] || filters.type;
  }

  if (filters.difficulty && filters.difficulty !== "all") {
    params.difficulty = filters.difficulty;
  }

  if (filters.topic && filters.topic !== "all") {
    params.topic = filters.topic;
  }

  return api
    .get("/api/interviews/questions/", { params })
    .then((res) => res.data);
}


export function getQuestion(id) {
  return api
    .get(`/api/interviews/questions/${id}/`)
    .then((res) => res.data);
}


// ---------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------


export function getBookmarks() {
  return api
    .get("/api/interviews/bookmarks/")
    .then((res) => res.data);
}


export function createBookmark(data) {
  return api
    .post("/api/interviews/bookmarks/", data)
    .then((res) => res.data);
}


export function deleteBookmark(id) {
  return api
    .delete(`/api/interviews/bookmarks/${id}/`)
    .then((res) => res.data);
}


// ---------------------------------------------------------
// User Answers
// ---------------------------------------------------------


export function getAnswers() {
  return api
    .get("/api/interviews/answers/")
    .then((res) => res.data);
}


export function createAnswer(data) {
  return api
    .post("/api/interviews/answers/", data)
    .then((res) => res.data);
}


// ---------------------------------------------------------
// Interview Progress
// ---------------------------------------------------------


export function getInterviewProgress() {
  return api
    .get("/api/interviews/progress/")
    .then((res) => res.data);
}


export function updateInterviewProgress(
  questionId,
  prepared
) {
  return api
    .post("/api/interviews/progress/", {
      question: questionId,
      prepared: prepared,
    })
    .then((res) => res.data);
}