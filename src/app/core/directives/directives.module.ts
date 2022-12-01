import { NgModule } from "@angular/core";
import { DynamicColspanDirective } from './dynamic-colspan.directive';
import { InputNumberFormatDirective } from './input-number-format.directive';


@NgModule({
    declarations: [DynamicColspanDirective, InputNumberFormatDirective],
    exports:[DynamicColspanDirective, InputNumberFormatDirective],
    imports: [],
})

export class DirectivesModule { }
