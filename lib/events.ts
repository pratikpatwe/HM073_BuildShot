type Callback = () => void;

class EventEmitter {
    private events: { [key: string]: Callback[] } = {};

    subscribe(event: string, callback: Callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    emit(event: string) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback());
        }
    }
}

export const dataEventEmitter = new EventEmitter();
export const DATA_UPDATED_EVENT = 'data_updated';
