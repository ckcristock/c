import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTercerosComponent } from './crear-terceros.component';

describe('CrearTercerosComponent', () => {
  let component: CrearTercerosComponent;
  let fixture: ComponentFixture<CrearTercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTercerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
