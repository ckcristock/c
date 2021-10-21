import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { DetalleService } from './detalle.service';
import { DatosBasicosService } from './ver-funcionario/datos-basicos/datos-basicos.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-detalle-funcionario',
  templateUrl: './detalle-funcionario.component.html',
  styleUrls: ['./detalle-funcionario.component.scss']
})
export class DetalleFuncionarioComponent implements OnInit {
  habilitado = true;
  components = 'informacion';
  id: any;
  data$:any;
  funcionario: any = {
    salary: '',
    work_contract: '',
    first_name: '',
    first_surname: '',
    image: '',
    second_name: '',
    second_surname: '',
    signature: '',
    title: ''
  };
  constructor( 
              private detalleService: DetalleService, 
              private activateRoute: ActivatedRoute,
              private basicDataService: DatosBasicosService,
              private location: Location,
              private _swal: SwalService,
              private router: Router
              ) { }



  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getBasicData();
    this.data$ = this.basicDataService.datos$.subscribe( data => {
      this.getBasicData();
    });

  }

  regresar() :void {
    this.location.back();
  }

  verComponent( componente:string ){
    this.components = componente;
  }

  liquidar(status){
    let data = {
      status
    }
    this.detalleService.liquidar(data, this.id).subscribe((r:any) => {
      this._swal.show({
        icon: 'question',
        title: '¿Estas Seguro?',
        text: 'Se dispone a liquidar el empleado'
      }).then((result) => {
        if (result.isConfirmed) {
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactorio',
            text: 'El Funcionario ha sido liquidado con éxito.',
            showCancel: false
          });
          setTimeout(() => {
            this.router.navigate(['/rrhh/liquidados']);
          }, 1000);
        }
      });
    });
  }

  getBasicData(){
    this.detalleService.getBasicData(this.id)
    .subscribe( (res:any) => {
        this.funcionario = res.data;
    });
  }

  ngOnDestroy(): void {
    this.data$.unsubscribe();
  }
  
}
