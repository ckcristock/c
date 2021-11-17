import { NgModule } from "@angular/core";
import { DynamicColspanDirective } from './dynamic-colspan.directive';


@NgModule({
    declarations: [DynamicColspanDirective],
    exports:[DynamicColspanDirective],
    imports: [],
})

export class DirectivesModule { }