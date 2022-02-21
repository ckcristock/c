import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNegociosComponent } from './table-negocios.component';

describe('TableNegociosComponent', () => {
  let component: TableNegociosComponent;
  let fixture: ComponentFixture<TableNegociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableNegociosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
