import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEventSkeletonComponent } from './card-event-skeleton.component';

describe('CardEventSkeletonComponent', () => {
  let component: CardEventSkeletonComponent;
  let fixture: ComponentFixture<CardEventSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEventSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEventSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
