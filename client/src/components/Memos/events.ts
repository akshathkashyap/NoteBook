class EventEmitter {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {
      memosUpdate: [],
      memoHighlight: [],
      sessionStorageUpdated: [],
    };
  }

  on(event: string, listener: Function) {
    if (!this.events[event]) throw new Error('invalid memo event');

    this.events[event].push(listener);
    return () => {
      this.off(event, listener);
    };
  }

  off(event: string, listener: Function) {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter(l => l !== listener);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) throw new Error('invalid memo event');

    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

const events = new EventEmitter();

export default events;
