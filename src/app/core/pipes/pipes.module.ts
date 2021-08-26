import { NgModule } from "@angular/core";
import { ImagePipe } from './image.pipe';
import { ObjToArrayPipe } from "./obj-to-array.pipe";
import { PuntosPipe } from './puntos';


@NgModule({
    declarations:[ImagePipe , ObjToArrayPipe, PuntosPipe ],
    exports:[ImagePipe, ObjToArrayPipe, PuntosPipe ],
})

export class PipesModule{}