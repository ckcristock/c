import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinasHerramientasComponent } from './maquinas-herramientas.component';

describe('MaquinasHerramientasComponent', () => {
  let component: MaquinasHerramientasComponent;
  let fixture: ComponentFixture<MaquinasHerramientasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinasHerramientasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinasHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
