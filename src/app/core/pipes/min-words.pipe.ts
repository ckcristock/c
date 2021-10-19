import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

const base_url = environment.base_url;

@Pipe({
  name: 'minWords'
})
export class MinWordsPipe implements PipeTransform {

  transform(word: string): string {  
      return  word.substring(0,30).concat(' ...');
  }



}
