import { Injectable, signal } from '@angular/core';
import { AtcSeverity } from '../../models';

export interface AtcToastConfig {
  message: string;
  title?: string;
  severity?: AtcSeverity;
  duration?: number;
  dismissible?: boolean;
}

export interface AtcToastItem extends AtcToastConfig {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AtcToastService {
  private nextId = 0;
  toasts = signal<AtcToastItem[]>([]);

  show(config: AtcToastConfig): number {
    const id = this.nextId++;
    const toast: AtcToastItem = { id, severity: 'info', duration: 4000, dismissible: true, ...config };
    this.toasts.update(list => [...list, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
    return id;
  }

  success(message: string, title?: string): number { return this.show({ message, title, severity: 'success' }); }
  warning(message: string, title?: string): number { return this.show({ message, title, severity: 'warning' }); }
  danger(message: string, title?: string): number { return this.show({ message, title, severity: 'danger' }); }
  info(message: string, title?: string): number { return this.show({ message, title, severity: 'info' }); }

  dismiss(id: number): void { this.toasts.update(list => list.filter(t => t.id !== id)); }
  clear(): void { this.toasts.set([]); }
}
