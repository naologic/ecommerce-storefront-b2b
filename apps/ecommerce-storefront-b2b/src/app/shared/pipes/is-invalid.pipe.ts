import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
    name: 'isInvalid',
    pure: false,
})
export class IsInvalidPipe implements PipeTransform {
    public transform(control: AbstractControl): boolean {
        return control.invalid && (control.dirty || control.touched);
    }
}
