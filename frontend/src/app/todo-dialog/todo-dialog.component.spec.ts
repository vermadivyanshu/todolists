import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDialogComponent, TodoDialogData } from './todo-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('TodoDialogComponent', () => {
  let component: TodoDialogComponent;
  let fixture: ComponentFixture<TodoDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TodoDialogComponent>>;
  const dialogData: TodoDialogData = {
    title: 'Test Dialog',
    todo: { title: 'Test Title', detail: 'Test Detail' },
    okLabel: 'OK',
    cancelLabel: 'Cancel'
  };

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ],
      imports: [TodoDialogComponent, NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TodoDialogComponent>>;
    fixture.detectChanges();
  });

  it('should initialize form with data', () => {
    expect(component.todoForm.value).toEqual(dialogData.todo);
  });

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should return updated todo on getTodo()', () => {
    const updatedTodo = { title: 'Updated Title', detail: 'Updated Detail' };
    component.todoForm.setValue(updatedTodo);
    expect(component.getTodo()).toEqual({ ...dialogData.todo, ...updatedTodo });
  });
});
