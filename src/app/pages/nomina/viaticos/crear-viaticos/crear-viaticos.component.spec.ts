import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearViaticosComponent } from './crear-viaticos.component';

describe('CrearViaticosComponent', () => {
  let component: CrearViaticosComponent;
  let fixture: ComponentFixture<CrearViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearViaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
