import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-listadoproductosyainventariadosestiba',
  templateUrl: './listadoproductosyainventariadosestiba.component.html',
  styleUrls: ['./listadoproductosyainventariadosestiba.component.scss']
})
export class ListadoproductosyainventariadosestibaComponent implements OnInit {
  @Input() Productos:any=[];
  @Input() Model:any=[];

  public Editar = false;
  public Fecha_Hoy = new Date();


  constructor(private _swalService:SwalService,private http: HttpClient,

    ) { }

  ngOnInit() {

  }

  editLote(pos, pos2) {
    this.Productos[pos].Lotes[pos2].AgregarLote = 'block';
    this.Editar=true;
  }
  addLote(pos, pos2) {
    //el último lote agregado le cambiamos su propiedad a none para que no sea editable
    this.Productos[pos].Lotes[pos2].AgregarLote= 'none';
    if(!this.Editar){

        let fila = {
          Codigo: "Ingresa uno Nuevo ->",
          Lote: '',
          Fecha_Vencimiento: '',
          Cantidad_Encontrada: '',
          Cantidad_Inventario: 0,
          Id_Inventario__Nuevo: 0,
          AgregarLote: 'none',
          Id_Producto:this.Productos[pos].Id_Producto
        }

        this.Productos[pos].Lotes.push(fila);

    }else{
      this.Editar=false;
    }
   this.reGuardarLotes();

  }
  mostrarUltimo(producto){
    this.Productos[producto].Lotes[this.Productos[producto].Lotes.length-1].AgregarLote='block'
  }

  verModelos(pos, pos2) {

    if (this.Productos[pos].Lotes[pos2].Lote == ""  || this.Productos[pos].Lotes[pos2].Fecha_Vencimiento == "" || this.Productos[pos].Lotes[pos2].Cantidad_Encontrada =="", this.Productos[pos].Lotes[pos2].Cantidad_Encontrada ==undefined ,this.Productos[pos].Lotes[pos2].Cantidad_Encontrada ==null) {
        return false;
    }
    if (this.Productos[pos].Lotes[pos2].Lote != "" && this.Productos[pos].Lotes[pos2].Fecha_Vencimiento != "" && this.Productos[pos].Lotes[pos2].Cantidad_Encontrada >= 0) {
      this.Productos[pos].Lotes[pos2].AgregarLote = 'none';
      return false;
      //this.Productos[pos].Lotes[pos2].EditLote = false;

    }
  }

  reValidarFecha(producto,lote) {

    this.Fecha_Hoy = new Date();
    var dia = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() - 365));
    var fecha_limite = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() + 3650));
     //Fecha Inferior es un(1) año menos que la actual
    var Fecha_Inferior = dia.toISOString().split("T")[0];
    //Fecha Superior son (10) años mas que la actual
    var Fecha_Superior = fecha_limite.toISOString().split("T")[0];

  //la fecha de vencimiento no puede ser menor a un año ni tamoco puede ser mayor que 10 años, si pasa eso genere un error
    if (this.Productos[producto].Lotes[lote].Fecha_Vencimiento < Fecha_Inferior ||  this.Productos[producto].Lotes[lote].Fecha_Vencimiento > Fecha_Superior) {

      let ultimo = this.Productos[producto].Lotes.length-1;
      if (lote == ultimo) {
        this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '' ;
        this.Productos[producto].Lotes[lote].Lote = '' ;
        this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
        this.Productos[producto].Lotes[lote].AgregarLote ='none';
      }


      let swal = {
        icon:"error",
        title: "Error en la Fecha de Vencimiento ",
        text: "Hay un error en la fecha de la Vencimiento, Por Favor Revise "
      };
      this._swalService.show(swal);


    }else{
      //en caso contrario enfoque el siguiente campo para ser rellenado

      //document.getElementById("Cantidad"+pos).focus();
    }


  }

  reValidarLote(producto,lote) {


    if (this.Productos[producto].Lotes[lote].Lote.length < 3) {

      let swal = {
        icon:"error",
        title: "Error en Lote",
        text: "La longitud del Lote debe ser mayor o igual a tres letras"
      };
      this._swalService.show(swal);
      this.Productos[producto].Lotes[lote].Lote = '';
    } else {
      this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.trim();
      this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.toUpperCase();

      return false;

    }


  }
  reValidarCantidad(producto,lote){

    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (this.Productos[producto].Lotes[lote].Codigo=='Ingresa uno Nuevo ->' &&( this.Productos[producto].Lotes[lote].Cantidad_Encontrada ==0 ||  this.Productos[producto].Lotes[lote].Cantidad_Encontrada ==''||   !this.Productos[producto].Lotes[lote].Cantidad_Encontrada )) {

      let ultimo = this.Productos[producto].Lotes.length-1;


      if (lote == ultimo) {
        this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '' ;
        this.Productos[producto].Lotes[lote].Lote = '' ;
        this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
        this.Productos[producto].Lotes[lote].AgregarLote ='none';
      }
      let swal = {
        icon:"error",
        title: "Hay un error  ",
        text: "Los lotes nuevos deben ser mayor a 0, Por favor revise"
      };
      this._swalService.show(swal);

      return false

    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios

    if (this.Productos[producto].Lotes[lote].Cantidad_Encontrada =='' || !this.Productos[producto].Lotes[lote].Cantidad_Encontrada
     || this.Productos[producto].Lotes[lote].Fecha_Vencimiento=='' || this.Productos[producto].Lotes[lote].Lote=='') {


      let ultimo = this.Productos[producto].Lotes.length-1;
      if (lote == ultimo) {
        this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '' ;
        this.Productos[producto].Lotes[lote].Lote = '' ;
        this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
        this.Productos[producto].Lotes[lote].AgregarLote ='none';
      }


      let swal = {
        icon:"error",
        title: "Hay un error  ",
        text: "Debe agregar todos los campos , por favor revise "
      };
      this._swalService.show(swal);
        return false
    }
    //si todo sale bien verifica si exite en la fila previamente

    this.reVerificarSiExisteEnFila(producto,lote);

  }

  reVerificarSiExisteEnFila(producto,lote){
    //eliminar espacios
    this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.trim();
    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.Productos[producto].Lotes.length > 1) {
      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.Productos[producto].Lotes.length-1; index++) {

        //SI el producto con el lote correspondiente es
        if (this.Productos[producto].Lotes[lote].Lote==this.Productos[producto].Lotes[index].Lote && this.Productos[producto].Lotes[lote]!=this.Productos[producto].Lotes[index]){


          let ultimo = this.Productos[producto].Lotes.length-1;
        if (lote == ultimo) {
          this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '' ;
          this.Productos[producto].Lotes[lote].Lote = '' ;
          this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
          this.Productos[producto].Lotes[lote].AgregarLote ='none';
        }
          let swal = {
            icon:"error",
            title: "Error en referencia del Lote",
            text: "Existe un Lote del mismo producto agregado , Por Favor Revise "
          };
          this._swalService.show(swal);
          return false

        }
      };


    }else{

    }
    //si no encotró coincidencia agregue a la fila


    this.addLote(producto,lote);


  }
  reGuardarLotes() {
    let productos = JSON.stringify(this.Productos);
    let datos = new FormData();
    datos.append("Id_Doc_Inventario_Fisico", this.Model["Id_Doc_Inventario_Fisico"]);
    datos.append("Productos", productos);
    this.SaveLoteEstiba(datos).subscribe((data:any)=>{
      if(data.codigo == 'success'){
        this._swalService.show(data);

        // localStorage.setItem("ProductosInventario", this._generalService.normalize(JSON.stringify(this.Productos)));
      }else{
        this._swalService.show(data);
      }
    });
  }

  public SaveLoteEstiba(data: FormData){
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/agrega_productos.php', data);
  }

  }


