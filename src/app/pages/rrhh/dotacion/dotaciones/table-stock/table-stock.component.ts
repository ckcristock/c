import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { DotacionService } from '../../dotacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-stock',
  templateUrl: './table-stock.component.html',
  styleUrls: ['./table-stock.component.scss']
})
export class TableStockComponent implements OnInit {

  @Input('type') type
  @Input('name') name
  @Input('entrega') entrega= false;
  @Input('find') find = true;

  @Output('closeModal') closeModal = new EventEmitter();

  @ViewChild('modalEntregaEpp') modalEntregaEpp: any;
  @ViewChild('modalSalidas') modalSalidas: any;
  @ViewChild('modalApartadas') modalApartadas: any;

  openModal = new EventEmitter<any>()
  openModalSalidas = new EventEmitter<any>()

  public Lista_Grupos_Inventario1: any = [];
  public Apartadas: any = [];
  public Lista_Grupos_Inventario_Epp: any = [];
  public Empleados: any[] = [];
  people: any[] = [];

  loading = false;
  public cam: boolean = false;
  public flagDotacionApp: boolean = false;

  titulo:string = '';

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }

  public Entrega: any = {
    person_id: '',
    cost: 0,
    code: '',
    description: '',
    type: ''
  }

  filtros:any = {
    name: ''

  }

  constructor(private _dotation: DotacionService,private _person: PersonService){}

  formatter4 = (x: { Nombres: string }) => x.Nombres;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 1 ? []
        : this.Empleados.filter(v => v.Nombres.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );

  ngOnInit(): void {

    if(this.find){
      this.search()
    }
  }

  search(){

    this.getPeople()
    this.Lista_Empleados()
    this.getData();
  }

  getData(page=1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros,
      type : this.type,
      name : this.name
    }

    this.entrega ? params.entrega = true : '';
    this.loading = true;
    this._dotation.getStok(params).subscribe((r: any) => {
    this.Lista_Grupos_Inventario1 = r.data.data;
    this.pagination.collectionSize = r.data.total;
    this.loading = false;
    });
  }

  getPeople() {
    this._person.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: 0 });
    });
  }


  Lista_Empleados() {
    this._person.getPeopleIndex().subscribe((r: any) => {
      this.Empleados = r.data;
      console.log("empleados");
      console.log(this.Empleados);

    });
  }///FINAL LISTAR EMPLEADOS


  cerrarModal(){
    this.closeModal.next();

  }


  listarSalidas(q){
    this.openModalSalidas.next({data:q})

  }

  getApartadas({id}){


    let params = {
      ...this.pagination, ...this.filtros,
      id: id
    }
    this.loading = true;
    this._dotation.getSelected(params).subscribe((r: any) => {

      this.Apartadas = r.data.data;
      this.pagination.collectionSize = r.data.total;

      this.loading = false;


    })
    this.modalApartadas.show();
  }



  maxLengthCheck(object) {
    if (object.value.max > object.max)
      object.value = object.value.slice(0, object.max)
  }

  cambio(prod) {

    Object.keys(prod).forEach(x => {
      if (prod["quantity"] > (prod["stock"] - prod["cantidadA"])) {
        this.cam = true;
      } else {
        this.cam = false;
      }
    });



  }

  save() {

    Swal.fire({
      title: '¿Seguro?',
      text: 'Va a generar una nueva dotación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this.GuardarEntrega()
      }
    });
}

  GuardarEntrega() {

  this.Entrega.type = this.flagDotacionApp ? 'Dotacion' : 'EPP';
  let entrega = this.Entrega;

  // let prods: Array<any> = this.Lista_Grupos_Inventario1;
  // let prods: Array<any> = this.flagDotacionApp ? this.Lista_Grupos_Inventario1 : this.Lista_Grupos_Inventario_Epp;
  // let prods: Array<any> = this.Lista_Grupos_Inventario1;



  // prods = prods.reduce((acc, el) => {
  //   return (prod.length == 0 ? acc : [...acc, ...prod])
  // }, [])

  let prods: Array<any> = this.Lista_Grupos_Inventario1.filter(r => (r.quantity && r.quantity != "0"))

  this._dotation.saveDotation({ entrega, prods }).subscribe((r: any) => {

    if (r.code == 200) {
      Swal.fire({
        title: 'Opersación exitosa',
        text: 'Felicidades, se ha guardado la dotación',
        icon: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      this.cerrarModal();
      // this.onChange1();
      // this.modalEntrega.hide()
      // this.modalEntregaEpp.hide()
      // this.ListarDotaciones()

      this.Entrega = {
        person_id: '',
        cost: 0,
        code: '',
        description: '',
        // type: 'Dotacion'
        type: ''
      }
    } else {
      Swal.fire({
        title: 'Operación denegada',
        text: r.err,
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }

  })
}
}
