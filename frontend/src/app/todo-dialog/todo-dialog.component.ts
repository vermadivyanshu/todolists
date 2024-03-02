import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface TodoDialogData {
  title: string;
  todo: {title: string, detail: string};
  okLabel: string;
  cancelLabel: string;
}

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule
  ],
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.css'
})
export class TodoDialogComponent {
  todoForm: FormGroup
  constructor(
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData
  ) {
    this.todoForm = new FormGroup({
      title: new FormControl(this.data.todo.title, [Validators.required, Validators.minLength(1)]),
      detail: new FormControl(this.data.todo.detail, [Validators.minLength(1)])
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getTodo() {
    return  {...this.data.todo, ...this.todoForm.value};
  }

}
