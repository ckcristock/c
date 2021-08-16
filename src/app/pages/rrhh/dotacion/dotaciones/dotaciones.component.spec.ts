import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacionesComponent } from './dotaciones.component';

describe('DotacionesComponent', () => {
  let component: DotacionesComponent;
  let fixture: ComponentFixture<DotacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
