import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderKitchenComponent } from './order-list.component';

describe('OrderListComponent', () => {
  let component: OrderKitchenComponent;
  let fixture: ComponentFixture<OrderKitchenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderKitchenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
