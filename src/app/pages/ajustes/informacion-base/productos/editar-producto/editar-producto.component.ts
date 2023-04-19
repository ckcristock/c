import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {
  id: string;
  data: any;
  loading: boolean = true
  constructor(
    private route: ActivatedRoute,
    private _product: ProductoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getProduct();
    })
  }

  getProduct() {
    this.loading = true;
    this._product.show(this.id).subscribe((res: any) => {
      this.data = res.data;
      this.loading = false;
    })
  }

}
