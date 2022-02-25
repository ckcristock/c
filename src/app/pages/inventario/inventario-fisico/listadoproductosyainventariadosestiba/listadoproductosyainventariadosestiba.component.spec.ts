import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoproductosyainventariadosestibaComponent } from './listadoproductosyainventariadosestiba.component';

describe('ListadoproductosyainventariadosestibaComponent', () => {
  let component: ListadoproductosyainventariadosestibaComponent;
  let fixture: ComponentFixture<ListadoproductosyainventariadosestibaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoproductosyainventariadosestibaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoproductosyainventariadosestibaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
