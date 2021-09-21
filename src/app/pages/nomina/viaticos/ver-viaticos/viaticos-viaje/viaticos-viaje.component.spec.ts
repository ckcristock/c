import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaticosViajeComponent } from './viaticos-viaje.component';

describe('ViaticosViajeComponent', () => {
  let component: ViaticosViajeComponent;
  let fixture: ComponentFixture<ViaticosViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaticosViajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaticosViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
