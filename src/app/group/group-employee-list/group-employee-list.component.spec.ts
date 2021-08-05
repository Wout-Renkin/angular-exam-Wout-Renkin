import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEmployeeListComponent } from './group-employee-list.component';

describe('GroupEmployeeListComponent', () => {
  let component: GroupEmployeeListComponent;
  let fixture: ComponentFixture<GroupEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEmployeeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
