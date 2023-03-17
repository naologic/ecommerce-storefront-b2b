import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'uppercaseFirst'
})
export class UppercaseFirstPipe implements PipeTransform {
  public transform(value: string): string {
    if (value?.length) {
      return value.length > 1 ? value.charAt(0).toUpperCase() + value.slice(1): value.charAt(0).toUpperCase();
    }
    return value;
  }
}
