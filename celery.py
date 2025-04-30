# celery.py (project root)
import os
from celery import Celery

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0"),
        broker=os.getenv("CELERY_BROKER_URL",    "redis://redis:6379/0"),
    )
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery

