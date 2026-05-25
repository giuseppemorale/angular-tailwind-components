import { Injectable, signal } from '@angular/core';
import { TailwindToastItem } from '../../components/toast/interfaces/toast-item.interface';
import { TailwindToastConfig } from '../../components/toast/interfaces/toast-config.interface';

@Injectable({ providedIn: 'root' })
export class TailwindToastService {
  private nextId = 0;
  readonly toasts = signal<TailwindToastItem[]>([]);

  show(config: TailwindToastConfig): number {
    const id = this.nextId++;
    const toast: TailwindToastItem = { id, color: 'info', duration: 4000, dismissible: true, ...config };
    this.toasts.update(list => [...list, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
    return id;
  }

  success(message: string, title?: string): number {
    return this.show({ message, title, color: 'success' });
  }
  warning(message: string, title?: string): number {
    return this.show({ message, title, color: 'warning' });
  }
  danger(message: string, title?: string): number {
    return this.show({ message, title, color: 'danger' });
  }
  info(message: string, title?: string): number {
    return this.show({ message, title, color: 'info' });
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
  clear(): void {
    this.toasts.set([]);
  }
}
