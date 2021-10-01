import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarViaticoComponent } from './editar-viatico.component';

describe('EditarViaticoComponent', () => {
  let component: EditarViaticoComponent;
  let fixture: ComponentFixture<EditarViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarViaticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
