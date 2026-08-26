import { Injectable, signal } from '@angular/core';
import { TailwindToastItem } from '../../components/toast/interfaces/toast-item.interface';
import { TailwindToastConfig } from '../../components/toast/interfaces/toast-config.interface';
import type { TailwindHeroicon } from '../../models';
import type { ToastTimer } from './interfaces/toast-timer.interface';

@Injectable({ providedIn: 'root' })
export class TailwindToastService {
  private readonly next = signal(0);
  readonly toasts = signal<TailwindToastItem[]>([]);

  private readonly timers = new Map<number, ToastTimer>();

  show(config: TailwindToastConfig): number {
    this.next.update(prev => prev + 1);
    const toast: TailwindToastItem = { id: this.next(), color: 'info', duration: 4000, dismissible: true, ...config };
    this.toasts.update(list => [...list, toast]);

    if (toast.duration && toast.duration > 0) {
      this.startTimer(toast.id, toast.duration);
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
    this.clearTimer(id);
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.timers.forEach((_, id) => this.clearTimer(id));
    this.toasts.set([]);
  }

  /**
   * Freezes every auto-dismiss countdown — called while the stack is hovered or focused so a
   * toast cannot disappear while it is being read (WCAG 2.2.1 Timing Adjustable).
   */
  pauseAll(): void {
    const now = Date.now();
    this.timers.forEach(timer => {
      if (timer.handle === null) return;
      clearTimeout(timer.handle);
      timer.handle = null;
      timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt));
    });
  }

  /** Resumes the countdowns frozen by {@link pauseAll}, each with the time it had left. */
  resumeAll(): void {
    this.timers.forEach((timer, id) => {
      if (timer.handle !== null) return;
      this.startTimer(id, timer.remaining);
    });
  }

  private startTimer(id: number, duration: number): void {
    const timer: ToastTimer = {
      handle: setTimeout(() => this.dismiss(id), duration),
      remaining: duration,
      startedAt: Date.now()
    };
    this.timers.set(id, timer);
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer?.handle !== null && timer?.handle !== undefined) {
      clearTimeout(timer.handle);
    }
    this.timers.delete(id);
  }
}
