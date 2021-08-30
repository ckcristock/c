import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinariosComponent } from './disciplinarios.component';

describe('DisciplinariosComponent', () => {
  let component: DisciplinariosComponent;
  let fixture: ComponentFixture<DisciplinariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplinariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
