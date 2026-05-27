import { Injectable, signal } from '@angular/core';
import { TailwindToastItem } from '../../components/toast/interfaces/toast-item.interface';
import { TailwindToastConfig } from '../../components/toast/interfaces/toast-config.interface';
import type { TailwindHeroicon } from '../../models';

@Injectable({ providedIn: 'root' })
export class TailwindToastService {
  private readonly next = signal(0);
  readonly toasts = signal<TailwindToastItem[]>([]);

  show(config: TailwindToastConfig): number {
    this.next.update(prev => prev + 1);
    const toast: TailwindToastItem = { id: this.next(), color: 'info', duration: 4000, dismissible: true, ...config };
    this.toasts.update(list => [...list, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }
    return toast.id;
  }

  success(title: string, message: string, icon?: TailwindHeroicon): number {
    return this.show({ title, message, icon, color: 'success' });
  }

  warning(title: string, message: string, icon?: TailwindHeroicon): number {
    return this.show({ title, message, icon, color: 'warning' });
  }

  danger(title: string, message: string, icon?: TailwindHeroicon): number {
    return this.show({ title, message, icon, color: 'danger' });
  }

  info(title: string, message: string, icon?: TailwindHeroicon): number {
    return this.show({ title, message, icon, color: 'info' });
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
