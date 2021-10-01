import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFijosComponent } from './lista-fijos.component';

describe('ListaFijosComponent', () => {
  let component: ListaFijosComponent;
  let fixture: ComponentFixture<ListaFijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaFijosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
