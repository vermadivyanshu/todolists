import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListFormComponent, ListFormDialogData } from './list-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

describe('ListFormComponent', () => {
  let component: ListFormComponent;
  let fixture: ComponentFixture<ListFormComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<ListFormComponent>>;

  const dialogData: ListFormDialogData = {
    title: 'Test Title',
    name: 'Test Name',
    cancelLabel: 'Cancel',
    okLabel: 'OK'
  };

  beforeEach(async () => {
    const matDialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ListFormComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: matDialogRefSpyObj }
      ]
    }).compileComponents();

    matDialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ListFormComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided data', () => {
    expect(component.listForm.value.name).toBe('Test Name');
  });

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });

  it('should return form value on getList() call', () => {
    const formValue = component.getList();
    expect(formValue.name).toBe('Test Name');
  });
});