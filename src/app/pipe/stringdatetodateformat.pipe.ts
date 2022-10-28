import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'ddMMyyyy',
})
export class StringDateToDateFormat extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
    if(value && !isNaN(value) && value !== 'null') {
      return '';
    } else {
      return super.transform(value, 'dd/MM/yyyy');
    }
  }
}