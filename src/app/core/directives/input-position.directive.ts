import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputPosition]'
})
export class InputPositionDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {
  }
  // $ 00.000,00
  @HostListener('click')
  onClick() {
    const value = this.el.nativeElement.value;
    const decimalIndex = value.indexOf(',');
    if (decimalIndex > -1) {
      if (value === null || value === undefined || value === '0') {
        this.el.nativeElement.setSelectionRange(decimalIndex, decimalIndex);
      } else {
        this.el.nativeElement.setSelectionRange(2, decimalIndex);
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '.') { // Verifica si se presionó el punto
      event.preventDefault(); // Previene la inserción del punto
      const input = this.el.nativeElement as HTMLInputElement;
      const currentValue = input.value;
      const selectionStart = input.selectionStart;
      const newValue = currentValue.slice(0, selectionStart) + ',' + currentValue.slice(selectionStart + 1);
      input.value = newValue;
      input.setSelectionRange(selectionStart + 1, selectionStart + 1); // Mueve el cursor después de la coma
    }
  }

}
