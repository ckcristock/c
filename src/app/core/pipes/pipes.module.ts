import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { ObjToArrayPipe } from './obj-to-array.pipe';
import { PuntosPipe } from './puntos';
import { TimePipe } from './time.pipe';

@NgModule({
  declarations: [ImagePipe, ObjToArrayPipe, PuntosPipe, TimePipe],
  exports: [ImagePipe, ObjToArrayPipe, PuntosPipe, TimePipe],
})
export class PipesModule {}
