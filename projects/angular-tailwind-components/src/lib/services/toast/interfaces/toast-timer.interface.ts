/** Bookkeeping for one auto-dismiss countdown, so it can be paused and resumed. */
export interface ToastTimer {
  handle: ReturnType<typeof setTimeout> | null;
  /** Milliseconds still to run when the timer is paused. */
  remaining: number;
  /** Timestamp of the last (re)start, used to compute what is left on pause. */
  startedAt: number;
}
