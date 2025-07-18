#!/usr/bin/env python3
"""
Development script to auto-restart both FastAPI server and Celery worker when files change
"""
import subprocess
import time
import os
import signal
import sys
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class DevServerHandler(FileSystemEventHandler):
    def __init__(self):
        self.fastapi_process = None
        self.celery_process = None
        self.restart_all()
    
    def restart_all(self):
        print("\n🔄 Restarting all services...")
        
        # Kill existing processes
        self.kill_processes()
        
        # Start FastAPI server
        print("🚀 Starting FastAPI server...")
        self.fastapi_process = subprocess.Popen([
            "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"
        ])
        
        # Wait a moment for server to start
        time.sleep(2)
        
        # Start Celery worker
        print("🔧 Starting Celery worker...")
        self.celery_process = subprocess.Popen([
            "celery", "-A", "app.worker.celery_app", "worker", "--loglevel=info", "--pool=solo"
        ])
        
        print("✅ All services started!")
    
    def kill_processes(self):
        # Kill FastAPI server
        if self.fastapi_process:
            try:
                self.fastapi_process.terminate()
                self.fastapi_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.fastapi_process.kill()
                self.fastapi_process.wait()
            except:
                pass
        
        # Kill Celery worker
        if self.celery_process:
            try:
                self.celery_process.terminate()
                self.celery_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.celery_process.kill()
                self.celery_process.wait()
            except:
                pass
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        # Only restart for Python files in the app directory
        if event.src_path.endswith('.py') and '/app/' in event.src_path:
            print(f"\n📝 File changed: {event.src_path}")
            self.restart_all()

def main():
    print("🚀 Starting development environment...")
    print("📁 Monitoring app/ directory for changes...")
    print("🌐 FastAPI server will run on http://localhost:8000")
    print("🔧 Celery worker will be available for background tasks")
    print("⏹️  Press Ctrl+C to stop all services")
    
    handler = DevServerHandler()
    observer = Observer()
    observer.schedule(handler, path='app', recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down all services...")
        observer.stop()
        handler.kill_processes()
    
    observer.join()

if __name__ == "__main__":
    main() 