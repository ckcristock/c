import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from 'rxjs/operators';
import { OperatorFunction, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { AccountPlanService } from 'src/app/core/services/account-plan.service';
import { PrettyCashService } from 'src/app/core/services/pretty-cash.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
type Person = { value: number; text: string };
@Component({
  selector: 'app-crear-caja',
  templateUrl: './crear-caja.component.html',
  styleUrls: ['./crear-caja.component.scss'],
})
export class CrearCajaComponent implements OnInit {
  @Input('openModal') openModal: EventEmitter<Boolean>;
  @Output('saved') saved = new EventEmitter<Boolean>();
  @ViewChild('modal') modal;
  @ViewChild('add') add;
  people: Person[] = [];
  accounts: any[] = [];
  forma: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _people: PersonService,
    private _prettyCash: PrettyCashService,
    private _account: AccountPlanService,
    private modalService: NgbModal,
    private _swal: SwalService,
    private _reactiveValid: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.getPeople();
    this.createForm();
    this.openModal.subscribe((r) => {
      this.getAccounts();
      //this.modal.show();
      this.openConfirm(this.add)
    });
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.forma.reset()
  }

  getAccounts() {
    this._account.getAllWithBalance().subscribe((r: any) => {
      this.accounts = r.data;
    });
  }
  save() {
    this._swal
      .show({
        text: 'Se dispone a crear una nueva caja',
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let values: any = {};
          values.person_id = this.forma.get('person').value.value;
          values.account_plan_id = this.forma.get('account_plan').value.id;
          values.initial_balance = this.forma.get('initial_balance').value;
          values.description = this.forma.get('description').value;

          this._prettyCash.save(values).subscribe(
            (r: any) => {
              this._swal.show({
                title: 'Operación Exitosa',
                text: 'Se ha creado una caja',
                icon: 'success',
                showCancel: false

              });
              this.saved.emit(true);
              //this.modal.hide();
              this.modalService.dismissAll(); 
            },
            (er) => {
              this._swal.show({
                title: 'Operación fallida ',
                text: 'Ha ocurrido un error',
                showCancel: false,
                icon: 'error',
              });
            }
          );
        }
      });
  }

  createForm() {
    this.forma = this.fb.group({
      person: ['', this._reactiveValid.required],
      account_plan: ['', this._reactiveValid.required],
      initial_balance: ['', this._reactiveValid.required],
      description: ['', this._reactiveValid.required],
    });
    this.forma.get('account_plan').valueChanges.subscribe((r) => {
      if (typeof r == 'object') {
        this.forma.patchValue({ initial_balance: r.balance.balance });
      }
    });
  }
  formatter = (state: Person) => state.text;
  searchPerson: OperatorFunction<string, readonly { value; text }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.people
          .filter((state) => new RegExp(term, 'mi').test(state.text))
          .slice(0, 10)
      )
    );

  searchAccount: OperatorFunction<string, readonly { value; text }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accounts
          .filter((state) => new RegExp(term, 'mi').test(state.text))
          .slice(0, 10)
      )
    );
  getPeople() {
    this._people.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data;
    });
  }
}
