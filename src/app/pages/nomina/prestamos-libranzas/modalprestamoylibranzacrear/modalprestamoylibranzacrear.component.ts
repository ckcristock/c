import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
/* import { GeneralService } from '../../../shared/services/general/general.service'; */
import { debounceTime, map } from 'rxjs/operators';
/* import { Globales } from '../../../shared/globales/globales'; */
import { HttpClient } from '@angular/common/http';
import { PrestamoModel } from './PrestamoModel';
import swal, { SweetAlertOptions } from 'sweetalert2';
/* import { SwalService } from '../../../shared/services/swal/swal.service'; */
import { PersonService } from '../../../ajustes/informacion-base/persons/person.service';
import { LoanService } from '../loan.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-modalprestamoylibranzacrear',
  templateUrl: './modalprestamoylibranzacrear.component.html',
  styleUrls: ['./modalprestamoylibranzacrear.component.scss'],
})
export class ModalprestamoylibranzacrearComponent implements OnInit, OnDestroy {
  @ViewChild('modalPrestamoylibranza') modalPrestamoylibranza: any;
  @Input() abrirModal: Observable<any> = new Observable();
  @Output() recargarLista: EventEmitter<any> = new EventEmitter();
  private _suscription: any;
  public Meses: any = [];
  public Empleados: any = [];
  public modelo: PrestamoModel = new PrestamoModel();
  public cuotaDisabled: boolean = true;
  public inter: boolean = true;
  public alertOption: SweetAlertOptions = {};
  public Quincenas: any = [];
  public Procesos: any = [];
  public Bancos: any = [];
  public Comprobar: any = [];
  public PlanesCuenta: any = [];

  constructor(
    private _person: PersonService, 
    private _loan: LoanService,
    private _swal: SwalService
    ) {}

  ngOnInit() {
    this._suscription = this.abrirModal.subscribe((data: any) => {
      this.modalPrestamoylibranza.show();
    });
    /* this.http
      .get(this.globales.ruta + "php/comprobantes/lista_cuentas.php").subscribe((data: any) => {
        this.PlanesCuenta = data.Activo;
      }); */
    this.getEmpleados();
    this.getProximasQuincenas();
  }

  changePerson(){

  }

  formatter4 = (x: { text: string }) => x.text;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 1
          ? []
          : this.Empleados.filter(
              (v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 100)
      )
    );

  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }
  getEmpleados() {
    this._person.getAll({}).subscribe((r: any) => {
      this.Empleados = r.data;
    });
    /* this.http.get(this.globales.ruta + 'php/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Empleados = data;
    }); */
  }
  ComprobarPrestamo(tipo) {
    let empleado = this.modelo.person.id;
    let Tipo = tipo;
    /*  this.http.get(this.globales.ruta + 'php/prestamoylibranza/comprobar_prestamo.php', {params: { empleado: empleado,tipo: Tipo }}).subscribe((data: any) => {
    this.Comprobar = data;
    if(this.Comprobar.length > 0){
    this.Comprobar.forEach(lista => {
      if (lista.Estado == 'Pendiente') {
        let swal = {
          codigo: 'warning',
          mensaje: 'El Empleado tiene un(a) ' + lista.Tipo + ' Activo(a)',
          titulo: 'Empleado con ' + lista.Tipo + ' Vigente'
        }
        this.modelo.Empleado = '';
        this.modelo.type = '';
        this.swalService.ShowMessage(swal);
      }
    })
    }


    }); */
  }
  changeTipo(tipo) {
    if (this.modelo.person.id) {
      /* this.modelo.type = tipo; */
      if (tipo == 'Libranza') {
        /*  this.http
          .get(this.globales.ruta + 'php/prestamoylibranza/listar_bancos.php')
          .subscribe((data: any) => {
            this.Bancos = data;
          }); */
      }
    } else {
      /* this.modelo.type = 'Prestamo' */
      this._swal.show({title:'Falta Seleccionar el funcionario',icon:'error',text:'Debe seleccionar un funcionario',showCancel:false});
    }
  }
  interesA(interes) {
    if (this.modelo.person.id) {
      this.modelo.interest_type = interes;
      if (interes == 'Capital') {
        // this.getProcesos(this.modelo.Empleado.Identificacion_Funcionario);
        /*  this.http
          .get(this.globales.ruta + 'php/prestamoylibranza/listar_bancos.php')
          .subscribe((data: any) => {
            this.Bancos = data;
          }); */
      }
    } else {
      let swal = {
        codigo: 'error',
        mensaje: 'Debe seleccionar un Empleado',
        titulo: 'Falta Seleccionar Empleado',
      };
      /* this.swalService.ShowMessage(swal); */
    }
  }
  getProcesos(id) {
    /*  this.http
      .get(this.globales.ruta + 'php/funcionarios/procesos.php', {
        params: { Funcionario: id },
      })
      .subscribe((data: any) => {
        this.Procesos = data;
      }); */
  }
  // validarCampo(campo, evento, tipo, pos?) {
  //   // Funcion que validará los campos de typeahead
  //   if (typeof campo != "object" && campo != "") {
  //     /* evento.focus(); */
  //     this.confirmacionSwal.title = "Incorrecto!";
  //     this.confirmacionSwal.type = "error";
  //     this.confirmacionSwal.text = `El valor ${tipo} no es valido.`;
  //     this.confirmacionSwal.show();
  //     if (tipo == "Centro de Costo") {
  //       evento.value = "";
  //       this.Centro_Costo_Selected = "";
  //     } else if (tipo == "Cuenta") {
  //       this.Lista_Factura[pos]["PlanCuenta"] = "";
  //     }
  //   }
  // }
  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.PlanesCuenta.filter(
              (v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 100)
      )
    );
  formatter1 = (x: { Codigo: string }) => x.Codigo;

  getProximasQuincenas() {
   
    this._loan.getNextPayrolls().subscribe((r: any) => {
      this.Quincenas = r.data;
    });
  }
  save() {
    this.modelo.person_id = this.modelo.person.id;
    let info = JSON.stringify(this.modelo);

    this._loan.save().subscribe((r:any)=>{
        
    })

  }
  limpiarCampos() {
    this.modelo.person = '';
    this.modelo.type = '';
    this.modelo.interest_type = '';
    this.modelo.value = 0;
    this.modelo.monthly_fee = 0;
    this.modelo.interest = 0;
    this.modelo.Quincena = '';
    this.modelo.observation = '';
    this.modelo.payment_date = '';
  }
  changePagoCuota(cuota) {
    if (cuota == 'Si') {
      this.cuotaDisabled = false;
      this.inter = false;
      if (typeof this.modelo.person == 'object') {
        let salario = parseFloat(this.modelo.person.Salario);
        let cuota = this.modelo.value / this.modelo.number_fees; // Agregando el 10% del salario del empleado como sugerencia para la cuota mensual.

        if (this.modelo.value < cuota) {
          this.modelo.monthly_fee = this.modelo.value;
        } else {
          this.modelo.monthly_fee = cuota;
        }
      }
    } else {
      this.cuotaDisabled = true;
      this.modelo.monthly_fee = this.modelo.value;
    }
  }
  CalduloCuota() {
    this.changePagoCuota(this.modelo.pay_fees);
  }
  SinInteres(value) {
    if (value == 'Sin') {
      this.modelo.interest = 0;
    }
  }

}
