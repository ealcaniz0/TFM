import { Component} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Models/user.dto';
import { formatDate } from '@angular/common';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/confirm-password.validator';
import { MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstLoginForm: UntypedFormGroup;
  secondLoginForm: UntypedFormGroup;
  type: UntypedFormControl;
  name: UntypedFormControl;
  surname: UntypedFormControl;
  birth_date: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;
  passwordConf: UntypedFormControl;
  registerUser: User;

  constructor(private formBuilder: UntypedFormBuilder, private userService: UserService, private router: Router, public dialog: MatDialog) {
    this.registerUser =  new User('','','',new Date(),'','',[]);
    this.type = new UntypedFormControl('', [
      Validators.required
    ]);
    this.name = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ]);
    this.surname = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);
    this.birth_date = new UntypedFormControl(
      formatDate(this.registerUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );
    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);
    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);
    this.passwordConf = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);
    this.firstLoginForm = this.formBuilder.group({
      type: this.type
    });
    this.secondLoginForm = this.formBuilder.group({
      name:this.name,
      surname:this.surname,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
      passwordConf: this.passwordConf,     
    },{validators: confirmPasswordValidator});
  }

  register(): void{
    if (this.secondLoginForm.invalid) {
      return;
    }   
   
    this.registerUser.profile=this.type.value;
    this.registerUser.name=this.name.value;
    this.registerUser.surname=this.surname.value;
    this.registerUser.birth_date=this.birth_date.value;
    this.registerUser.email=this.email.value;
    this.registerUser.password=this.password.value;
    this.userService.register(this.registerUser).subscribe((value: boolean) => {
      if (value) {
        this.router.navigateByUrl('login');
      }else{
        this.openDialog();
      }
    });
  }
  openDialog() {
    this.dialog.open(DialogComponent,{data: {title: 'Registro', message: 'El usuario ya existe'}});
  }
}

