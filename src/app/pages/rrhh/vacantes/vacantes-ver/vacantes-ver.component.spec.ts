import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantesVerComponent } from './vacantes-ver.component';

describe('VacantesVerComponent', () => {
  let component: VacantesVerComponent;
  let fixture: ComponentFixture<VacantesVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantesVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantesVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
