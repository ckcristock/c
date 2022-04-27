import { Injectable } from '@angular/core';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/es';
//import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Injectable({
    providedIn: 'root'
})
export class TexteditorService {

    constructor() { }
    public Editor = DecoupledEditor;
    public onReady(editor) {
        editor.ui.view.editable.element.parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.view.editable.element
        );
    }
    configEditor = {
        /* toolbar: {
          items: [
            '|',
            'heading',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'undo',
            'redo',
          ]
        }, */
        language: 'es',
      }

}
