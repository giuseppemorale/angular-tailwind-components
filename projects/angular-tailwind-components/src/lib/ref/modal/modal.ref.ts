export class TailwindModalRef<R = any> {
  private _closeFn!: () => void;
  private _result: R | undefined;

  /** @internal called by the service after component creation */
  _init(closeFn: () => void): void {
    this._closeFn = closeFn;
  }

  /** Close the modal resolving with the given result */
  close(result?: R): void {
    this._result = result;
    this._closeFn();
  }

  /** @internal read by the service after the close animation */
  _getResult(): R | undefined {
    return this._result;
  }
}
