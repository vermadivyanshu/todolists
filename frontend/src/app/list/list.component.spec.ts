import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from './list.component';
import { TodoService } from '../services/todo.service';
import { List, ListWithTodos, Todo } from '../services/todo.types';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const todoServiceSpyObj = jasmine.createSpyObj('TodoService', [
      'getList', 'createTodo', 'deleteTodo', 'updateTodo', 'deleteList', 'updateList'
    ]);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map().set('listId', '1') } } },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list on changes', () => {
    const listWithTodos: ListWithTodos = { id: 1, name: 'Test List', todos: [] };
    todoServiceSpy.getList.and.returnValue(of(listWithTodos));

    component.ngOnChanges({ listId: { currentValue: 1 } } as any);

    expect(todoServiceSpy.getList).toHaveBeenCalledWith(1);
    expect(component.list).toEqual(listWithTodos);
  });

  // Add more test cases as needed for other methods

});
