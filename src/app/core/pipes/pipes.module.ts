import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { MinWordsPipe } from './min-words.pipe';
import { ObjToArraykeysPipe } from './obj-to-array-keys.pipe';
import { ObjToArrayPipe } from './obj-to-array.pipe';
import { PuntosPipe } from './puntos';
import { SafePipe } from './safe.pipe';
import { TimePipe } from './time.pipe';
import { NumberPipePipe } from './number-pipe.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { CapitalLetterPipe } from './capital-letter.pipe';

@NgModule({
  declarations: [
    ImagePipe,
    ObjToArrayPipe,
    PuntosPipe,
    TimePipe,
    MinWordsPipe,
    ObjToArraykeysPipe,
    SafePipe,
    NumberPipePipe,
    SanitizeHtmlPipe,
    CapitalLetterPipe
  ],
  exports: [
    ImagePipe,
    ObjToArrayPipe,
    PuntosPipe,
    TimePipe,
    MinWordsPipe,
    ObjToArraykeysPipe,
    SafePipe,
    NumberPipePipe,
    SanitizeHtmlPipe,
    CapitalLetterPipe
  ],
})
export class PipesModule { }
