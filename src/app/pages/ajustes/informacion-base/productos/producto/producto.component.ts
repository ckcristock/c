import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CatalogoService } from '../../catalogo/catalogo.service';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  product_id: any;
  product: any = {};
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private _product: ProductoService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.product_id = params.get('id');
      this.getProduct();
    })
  }

  getProduct() {
    this.loading = true;
    this._product.show(this.product_id).subscribe((res: any) => {
      this.product = res.data;
      this.loading = false
    })
  }

}
