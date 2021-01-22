import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildmedicalComponent } from './childmedical.component';

describe('ChildmedicalComponent', () => {
  let component: ChildmedicalComponent;
  let fixture: ComponentFixture<ChildmedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildmedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildmedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
