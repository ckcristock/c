import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProductosCatalogoComponent } from './table-productos-catalogo.component';

describe('TableProductosCatalogoComponent', () => {
  let component: TableProductosCatalogoComponent;
  let fixture: ComponentFixture<TableProductosCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableProductosCatalogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableProductosCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
