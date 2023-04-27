import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-documentos-gestion',
  templateUrl: './documentos-gestion.component.html',
  styleUrls: ['./documentos-gestion.component.scss'],
})
export class DocumentosGestionComponent implements OnInit {
  modulo: string;
  param_folder: any;
  public ruta: string;
  view_folder: boolean = false;
  name_folder: string;
  folder_permission: any;
  constructor(
    private rutaActiva: ActivatedRoute,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this.param_folder = this.rutaActiva.snapshot.params.modulo;
    this.folder_permission = this._user.user.person.folder_id
    this.rutaActiva.paramMap.subscribe((params: ParamMap) => {
      this.modulo = params.get('modulo');
      if (this.folder_permission == this.modulo) {
        this.view_folder = true
        switch (this.modulo) {
          case '1':
            this.ruta =
              environment.url_assets + '/filemanager/filemanager/dialog.php?type=0&lang=es&car=rrhh';
            break;
          case '2':
            this.ruta =
              environment.url_assets + '/filemanager/filemanager/dialog.php?type=0&lang=es&car=contabilidad';
            break;
          case '3':
            this.ruta =
              environment.url_assets + '/filemanager/filemanager/dialog.php?type=0&car=juridico';
            break;
          case '4':
            this.ruta =
              environment.url_assets + '/filemanager/filemanager/dialog.php?type=0&car=calidad';
            break;
          case '5':
            this.ruta =
              environment.url_assets + '/filemanager/filemanager/dialog.php?type=0&car=';
            break;
        }
      }
    });
  }
}
