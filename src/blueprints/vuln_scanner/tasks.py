from celery import current_app as celery
from time import sleep

@celery.task
def run_scan(report_id):
    """Simulate a vulnerability scan for a given report."""
    # placeholder for real logic
    sleep(5)
    return {"report_id": report_id, "status": "completed"}

