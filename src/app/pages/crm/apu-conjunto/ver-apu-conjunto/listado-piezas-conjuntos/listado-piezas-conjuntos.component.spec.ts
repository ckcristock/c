import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPiezasConjuntosComponent } from './listado-piezas-conjuntos.component';

describe('ListadoPiezasConjuntosComponent', () => {
  let component: ListadoPiezasConjuntosComponent;
  let fixture: ComponentFixture<ListadoPiezasConjuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPiezasConjuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPiezasConjuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
