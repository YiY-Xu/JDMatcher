# filepath: /Users/yiy/Work/jdmatcher/backend/gunicorn_conf.py
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = "0.0.0.0:8000"