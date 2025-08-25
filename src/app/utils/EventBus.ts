class EventBus {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

export const eventBus = new EventBus();

// Notification helper
export const notify = {
  success: (title: string, message: string) => {
    eventBus.emit('notification', { type: 'success', title, message });
  },
  error: (title: string, message: string) => {
    eventBus.emit('notification', { type: 'error', title, message });
  }
};