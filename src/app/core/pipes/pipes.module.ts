import { NgModule } from "@angular/core";
import { ImagePipe } from './image.pipe';
import { ObjToArrayPipe } from "./obj-to-array.pipe";
import { PuntosPipe } from './puntos';


@NgModule({
    declarations:[ImagePipe , PuntosPipe, ObjToArrayPipe ],
    exports:[ImagePipe, PuntosPipe, ObjToArrayPipe ],
})

export class PipesModule{}