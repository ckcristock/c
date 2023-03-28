import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { PrestamoModel } from './PrestamoModel';
import { PersonService } from '../../../ajustes/informacion-base/persons/person.service';
import { LoanService } from '../loan.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-modalprestamoylibranzacrear',
  templateUrl: './modalprestamoylibranzacrear.component.html',
  styleUrls: ['./modalprestamoylibranzacrear.component.scss'],
})
export class ModalprestamoylibranzacrearComponent implements OnInit, OnDestroy {
  @ViewChild('addPrestamoylibranza') addPrestamoylibranza: any;
  @ViewChild('FormPrestamo') FormPrestamoTs: any;
  @Input() abrirModal: Observable<any> = new Observable();
  @Output() recargarLista: EventEmitter<any> = new EventEmitter();

  masksMoney = consts
  private _suscription: any;
  public Meses: any = [];
  public people: any = [];
  public modelo: PrestamoModel = new PrestamoModel();
  public cuotaDisabled: boolean = true;
  public inter: boolean = true;
  public Quincenas: any = [];
  public Procesos: any = [];
  public Bancos: any = [];
  public Comprobar: any = [];
  public PlanesCuenta: any = [];
  form: FormGroup;

  constructor(
    private _person: PersonService,
    private _loan: LoanService,
    private modalService: NgbModal,
    private _swal: SwalService,
    private _modal: ModalService,
    private http: HttpClient,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this._suscription = this.abrirModal.subscribe((data: any) =>
      this.openModal(this.addPrestamoylibranza)
    );
    this.createForm();
    this.getPlains();
    this.getEmpleados();
    this.getProximasQuincenas();
  }

  createForm() {
    this.form = this.fb.group({

    })
  }
  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }

  openModal(modal) {
    this.limpiarCampos();
    this._modal.open(modal, 'lg');
  }

  getEmpleados() {
    this._person.getAll({}).subscribe((r: any) => {
      this.people = r.data;
    });
  }

  getPlains() {
    this._loan.accountPlains().subscribe((r: any) => {
      this.PlanesCuenta = r.data;
    });
  }

  formatter4 = (x: { text: string }) => x.text;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 3
          ? []
          : this.people.filter(
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

  formatter2 = (x: { Nombre_Niif: string }) => x.Nombre_Niif;
  searchPC
  search_cuenta_niif = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchPC = true)),
      switchMap(term =>
        this.http.get<readonly string[]>(environment.base_url + "/php/plancuentas/filtrar_cuentas.php", { params: { coincidencia: term, tipo: 'niif' } }).pipe(
          tap(() => this.searchPC = false),
          catchError(() => {
            this.searchPC = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searchPC = false))
    );

  ComprobarPrestamo(tipo) {
    if (this.modelo.person.id) {
      /* this.modelo.type = tipo; */
      if (tipo == 'Libranza') {
        /*   this._loan.getBankList().subscribe((r: any) => (this.Bancos = r.data)); */
      }
      let empleado = this.modelo.person.id;
      let Tipo = tipo;
      this.http.get(environment.base_url + '/php/prestamoylibranza/comprobar_prestamo.php', { params: { empleado: empleado, tipo: Tipo } }).subscribe((data: any) => {
        this.Comprobar = data;
        if (this.Comprobar.length > 0) {
          this.Comprobar.forEach(lista => {
            if (lista.state == 'Pendiente') {
              this._swal.show({
                icon: 'warning',
                title: 'Funcionario con ' + lista.type.toLowerCase() + ' vigente',
                text: 'El funcionario tiene un(a) ' + lista.type.toLowerCase() + ' activo(a)',
                showCancel: false
              })
              this.modelo.person = '';
              this.modelo.type = null;
            }
          })
        }
      });
    } else {
      this.modelo.type = ''
      this._swal.show({
        title: 'Selecciona un funcionario',
        icon: 'error',
        text: '',
        showCancel: false,
      });
    }

  }
  changeTipo(tipo) {

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
  save(form: NgForm) {
    console.log(form)
    if (form.valid) {
      this.modelo.person_id = this.modelo.person.id;
      this.modelo.account_plain_id = this.modelo.account_plain_id.id;
      // let info = JSON.stringify(this.modelo);

      this._loan.save(this.modelo).subscribe((r: any) => {

        this._swal.show(
          {
            title: 'Operación exitosa',
            text: 'Préstamo/Libranza creado con éxito',
            icon: 'success',
            showCancel: false,
            timer: 1000
          })
        this.modalService.dismissAll();
        this.recargarLista.next()
      }, err => {
        this._swal.show(
          {
            title: 'Ha ocurrido un error',
            text: 'Comuniquese con el departamento de sistemas',
            icon: 'error', showCancel: false
          })
      });
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Llena todos los campos requeridos y vuelve a intentarlo.',
        showCancel: false
      })
    }

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
