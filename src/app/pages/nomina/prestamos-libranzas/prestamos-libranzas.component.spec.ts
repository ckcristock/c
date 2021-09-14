import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosLibranzasComponent } from './prestamos-libranzas.component';

describe('PrestamosLibranzasComponent', () => {
  let component: PrestamosLibranzasComponent;
  let fixture: ComponentFixture<PrestamosLibranzasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamosLibranzasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamosLibranzasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
