import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSortieComponent } from './card-sortie.component';

describe('CardSortieComponent', () => {
  let component: CardSortieComponent;
  let fixture: ComponentFixture<CardSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSortieComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
