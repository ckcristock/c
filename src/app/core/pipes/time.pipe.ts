import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

const base_url = environment.base_url;

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: string): string {  
      return  moment(time,"h:mm").format("h:mm A")
  }



}
