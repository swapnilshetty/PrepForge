import api from "./api";

export function getCategories() {
  return api.get("/api/learning/categories/").then((res) => res.data);
}

export function getCategory(categorySlug) {
  return api.get(`/api/learning/categories/${categorySlug}/`).then((res) => res.data);
}

export function getTopics() {
  return api.get("/api/learning/topics/").then((res) => res.data);
}

export function getTopic(topicSlug) {
  return api.get(`/api/learning/topics/${topicSlug}/`).then((res) => res.data);
}

export function getContent() {
  return api.get("/api/learning/content/").then((res) => res.data);
}

export function getContentById(id) {
  return api.get(`/api/learning/content/${id}/`).then((res) => res.data);
}

export function getLessonProgress() {
  return api
    .get("/api/learning/progress/")
    .then((res) => res.data);
}

export function completeLesson(contentId) {
  return api
    .post("/api/learning/progress/", {
      content: contentId,
      completed: true,
    })
    .then((res) => res.data);
}