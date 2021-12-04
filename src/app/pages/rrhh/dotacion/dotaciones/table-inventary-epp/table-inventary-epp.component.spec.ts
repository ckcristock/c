import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInventaryEppComponent } from './table-inventary-epp.component';

describe('TableInventaryEppComponent', () => {
  let component: TableInventaryEppComponent;
  let fixture: ComponentFixture<TableInventaryEppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableInventaryEppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableInventaryEppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
