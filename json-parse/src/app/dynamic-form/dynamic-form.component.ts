import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

interface JsonForm {
  form: string;
  label: string;
  controls : JsonFormControls[]
}

interface JsonFormControls {
  name: string;
  placeholder?:string;
  label?: string;
  value?: string;
  type: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  regex?: string;
  items?: JsonFormItems;
}

interface JsonFormItems {
  identity?: string;
  value?: string;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnChanges {

  @Input() json:JsonForm;
  public form : FormGroup = this.fb.group({});
  imageURL: string;
  
  constructor(private fb: FormBuilder,public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {

    if (!changes.json.firstChange) {
      this.createForm(this.json);
    }
  }

  createForm(controls: JsonForm) {
    for (const control of controls.controls) {
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control)) {
        switch (key) {
          case 'min': {
            validatorsToAdd.push(Validators.min(value));
            break;
          }
          case 'max':{
            validatorsToAdd.push(Validators.max(value));
            break;
          }
          case 'required': {
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          }
          case 'requiredTrue':{
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          }
          case 'email':{
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          }
          case 'minLength':{
            validatorsToAdd.push(Validators.minLength(value));
            break;
          }
          case 'maxLength':{
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          }
          case 'pattern':{
            validatorsToAdd.push(Validators.pattern(value));
            break;
          }
          case 'nullValidator':{
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          }
          default:
            break;
        }
      }

      this.form.addControl(
        control.name,
        this.fb.control(control.items.value, validatorsToAdd)
      );
    }
  }

  onSubmit() {
    if(this.form.valid){    
      console.log('Form valid: ', this.form.valid);
      console.log('Form values: ', this.form.value);
      this.openDialog(this.form.value);
    }
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        name: this.form.value.name,
        age: this.form.value.age,
        dob: this.form.value.dob,
        email: this.form.value.email,
        comments: this.form.value.comments,
        imageURL: this.imageURL,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  showPreview(event, controlame) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)    
  }

}
