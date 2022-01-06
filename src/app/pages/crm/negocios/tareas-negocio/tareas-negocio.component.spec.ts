import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasNegocioComponent } from './tareas-negocio.component';

describe('TareasNegocioComponent', () => {
  let component: TareasNegocioComponent;
  let fixture: ComponentFixture<TareasNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TareasNegocioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TareasNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
