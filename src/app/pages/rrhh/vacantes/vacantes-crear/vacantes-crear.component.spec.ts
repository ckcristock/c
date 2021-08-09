import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantesCrearComponent } from './vacantes-crear.component';

describe('VacantesCrearComponent', () => {
  let component: VacantesCrearComponent;
  let fixture: ComponentFixture<VacantesCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantesCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantesCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
