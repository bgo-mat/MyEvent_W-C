import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeOutingFormComponent } from './organize-outing-form.component';

describe('OrganizeOutingFormComponent', () => {
  let component: OrganizeOutingFormComponent;
  let fixture: ComponentFixture<OrganizeOutingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizeOutingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizeOutingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
