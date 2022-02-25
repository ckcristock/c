import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoFijoCatalogoComponent } from './activo-fijo-catalogo.component';

describe('ActivoFijoCatalogoComponent', () => {
  let component: ActivoFijoCatalogoComponent;
  let fixture: ComponentFixture<ActivoFijoCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivoFijoCatalogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoFijoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
