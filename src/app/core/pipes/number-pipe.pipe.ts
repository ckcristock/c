import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipePipe implements PipeTransform {

  transform(val, pre) {
    if (val) {
      val = this.format_number(val, pre);
    }
    return val;
  }

  format_number(number, prefix) {
    let thousand_separator = ',',
      decimal_separator = '.',
      regex = new RegExp('[^' + decimal_separator + '\\d]', 'g'),
      number_string = number.replace(regex, '').toString(),
      split = number_string.split(decimal_separator),
      rest = split[0].length % 3,
      result = split[0].substr(0, rest),
      thousands = split[0].substr(rest).match(/\d{3}/g);

    if (thousands) {
      let separator = rest ? thousand_separator : '';
      result += separator + thousands.join(thousand_separator);
    }
    result = split[1] != undefined ? result + decimal_separator + split[1] : result;

    let part1 = result.split('.')[0]
    let part2length = result.split('.')[1]?.length ? result.split('.')[1]?.length : 0
    let part2 = result.split('.')[1]?.slice(0, -part2length + 2) ? result.split('.')[1]?.slice(0, -part2length + 2) : 0
    result = part2 ? part1 + '.' + part2 : part1
    return prefix == undefined ? result : (result ? prefix + result : '');
  };

}
