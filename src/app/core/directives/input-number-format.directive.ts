import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputNumberFormat]'
})
export class InputNumberFormatDirective {

  constructor(private elementRef: ElementRef) { }
  ngOnInit(): void {
    this.elementRef.nativeElement.value = this.transform(this.elementRef.nativeElement.value);
  }
  transform(value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  @HostListener("keyup", ["$event.target.value"])
  change() {
    this.elementRef.nativeElement.value = this.transform(this.elementRef.nativeElement.value);
  }
}
