import { NgModule } from "@angular/core";
import { ImagePipe } from './image.pipe';
import { PuntosPipe } from './puntos';


@NgModule({
    declarations:[ImagePipe , PuntosPipe ],
    exports:[ImagePipe, PuntosPipe ],
})

export class PipesModule{}