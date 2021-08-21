import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss'],
})
export class AsistenciaComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('video', { static: false }) video: ElementRef;

  time = moment().format('LTS');
  vista = true;
  temp = 0.0;
  constructor() {}

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.beforeCreate();
    this.mounted();

  }

  capture() {
    console.log(this.canvas.nativeElement.getContext('2d'));

    var context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    var img = this.canvas.nativeElement.toDataURL('image/png');
    console.log(img);

    const video: HTMLVideoElement = this.video.nativeElement;
    video.pause();
    this.CambiaVista();
    /*   axios
      .post(`/api/${localStorage.getItem("tenant")}/asistencia/validar`, {
        imagen: img,
        temperatura: this.temp
      })
      .then(respuesta => {
        this.CambiaVista();
        respuesta.data.timer=4000;
        respuesta.data.showConfirmButton= false;
        this.$swal.fire(respuesta.data);
      })
      .catch(error => {
        this.CambiaVista();
        this.$swal.fire(
          "Oops!",
          "Han ocurrido errores, por favor intentar más tarde",
          "error",
          "3000",
          false
        );
      }); */
  }

  CambiaVista() {
    this.vista = !this.vista;
    if (this.vista) {
      const video: HTMLVideoElement = this.video.nativeElement;
      video.play();
    }
  }
  mounted() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video: HTMLVideoElement = this.video.nativeElement;

          video.srcObject = stream;
          video.setAttribute('crossorigin', 'anonymous');
          video.play();
        })
        .catch(function (error) {
          alert(
            'No se puede acceder a la Cámara : ' +
              error.name +
              ' ' +
              error.message
          );
        });
    }
    setInterval(() => {
      var precision = 10; // 2 decimals
      this.time = moment().format('LTS');
    }, 1000);
  }
  genRand(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  beforeCreate() {
    if (localStorage.getItem('tenant')) {
      //git console.log(localStorage.getItem("tenant"));
    } else {
      Swal.fire({
        title: 'Ingresa el nit de vuestra compañia',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'on',
        },
        // showCancelButton: true,
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        preConfirm: (nit) => {
          /* return axios
              .post(`/getTenant`, { nit: nit })
              .then(datos => {
                if (datos.data == "") {
                  window.location = "/";
                }
                localStorage.setItem("tenant", datos.data);
              })
              .catch(err => {
                this.$swal.showValidationMessage(
                  `Esta compañia no se encuentra registrada`
                );
              }); */
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            /*  title: `${result.value.login}'s avatar`,
              imageUrl: result.value.avatar_url */
          });
        }
      });
    }
  }
}
