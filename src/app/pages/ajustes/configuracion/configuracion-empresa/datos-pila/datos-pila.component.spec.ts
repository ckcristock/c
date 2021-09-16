import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPilaComponent } from './datos-pila.component';

describe('DatosPilaComponent', () => {
  let component: DatosPilaComponent;
  let fixture: ComponentFixture<DatosPilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPilaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
