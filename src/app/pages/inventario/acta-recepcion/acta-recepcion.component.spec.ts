import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaRecepcionComponent } from './acta-recepcion.component';

describe('ActaRecepcionComponent', () => {
  let component: ActaRecepcionComponent;
  let fixture: ComponentFixture<ActaRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaRecepcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
