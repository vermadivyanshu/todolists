import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { TodoService } from '../services/todo.service';
import { List, ListWithTodos, Todo } from '../services/todo.types';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { ListFormComponent } from '../list-form/list-form.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnChanges {
  @Input() listId: number | undefined;
  @Output() removeListEvent = new EventEmitter<ListWithTodos>();
  @Output() editListEvent = new EventEmitter<List>();
  list: ListWithTodos;
  selectedTodos: Todo[];

  constructor(private todoService: TodoService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {
    this.list = {};
    this.selectedTodos = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {listId: { currentValue = null } = {}} = changes;
    if(currentValue) {
      this.todoService.getList(currentValue).subscribe(result => {
        if(result) {
          this.list = result;
        }
      });
    }
  }

  onClickAddTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        title: 'Create Todo',
        todo: {
          title: null,
          detail: null
        },
        okLabel: 'Create',
        cancelLabel: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(todo => {
      if(todo && this.listId) {
        this.todoService.createTodo({...todo, listId: this.listId }).pipe(
          tap((createdTodo) => {
            if(createdTodo) {
              this.list.todos = [...this.list.todos || [], createdTodo]
            }
          })
        ).subscribe();
      }
    });
  }

  onClickRemoveTodo() {
    const todoToDelete: Todo = this.selectedTodos[0];
    if(!this.list.id) {
      return;
    }
    this.todoService.deleteTodo(todoToDelete.id, this.list.id).subscribe(()=> {
      this.list.todos = (this.list.todos || []).filter(todo => todo.id !== todoToDelete.id)
    });
  }

  onClickUpdateTodo() {
    const oldTodo: Todo = this.selectedTodos[0];
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        title: 'Edit Todo',
        todo: {
          title: oldTodo.title,
          detail: oldTodo.detail,
          isDone: oldTodo.isDone
        },
        okLabel: 'Save',
        cancelLabel: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(todo => {
      if(todo && this.listId) {
        this.todoService.updateTodo(oldTodo.id, {...todo, listId: this.listId }).subscribe(
          (updatedTodo) => {
            if(updatedTodo) {
              this.list.todos = (this.list.todos || []).map(todo => {
                if(todo.id === oldTodo.id) {
                  return updatedTodo;
                }
                return todo;
              })
              this.selectedTodos = [];
            }
          }
        );
      }
    });
  }

  onRemoveList() {
    if(!this.list.id) {
      return;
    }

    this.todoService.deleteList(this.list.id).subscribe(
      () => {
        this.removeListEvent.emit(this.list);
      }
    );
  }

  onEditList() {
    if(!this.list.id) {
      return;
    }

    const dialogRef = this.dialog.open(ListFormComponent, {
      data: {
        title: 'Update List',
        name: this.list.name,
        cancelLabel: 'Cancel',
        okLabel: 'Update'
      }
    })

    dialogRef.afterClosed().subscribe(updatedList => {
      if(updatedList && updatedList.name && this.list.id) {
        this.todoService.updateList(this.list.id, updatedList).subscribe((response) => {
          this.list.name = updatedList.name;
          this.editListEvent.emit(response);
        });
      }
    });
  }

  onClickToggle() {
    if(!this.list.id) {
      return;
    }
    const todo = this.selectedTodos[0];
    this.todoService.updateTodo(todo.id, {...todo, isDone: !todo.isDone, listId: this.list.id}).subscribe(
      (result) => {
        if(!result) {
          return;
        }
        this.list.todos = (this.list.todos || []).map(todoItem => {
          return todo.id === todoItem.id ? result : todoItem;
        });
        this.selectedTodos = [];
      }
    )
  }

  onSelectionChange(event: any) {
    this.selectedTodos = event.source.selectedOptions.selected.map((option: { value: any }) => option.value);
  }

}
