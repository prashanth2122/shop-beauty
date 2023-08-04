import { Pipe, PipeTransform } from '@angular/core';
import { TranslateServiceSubService } from './translate-service-sub.service'
import { TranslateService } from '../translate.service';
@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatServicePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: any): any {
    const that =this;
    if(key.indexOf('.') !=-1){
      return that.deepFind(that.translate.data,key);
    }else{
      return this.translate.data[key] || key;
    }
  
  }
  deepFind(obj, path) {
    let paths = path.split('.');
      let current = obj
      let i;
  
    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }

}
