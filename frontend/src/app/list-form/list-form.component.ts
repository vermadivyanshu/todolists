import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent, 
  MAT_DIALOG_DATA} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ListFormDialogData {
  title: string;
  name: string;
  cancelLabel: string,
  okLabel: string
}

@Component({
  selector: 'app-list-form',
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
  templateUrl: './list-form.component.html',
  styleUrl: './list-form.component.css'
})
export class ListFormComponent {
  listForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListFormDialogData
  ) {
    this.listForm = new FormGroup({
      name: new FormControl(this.data.name, [Validators.required, Validators.minLength(1)])
    })
  }

  getList() {
    return this.listForm.value;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
