import { Directive, ElementRef, Input, Renderer2, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[DynamicColspan]'
})
export class DynamicColspanDirective {
  valor = 1;
  @Input() DynamicColspan: any

  @HostListener("click") onclik(){
    
    switch (this.DynamicColspan ) {
      case 'indirect_cost':
        this.valor = this.valor == 1 ? 4 : 1; 
        break;
    
      default:
        break;
    }
    console.log(this.valor,'valor');
    this.renderer.setAttribute(this.el.nativeElement,'colspan', this.valor.toString())
  }
  constructor(public el: ElementRef, public renderer: Renderer2) {
  }

  ngOnInit() {
    
   

    console.log(this.DynamicColspan,'oninit');/* 
    this.renderer.setAttribute(this.el.nativeElement,'colspan','4') */
  }

}
