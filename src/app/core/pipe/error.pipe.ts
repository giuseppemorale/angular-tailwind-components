import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  pure: false,
  name: 'error'
})
export class ErrorPipe implements PipeTransform {
  transform(control: FormControl, _args?: Record<string, unknown>): boolean {
    if (!control.touched || control.valid) {
      return false;
    }
    return true;
  }
}
