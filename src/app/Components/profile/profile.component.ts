import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder,UntypedFormControl,Validators } from '@angular/forms';
import { User } from 'src/app/Models/user.dto';
import { formatDate } from '@angular/common';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/confirm-password.validator';
import { Curso } from 'src/app/Models/curso.dto';
import { CourseService } from 'src/app/Services/course.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: UntypedFormGroup;
  profile: UntypedFormControl;
  name: UntypedFormControl;
  surname: UntypedFormControl;
  birth_date: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;
  passwordConf: UntypedFormControl;
  user: User;
  courses: Curso[]=[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<any>(this.courses);

  constructor(private formBuilder: UntypedFormBuilder, private localStorageService: LocalStorageService, private userService: UserService, private router: Router, private courseService: CourseService){
    this.user =  new User('','','',new Date(),'','',[]);
    this.profile = new UntypedFormControl('');
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
      formatDate(this.user.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );
    this.email = new UntypedFormControl('');
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
    this.profileForm = this.formBuilder.group({
      profile: this.profile,
      name:this.name,
      surname:this.surname,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
      passwordConf: this.passwordConf
    },{validators: confirmPasswordValidator});
  }

  ngOnInit(): void {
    const user = JSON.parse(this.localStorageService.get('user') || '');
    if (user){
      this.userService.getUser(user).subscribe(user => {
        this.profile.setValue(user.profile);
        this.profileForm.controls['profile'].disable();
        this.name.setValue(user.name);
        this.surname.setValue(user.surname);
        this.birth_date.setValue(
            formatDate(user.birth_date, 'yyyy-MM-dd', 'en')
          );
        this.email.setValue(user.email);
        this.profileForm.controls['email'].disable();
        this.password.setValue(user.password);
        this.user.profile=user.profile;
      });

      if(this.user.profile=='Administrador'){
        this.courseService.getCourses(user).subscribe(courses => {
          this.courses=courses;
        });
      }else if(this.user.profile=='Alumno'){
        this.userService.getCourses(user).subscribe(courses => {
          this.courses=courses;
        });
      }
      this.dataSource.data = this.courses; 
      this.dataSource.sort = this.sort;
    }
  }
  update(): void{
    if (this.profileForm.invalid) {
      return;
    }
    this.user.email=JSON.parse(this.localStorageService.get('user') || '');
    this.user.name=this.name.value;
    this.user.surname=this.surname.value;
    this.user.birth_date=this.birth_date.value;
    this.user.password=this.password.value;
    this.userService.updateUser(this.user).subscribe((value: boolean) => {
      if (value) {
        window.location.reload();
      }
    });
  }
  sortData(event: any) {
    const sortColumn = event.active;
    const sortDirection = event.direction;
    this.dataSource.data = this.courses.sort((a, b) => {
      const isAsc = sortDirection === 'asc';
      switch (sortColumn) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'titulo': return this.compare(a.title, b.title, isAsc);
        case 'categoria': return this.compare(a.categoria, b.categoria, isAsc);
        case 'fecha_publicacion': return this.compareDates(a.publication_date, b.publication_date, isAsc);
        case 'fecha': return this.compareDates(a.publication_date, b.publication_date, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  compareDates(a: Date, b: Date, isAsc: boolean): number {
    return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
  }

  editCourse(id: string): void {
    this.navigationTo('cursos/'+ id) ;
  }
  deleteCourse(id: string): void {
    this.courseService.deleteCurso(id).subscribe((value: boolean) => {
      if (value) {
        this.courseService.getCourses(JSON.parse(this.localStorageService.get('user') || '')).subscribe(courses => {
          this.courses=courses;
        });
        this.dataSource.data = this.courses; 
        this.dataSource.sort = this.sort;
      }
    });
  }
  publishCourse(id: string): void {
    this.courseService.publish(id).subscribe((value: boolean) => {
      if (value) {
        this.courseService.getCourses(JSON.parse(this.localStorageService.get('user') || '')).subscribe(courses => {
          this.courses=courses;
        });
        this.dataSource.data = this.courses; 
        this.dataSource.sort = this.sort;
      }
    });
  }
  hideCourse(id: string): void {
    this.courseService.hide(id).subscribe((value: boolean) => {
      if (value) {
        this.courseService.getCourses(JSON.parse(this.localStorageService.get('user') || '')).subscribe(courses => {
          this.courses=courses;
        });
        this.dataSource.data = this.courses; 
      }
    });
  }
  viewCourse(id: string): void{
    this.navigationTo('curso/'+id);
  }
  unsuscribeCourse(idcurso: string):void{
    this.userService.unsuscribeCourse(JSON.parse(this.localStorageService.get('user') || ''),idcurso).subscribe(value =>{
      if (value) {
        this.userService.getCourses(JSON.parse(this.localStorageService.get('user') || '')).subscribe(courses => {
            this.courses=courses;
        });
        this.dataSource.data = this.courses; 
      }
    });
  }
  navigationTo(route: string): void{
    this.router.navigateByUrl(route);
  }
}
