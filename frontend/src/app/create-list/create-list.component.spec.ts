import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CreateListComponent } from './create-list.component';
import { TodoService } from '../services/todo.service';
import { ListFormComponent } from '../list-form/list-form.component';
import { List } from '../services/todo.types';

describe('CreateListComponent', () => {
  let component: CreateListComponent;
  let fixture: ComponentFixture<CreateListComponent>;
  let todoService: TodoService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateListComponent],
      providers: [
        { provide: TodoService, useValue: { createList: jasmine.createSpy('createList').and.returnValue(of(null)) } },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of({ name: 'Test List' }) }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit newItemEvent when list is created', () => {
    const createdList: List = { id: 1, name: 'Test List' };
    (todoService.createList as jasmine.Spy).and.returnValue(of(createdList));
    const emitSpy = spyOn(component.newItemEvent, 'emit');

    component.onClickCreateList();

    expect(dialog.open).toHaveBeenCalledWith(ListFormComponent, jasmine.any(Object));
    expect(todoService.createList).toHaveBeenCalledWith({ name: 'Test List' });
    expect(emitSpy).toHaveBeenCalledWith(createdList);
  });
});