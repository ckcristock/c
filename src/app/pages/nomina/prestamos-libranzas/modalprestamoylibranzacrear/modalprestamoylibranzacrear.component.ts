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
import { debounceTime, map } from 'rxjs/operators';
import { PrestamoModel } from './PrestamoModel';
import { PersonService } from '../../../ajustes/informacion-base/persons/person.service';
import { LoanService } from '../loan.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import {error} from '@angular/compiler/src/util';

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
    this._suscription = this.abrirModal.subscribe((data: any) =>
      this.modalPrestamoylibranza.show()
    );
    this.getPlains();
    this.getEmpleados();
    this.getProximasQuincenas();
  }

  getPlains() {
    this._loan.accountPlains().subscribe((r: any) => {
      this.PlanesCuenta = r.data;
    });
  }

  changePerson() {}

  formatter4 = (x: { text: string }) => x.text;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 3
          ? []
          : this.Empleados.filter(
              (v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 100)
      )
    );

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 3
          ? []
          : this.PlanesCuenta.filter(
              (v) => v.code.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 100)
      )
    );

  formatter1 = (x: { code: string }) => x.code;

  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }
  getEmpleados() {
    this._person.getAll({}).subscribe((r: any) => {
      this.Empleados = r.data;
    });
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
      /*   this._loan.getBankList().subscribe((r: any) => (this.Bancos = r.data)); */
      }
    } else {
      this._swal.show({
        title: 'Falta Seleccionar el funcionario',
        icon: 'error',
        text: 'Debe seleccionar un funcionario',
        showCancel: false,
      });
    }
  }
  interesA(interes) {
    if (this.modelo.person.id) {
      this.modelo.interest_type = interes;
      if (interes == 'Capital') {
       /*   this._loan.getBankList().subscribe((r: any) => (this.Bancos = r.data)); */
      }
    } else {
      this._swal.show({
        title: 'Falta Seleccionar el funcionario',
        icon: 'error',
        text: 'Debe seleccionar un funcionario',
        showCancel: false,
      });
    }
  }

  getProximasQuincenas() {
    this._loan.getNextPayrolls().subscribe((r: any) => {
      this.Quincenas = r.data;
    });
  }
  save() {
    this.modelo.person_id = this.modelo.person.id;
    this.modelo.account_plain_id = this.modelo.account_plain_id.id;
   // let info = JSON.stringify(this.modelo);

    this._loan.save(this.modelo).subscribe((r: any) => {
      
      this._swal.show(
	  {title:'Operación exitosa',
	    text:'Prestamo/Libranza Creado con éxito',
	    icon:'success',showCancel:false})  
	    this.modalPrestamoylibranza.hide();
    },err=>{
	this._swal.show(
	  {title:'Ha ocurrido un error',
	    text:'Comuniquese con el Dpt. de Sistemas',
	    icon:'error',showCancel:false})  
    });

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

  limpiarCampos() {
    this.modelo.person = '';
    this.modelo.type = '';
    this.modelo.interest_type = '';
    this.modelo.value = 0;
    this.modelo.monthly_fee = 0;
    this.modelo.interest = 0;
    this.modelo.Quincena = '';
    this.modelo.observation = '';
    this.modelo.first_payment_date = '';
  }
}
