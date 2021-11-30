import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacionSalidasComponent } from './dotacion-salidas.component';

describe('DotacionSalidasComponent', () => {
  let component: DotacionSalidasComponent;
  let fixture: ComponentFixture<DotacionSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotacionSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotacionSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
