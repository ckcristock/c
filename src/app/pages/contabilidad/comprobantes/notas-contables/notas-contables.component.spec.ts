import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasContablesComponent } from './notas-contables.component';

describe('NotasContablesComponent', () => {
  let component: NotasContablesComponent;
  let fixture: ComponentFixture<NotasContablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasContablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
