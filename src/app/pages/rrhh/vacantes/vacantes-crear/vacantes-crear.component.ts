import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/takeWhile';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-vacantes-crear',
    templateUrl: './vacantes-crear.component.html',
    styleUrls: ['./vacantes-crear.component.scss']
})

export class VacantesCrearComponent implements OnInit {

    public fecha = new Date();
    public Departamentos:any[] = [];
    public Municipios:any[] = [];
    public Grupos:any[] = [];
    public Dependencias:any[] = [];
    public Cargos:any[] = [];
    public Funcionario:any = JSON.parse(localStorage.getItem("User"));
    public Fecha_Inicio:any;
    public Fecha_Fin:any;
    public Salario_Inferior:any;
    public Horario_Inferior:any;
    public Salario_Superior:any;
    public Horario_Superior:any;

    @ViewChild('confirmacionSwal') confirmacionSwal: any;

    constructor( private http: HttpClient, private router: Router) { }

    ngOnInit() {
        // console.log(this.Funcionario);

        this.http.get(environment.base_url + 'php/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
            this.Departamentos = data;

          });
        this.http.get(environment.base_url + 'php/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
            this.Grupos = data;

          });

    }
    normalize = (function() {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for(var i = 0, j = from.length; i < j; i++ )
            mapping[ from.charAt( i ) ] = to.charAt( i );

        return function( str ) {
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );
        }

      })();

    ListarMunicipios(e) {
        this.http.get(environment.base_url + 'php/vacantes/lista_municipios.php', {params: {id: e} }).subscribe((data: any) => {
            this.Municipios = data;

          });
    }
    ListarDependencias(e) {
        this.http.get(environment.base_url + 'php/vacantes/lista_dependencias.php', {params: {id: e} }).subscribe((data: any) => {
            this.Dependencias = data;

          });
    }
    ListarCargos(e) {
        this.http.get(environment.base_url + 'php/vacantes/lista_cargos.php', {params: {id: e} }).subscribe((data: any) => {
            this.Cargos = data;

          });
    }

    validarFechas() {

        var fecha_inicio= ((document.getElementById("Fecha_Inicio") as HTMLInputElement).value);
        var fecha_fin= ((document.getElementById("Fecha_Fin") as HTMLInputElement).value);


        if (fecha_inicio >= fecha_fin && fecha_fin != "") {
            this.Fecha_Inicio = '';
            this.Fecha_Fin = '';
            this.confirmacionSwal.title = "Fechas invalidas";
            this.confirmacionSwal.text = "Fecha Inicio no puede ser mayor a Fecha Fin";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show();
        }

      }

      validarSalarios() {

        var salario_inferior= ((document.getElementById("Salario_Inferior") as HTMLInputElement).value);
        var salario_superior= ((document.getElementById("Salario_Superior") as HTMLInputElement).value);

        if (salario_inferior >= salario_superior && salario_superior != "") {
            this.Salario_Inferior = '';
            this.Salario_Superior = '';
            this.confirmacionSwal.title = "Salarios invalidos";
            this.confirmacionSwal.text = "Salario Inferior no puede ser mayor al Superior";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show();
        }

      }

      validarHorarios() {

        var horario_inferior= ((document.getElementById("Horario_Inferior") as HTMLInputElement).value);
        var horario_superior= ((document.getElementById("Horario_Superior") as HTMLInputElement).value);

        if (horario_inferior >= horario_superior && horario_superior != "") {
            this.Horario_Inferior = '';
            this.Horario_Superior = '';
            this.confirmacionSwal.title = "Horarios invalidos";
            this.confirmacionSwal.text = "Horario Inferior no puede ser mayor al Superior";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show();
        }

      }

    GuardarVacante(formulario: NgForm) {
        // console.log("Formulario", formulario.value);
        let Data = new FormData();
        let vacantes_info = this.normalize(JSON.stringify(formulario.value));
        Data.append("datos", vacantes_info);
        Data.append("modulo", "Vacante");

        this.http.post(environment.base_url + 'php/vacantes/guardar_vacantes.php', Data).subscribe((data: any) => {
            this.confirmacionSwal.title = "Guardar Vacante";
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.type = data.tipo;
            this.confirmacionSwal.show();
            this.router.navigate(['/Hojas_vida/vacantes']);
            formulario.reset();
        });

    }
}
