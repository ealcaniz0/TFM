import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtemaFormComponent } from './subtema-form.component';

describe('SubtemaFormComponent', () => {
  let component: SubtemaFormComponent;
  let fixture: ComponentFixture<SubtemaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubtemaFormComponent]
    });
    fixture = TestBed.createComponent(SubtemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
