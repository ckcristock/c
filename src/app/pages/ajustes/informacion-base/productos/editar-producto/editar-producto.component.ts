import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss'],
})
export class EditarProductoComponent implements OnInit {
  public id = this.route.snapshot.params['id'];
  public Producto: any = {};
  public Familias: any[] = [];
  public Subcategorias: any[] = [];
  public Fotos: any;
  public Lista: any = [];
  public Codigo_Barras: any = '';
  public fieldDinamicSubcategory: any[] = [];
  public fieldDinamic: any[];

  /* TODO ACTUALIZAR FUNCIONARIO */

  public Identificacion_Funcionario = '1';
  constructor(
    private _category: CategoryService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  ngOnInit() {
    // this.http.get(environment.ruta+ 'php/genericos/detalle.php', {params: { modulo: 'Producto', id: this.id }}).subscribe((data: any) => {
    this.http
      .get(environment.ruta + 'php/productos/producto_detalle.php', {
        params: { modulo: 'Producto', id: this.id },
      })
      .subscribe((data: any) => {
        this.Producto = JSON.parse(
          functionsUtils.utf8_decode(JSON.stringify(data.productos[0]))
        );
        this.fieldDinamic = data.productos[0].Variables;
        this.Codigo_Barras = data.productos[0].Codigo_Barras;

        // this.Codigo_Barras=data.Codigo_Barras;
      });

    this.http
      .get(environment.ruta + 'php/lista_generales.php', {
        params: { modulo: 'Familia' },
      })
      .subscribe((data: any) => {
        this.Familias = data;
      });

    this.http
      .get(environment.ruta + 'php/lista_generales.php', {
        params: { modulo: 'Subcategoria' },
      })
      .subscribe((data: any) => {
        this.Subcategorias = data;
      });

    this.http
      .get(environment.ruta + 'php/productos/lista.php', {
        params: { id: this.id },
      })
      .subscribe((data: any) => {
        this.Lista = data;
      });
  }
  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();
  CargaFoto(event) {
    let fot = document.getElementById('foto_visual') as HTMLImageElement;

    if (event.target.files.length === 1) {
      this.Fotos = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      // console.log(url);

      fot.src = url;
    }
  }
  GuardarProducto(formulario: NgForm) {

    let info = JSON.stringify(formulario.value);
    let lista = this.normalize(JSON.stringify(this.Lista));
    let datos = new FormData();
    datos.append('modulo', 'Producto');
    datos.append('datos', functionsUtils.utf8_encode(info));
    datos.append('lista', lista);
    datos.append('funcionario', this.Identificacion_Funcionario);
    datos.append('field', JSON.stringify(this.fieldDinamic));
    datos.append('Foto', this.Fotos);
    this.http
      .post(environment.ruta + 'php/productos/producto_guardar.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = 'Producto actualizado';
        this.confirmacionSwal.text = 'Producto actualizado correctamente';
        this.confirmacionSwal.icon = 'success';
        this.confirmacionSwal.fire();
        formulario.reset();
        this.VerPantallaLista();
        this.Fotos = [];
      });
  }
  VerPantallaLista() {
    this.router.navigate(['/ajustes/informacion-base/productos']);
  }

  ValidarCodigo() {
    this.http
      .get(environment.ruta + 'php/productos/validar_codigo.php', {
        params: { codigo: this.Codigo_Barras },
      })
      .subscribe((data: any) => {
        if (data.Id_Producto) {
          let html = `
          <h5>Este codigo de barras ya esta asociado a otro producto:</h5>

          <ul>
            <li><strong style="font-weight:bold;font-size:15px">Nombre: </strong> <span style="font-size:15px">${data.Nombre_Comercial}</span></li>
            <li><strong style="font-weight:bold;font-size:15px">Laboratorio: </strong> <span style="font-size:15px">${data.Laboratorio_Comercial}</span></li>
            <li><strong style="font-weight:bold;font-size:15px">Embalaje: </strong> <span style="font-size:15px">${data.Embalaje}</span></li>
          </ul>
        `;
          this.confirmacionSwal.title = '';
          this.confirmacionSwal.html = html;
          this.confirmacionSwal.icon = 'warning';
          this.confirmacionSwal.fire();
          this.Codigo_Barras = this.Producto.Codigo_Barras;
        }
      });
  }

  getVariablesDinamic(value) {
    this.http
      .get(environment.ruta + 'php/parametros/lista_subcategoria.php', {
        params: { id: value },
      })
      .subscribe((data: any) => {
        this.fieldDinamic = data.Subcategoria[0].Variables;
      });
  }
  /*
    editVariablesDinamic(value,item){
      let obj ={
        id : item.id,
        subcategory_variables_id : item.subcategory_variables_id,
        valor : value
      }
      this.fieldDinamicSubcategory.push(obj);
    }
*/
  getDinamicVariables(value) {
    this._category.getSubCategoryEdit(this.id, value).subscribe((r: any) => {
      console.log(r);

      this.fieldDinamic = [];
      this.fieldDinamic = r.data;
    });
  }

  editVariablesDinamic(value, item, i) {
    const t = this.fieldDinamic.find((el) => el.id === item.id);

    if (t.id) {
      this.fieldDinamic[i].valor = value;
    } else {
      let obj = {
        id: item.id,
        subcategory_variables_id: item.subcategory_variables_id,
        valor: value,
      };
      this.fieldDinamic[i] = obj;
    }
  }

  saveVariablesDinamic(value, item, i) {
    let obj = {
      subcategory_variables_id: item.id,
      valor: value,
    };

    this.fieldDinamicSubcategory[i] = obj;
  }
}
