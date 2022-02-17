import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarProcesoComponent } from './cerrar-proceso.component';

describe('CerrarProcesoComponent', () => {
  let component: CerrarProcesoComponent;
  let fixture: ComponentFixture<CerrarProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CerrarProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
