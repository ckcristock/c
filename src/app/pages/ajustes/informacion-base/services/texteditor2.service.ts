import { Injectable } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/es';

@Injectable({
  providedIn: 'root'
})
export class Texteditor2Service {

  constructor() { }
  public Editor = DecoupledEditor;
  public onReady(editor) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element
    );
  }
  configEditor = {
    placeholder: 'Escribe un comentario',
    language: 'es',
  }

}
