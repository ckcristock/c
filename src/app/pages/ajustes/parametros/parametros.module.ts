import { NgModule } from "@angular/core";
import { ParametrosRoutingModule } from "./parametros-routing.module";
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RgpComponent } from './rgp/rgp.component';
import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';



@NgModule({
    declarations : [PerfilesComponent, RgpComponent, NotasTecnicasComponent] , 
    imports: [ ParametrosRoutingModule ],
    exports: []
})

export class ParametrosModule {}