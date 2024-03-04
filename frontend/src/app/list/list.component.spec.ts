import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from './list.component';
import { TodoService } from '../services/todo.service';
import { List, ListWithTodos, Todo } from '../services/todo.types';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
      ]
    }).compileComponents();

    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch list on changes', () => {
    const listWithTodos: ListWithTodos = { id: 1, name: 'Test List', todos: [] };
    todoServiceSpy.getList.and.returnValue(of(listWithTodos));

    component.ngOnChanges({ listId: { currentValue: 1 } } as any);

    expect(todoServiceSpy.getList).toHaveBeenCalledWith(1);
    expect(component.list).toEqual(listWithTodos);
  });

  it('should render list with no todo', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: []
    };
    fixture.detectChanges();
    const [heading] = fixture.debugElement.queryAll(By.css('h2'));
    expect(heading.nativeElement.textContent).toEqual('list');
  })
  it('should have list actions enabled', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: []
    };
    fixture.detectChanges();
    const [editBtn, deleteBtn] = fixture.debugElement.queryAll(By.css('button'));
    expect(editBtn.nativeElement.disabled).toEqual(false);
    expect(deleteBtn.nativeElement.disabled).toEqual(false);
  })
  it('should have list actions enabled', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: []
    };
    fixture.detectChanges();
    const [editBtn, deleteBtn] = fixture.debugElement.queryAll(By.css('button'));
    expect(editBtn.nativeElement.disabled).toEqual(false);
    expect(deleteBtn.nativeElement.disabled).toEqual(false);
  });

  it('should call updateList when delete button is clicked', () => {
    spyOn(component, 'onRemoveList')
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: []
    };
    fixture.detectChanges();
    const btns = fixture.debugElement.queryAll(By.css('.list-actions>button'));
    btns[1].nativeElement.click();
    expect(component.onRemoveList).toHaveBeenCalled();
  });

  it('should call updateList when delete button is clicked', () => {
    spyOn(component, 'onEditList')
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: []
    };
    fixture.detectChanges();
    const btns = fixture.debugElement.queryAll(By.css('.list-actions>button'));
    btns[0].nativeElement.click();
    expect(component.onEditList).toHaveBeenCalled();
  });

  it('should render todos when list has some', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.todo-list-item'));
    expect(items.length).toEqual(1);
    expect(items[0].nativeElement.textContent).toEqual('todotodo');
  });

  it('should have todo controls enabled when todos are present', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    expect(actionBtns.length).toEqual(4);
    const btnLabelAndActions =actionBtns.map(btn => [btn.nativeElement.textContent.trim(), btn.nativeElement.disabled]);
    expect(btnLabelAndActions).toEqual(
      [['Toggle', true], ['add Add', false], ['edit Edit', true], ['delete Remove', true]]
    );
  });

  it('should have todo controls enabled when todos are present and selected', () => {
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    component.selectedTodos = [{
      id: 1,
      title: 'todo',
      detail: 'todo',
      isDone: false
    }]
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    expect(actionBtns.length).toEqual(4);
    const btnLabelAndActions =actionBtns.map(btn => [btn.nativeElement.textContent.trim(), btn.nativeElement.disabled]);
    expect(btnLabelAndActions).toEqual(
      [['Toggle', false], ['add Add', false], ['edit Edit', false], ['delete Remove', false]]
    );
  });

  it('should call onClick toggle when toggle button is clicked', () => {
    spyOn(component, 'onClickToggle');
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    component.selectedTodos = [{
      id: 1,
      title: 'todo',
      detail: 'todo',
      isDone: false
    }]
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    actionBtns[0].nativeElement.click();
    expect(component.onClickToggle).toHaveBeenCalled();
  });

  it('should call onClickAddTodo when add todo button is clicked', () => {
    spyOn(component, 'onClickAddTodo');
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    actionBtns[1].nativeElement.click();
    expect(component.onClickAddTodo).toHaveBeenCalled();
  });

  it('should call onClickUpdateTodo when edit button is clicked', () => {
    spyOn(component, 'onClickUpdateTodo');
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    component.selectedTodos = [{
      id: 1,
      title: 'todo',
      detail: 'todo',
      isDone: false
    }]
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    fixture.detectChanges();
    actionBtns[2].nativeElement.click();
    expect(component.onClickUpdateTodo).toHaveBeenCalled();
  });

  it('should call onClickRemoveTodo when edit button is clicked', () => {
    spyOn(component, 'onClickRemoveTodo');
    component.listId = 1;
    component.list = {
      id: 1, name: 'list', todos: [{
        id: 1,
        title: 'todo',
        detail: 'todo',
        isDone: false
      }]
    };
    component.selectedTodos = [{
      id: 1,
      title: 'todo',
      detail: 'todo',
      isDone: false
    }]
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.queryAll(By.css('.todo-actions-container>button'));
    fixture.detectChanges();
    actionBtns[3].nativeElement.click();
    expect(component.onClickRemoveTodo).toHaveBeenCalled();
  });

});
