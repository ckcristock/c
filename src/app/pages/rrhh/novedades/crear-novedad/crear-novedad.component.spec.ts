import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNovedadComponent } from './crear-novedad.component';

describe('CrearNovedadComponent', () => {
  let component: CrearNovedadComponent;
  let fixture: ComponentFixture<CrearNovedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNovedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
