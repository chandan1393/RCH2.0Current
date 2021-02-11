import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwregistrationComponent } from './pwregistration.component';

describe('PwregistrationComponent', () => {
  let component: PwregistrationComponent;
  let fixture: ComponentFixture<PwregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwregistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
