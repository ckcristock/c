import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenProvisionesComponent } from './resumen-provisiones.component';

describe('ResumenProvisionesComponent', () => {
  let component: ResumenProvisionesComponent;
  let fixture: ComponentFixture<ResumenProvisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenProvisionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenProvisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
