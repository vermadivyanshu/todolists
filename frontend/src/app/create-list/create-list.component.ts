import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TodoService } from '../services/todo.service';
import { MatDialog } from '@angular/material/dialog';
import { ListFormComponent } from '../list-form/list-form.component';
import { tap } from 'rxjs';
import { List } from '../services/todo.types';

@Component({
  selector: 'app-create-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, ListFormComponent],
  templateUrl: './create-list.component.html',
  styleUrl: './create-list.component.css'
})
export class CreateListComponent {

  @Output() newItemEvent = new EventEmitter<List>();

  constructor(private todoService: TodoService, public dialog: MatDialog) {}

  onClickCreateList() {
    const dialogRef = this.dialog.open(ListFormComponent, {
      data: {
        title: 'Create List',
        name: null,
        cancelLabel: 'Cancel',
        okLabel: 'Create'
      }
    })
    dialogRef.afterClosed().subscribe(list => {
      if(list && list.name) {
        this.todoService.createList(list).pipe(
          tap((createdList) => {
            this.newItemEvent.emit(createdList)
          })
        ).subscribe();
      }
    });
  }

  
}
