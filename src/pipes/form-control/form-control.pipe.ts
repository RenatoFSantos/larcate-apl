import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'formControlPipe',
})
export class FormControlPipe implements PipeTransform {
  transform(value: AbstractControl): FormControl<(typeof value)['value']> {
    return value as FormControl<(typeof value)['value']>;
  }
}
