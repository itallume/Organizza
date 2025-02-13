import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRegisterComponent } from './activity-register.component';

describe('ActivityRegisterComponent', () => {
  let component: ActivityRegisterComponent;
  let fixture: ComponentFixture<ActivityRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
