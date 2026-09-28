CONTENT_MODELS = {
    "learning": {
        "category",
        "topic",
        "learningcontent",
    },
    "coding": {
        "codingproblem",
        "testcase",
    },
    "interviews": {
        "interviewquestion",
    },
}


class ContentDatabaseRouter:

    def db_for_read(self, model, **hints):
        app_label = model._meta.app_label
        model_name = model._meta.model_name

        if model_name in CONTENT_MODELS.get(app_label, set()):
            return "content"

        return "default"

    def db_for_write(self, model, **hints):
        app_label = model._meta.app_label
        model_name = model._meta.model_name

        if model_name in CONTENT_MODELS.get(app_label, set()):
            return "content"

        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        db1 = obj1._state.db
        db2 = obj2._state.db

        if db1 and db2:
            return db1 == db2

        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        is_content_model = (
            model_name in CONTENT_MODELS.get(app_label, set())
        )

        if db == "content":
            return is_content_model

        if db == "default":
            return not is_content_model

        return None