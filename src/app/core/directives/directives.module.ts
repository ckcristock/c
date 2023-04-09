import { NgModule } from "@angular/core";
import { DynamicColspanDirective } from './dynamic-colspan.directive';
import { InputNumberFormatDirective } from './input-number-format.directive';
import { InputPositionDirective } from './input-position.directive';
import { InputPositionInitialDirective } from './input-position-initial.directive';
import { InputPositionUsdDirective } from './input-position-usd.directive';


@NgModule({
  declarations: [
    DynamicColspanDirective,
    InputNumberFormatDirective,
    InputPositionDirective,
    InputPositionInitialDirective,
    InputPositionUsdDirective
  ],
  exports: [
    DynamicColspanDirective,
    InputNumberFormatDirective,
    InputPositionDirective,
    InputPositionInitialDirective,
    InputPositionUsdDirective
  ],
  imports: [],
})

export class DirectivesModule { }
