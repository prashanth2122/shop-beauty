import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
      if(args==='en'){
       return super.transform(value, "d-MMM-y") +' at '+super.transform(value,'h:mm:ss');
      }else if(args==='us' ||args==='de' ||args==='eu' ){
        return super.transform(value, "MMM d, y") +' at '+super.transform(value,'h:mm:ss a');  
      }
  }
}