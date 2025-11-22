#!/bin/bash
cd "$(dirname "$0")/backend"
source venv/bin/activate
celery -A app.services.celery_app worker --loglevel=info
