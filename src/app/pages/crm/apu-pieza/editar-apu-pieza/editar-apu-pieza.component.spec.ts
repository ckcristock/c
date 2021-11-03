import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarApuPiezaComponent } from './editar-apu-pieza.component';

describe('EditarApuPiezaComponent', () => {
  let component: EditarApuPiezaComponent;
  let fixture: ComponentFixture<EditarApuPiezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarApuPiezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarApuPiezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
