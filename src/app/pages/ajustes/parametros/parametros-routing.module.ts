import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RgpComponent } from './rgp/rgp.component';
import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';


const routes : Routes = [
    { path: 'perfiles', component : PerfilesComponent },
    { path: 'rgp', component : RgpComponent },
    { path: 'notas-tecnicas', component : NotasTecnicasComponent },
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ParametrosRoutingModule {}