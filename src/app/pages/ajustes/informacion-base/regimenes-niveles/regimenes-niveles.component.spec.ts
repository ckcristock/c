import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimenesNivelesComponent } from './regimenes-niveles.component';

describe('RegimenesNivelesComponent', () => {
  let component: RegimenesNivelesComponent;
  let fixture: ComponentFixture<RegimenesNivelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimenesNivelesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimenesNivelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
