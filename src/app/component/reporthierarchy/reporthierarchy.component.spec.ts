import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporthierarchyComponent } from './reporthierarchy.component';

describe('ReporthierarchyComponent', () => {
  let component: ReporthierarchyComponent;
  let fixture: ComponentFixture<ReporthierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporthierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporthierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
