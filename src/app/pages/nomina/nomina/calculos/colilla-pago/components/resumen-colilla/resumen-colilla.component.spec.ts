import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenColillaComponent } from './resumen-colilla.component';

describe('ResumenColillaComponent', () => {
  let component: ResumenColillaComponent;
  let fixture: ComponentFixture<ResumenColillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenColillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenColillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
