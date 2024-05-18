import { Component } from '@angular/core';
import { User } from 'src/app/Models/user.dto';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import { Header } from 'src/app/Models/header.dto';
import { HeaderService } from 'src/app/Services/header.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser: User;
  email: UntypedFormControl;
  password: UntypedFormControl;
  LoginForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder,private userService: UserService, private headeService: HeaderService, private localStorageService: LocalStorageService, private headerService: HeaderService, private router: Router, public dialog: MatDialog){
    this.loginUser = new User('','','',new Date(),'','',[]);
    this.email = new UntypedFormControl('', [
      Validators.required
    ]);
    this.password = new UntypedFormControl('', [
      Validators.required
    ]);
    this.LoginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  login(): void {
    if (this.LoginForm.invalid) {
      return;
    }
    this.loginUser.email=this.email.value;
    this.loginUser.password=this.password.value;
    this.userService.login(this.loginUser).subscribe((value: boolean) => {
      if (value) {
        const headerInfo: Header = {
          authSection: true,
          noAuthSection: false,
        };
        this.headerService.headerManagement.next(headerInfo);
        this.router.navigateByUrl('home');
      }else{
        this.openDialog();
      }
    });
  }

  openDialog() {
    this.dialog.open(DialogComponent,{data: {title: 'Login', message: 'El usuario no existe o la contraseña es incorrecta'}});
  }
}
