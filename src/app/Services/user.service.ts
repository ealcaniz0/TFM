import { Injectable } from '@angular/core';
import { User } from '../Models/user.dto';
import { Observable } from 'rxjs';
import { of as ObservableOf } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Curso } from '../Models/curso.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private users: User[];

  constructor(private localStorageService: LocalStorageService) {
    this.users = (JSON.parse(localStorageService.get("users") || "[]") || []).map(      
      (user: User) => new User(user.profile,user.name,user.surname,user.birth_date,user.email,user.password,user.cursos)
    );
  }

  register(user: User): Observable<boolean>{
    let foundUser = this.users.find(each => each.email == user.email);
    if (foundUser){
      return ObservableOf(false);
    }
    this.users.push(user);
    this.localStorageService.set("users", JSON.stringify(this.users));
    return ObservableOf(true);
  }

  login(user: User): Observable<boolean>{
    let foundUser = this.users.find(each => each.email == user.email && each.password == user.password);
    if (foundUser){      
      this.localStorageService.set("user", JSON.stringify(foundUser.email));    
      return ObservableOf(true);
    }
    return ObservableOf(false);
  }

  logout(): void{
    this.localStorageService.remove('user');
  }

  getUser(user: string): Observable<User>{
       let foundUser = (this.users.find(each => each.email == user ) || new User('','','',new Date(),'','',[]));
       return ObservableOf(foundUser);
  }

  updateUser(userU: User): Observable<boolean>{
    console.log(userU.email)
    this.users = this.users.map(user =>
      user.email === userU.email
      ? new User(user.profile,userU.name,userU.surname,userU.birth_date,user.email,userU.password,userU.cursos)
      : user
      );
    this.localStorageService.set("users", JSON.stringify(this.users));
    return ObservableOf(true)
  }

  getCourses(user: string): Observable<Curso[]>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]") 
    let cursos = this.users.find(item => item.email == user)?.cursos || []
    return ObservableOf(cursos);
  }
  getCourse(user: string,idcurso: string): Observable<Curso>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]") 
    let curso = (this.users.find(item => item.email == user)?.cursos || []).find(each => each.id == idcurso ) || new Curso('','',new Date(),'','','',[],false,false);
    return ObservableOf(curso);
  }
  suscribeCourse(user: string, curso: Curso): Observable<boolean>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]")
    let foundCurso = this.users.find(each => each.email == user)?.cursos.find(item => item.id == curso.id)
    if (foundCurso == undefined){
      curso.publication_date=new Date()
      this.users.find(each => each.email == user)?.cursos.push(curso)
      this.localStorageService.set("users", JSON.stringify(this.users));
      return ObservableOf(true)
    }else{
      return ObservableOf(false)
    }
  }
  unsuscribeCourse(user: string, idcurso: string): Observable<boolean>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]")
    let cursos = this.users.find(each => each.email == user)?.cursos.filter(item => item.id !== idcurso) || []
      this.users.map(element =>{
        if (element.email==user){
          element.cursos=cursos;
        }
      });
      this.localStorageService.set("users", JSON.stringify(this.users));
      return ObservableOf(true)
  }
  completeSubtema(user: string,subtemaid: string, temaid: string, cursoid: string, complete:boolean): Observable<boolean>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]");
    let course = this.users.find(item => item.email == user)?.cursos.find(course =>course.id==cursoid);

    if(course == undefined){
      return ObservableOf(false);  
    }else{
      //Subtema
      course.temas.find(tema => tema.id == temaid)?.subtemas.map(item =>{
        if (item.id == subtemaid) {
          item.completado=complete;
        }
      });
      if(complete){
        //Tema
        if(course.temas.find(tema => tema.id == temaid)?.subtemas.find(subtema => !subtema.completado) == undefined){
          course.temas.map(item =>{
            if (item.id == temaid) {
              item.completado=true;
            }
          });
        }
        //Curso
        if(course.temas.find(tema => !tema.completado) == undefined){
          course.completado=true;
        }
      }else{
        //Tema
        course.temas.map(item =>{
          if (item.id == temaid) {
            item.completado=false;
          }
        });
        //Curso
        course.completado=false;
      }
      
      this.users.find(item => item.email == user)?.cursos.map(item =>{
        if(item.id==cursoid){
          if (course !== undefined){
            item=course;
          }
        }
      })   
      this.localStorageService.set("users", JSON.stringify(this.users));
      return ObservableOf(true);    
    }
  }

  completeTema(user: string, temaid: string, cursoid: string, complete:boolean): Observable<boolean>{
    this.users = JSON.parse(this.localStorageService.get("users") || "[]");
    let course = this.users.find(item => item.email == user)?.cursos.find(course =>course.id==cursoid);

    if(course == undefined){
      return ObservableOf(false);  
    }else{
    //Tema
    course.temas.map(item =>{
      if (item.id == temaid) {
        item.completado=complete;
      }
    });
    if(complete){
      //Subtemas
      course.temas.find(tema => tema.id == temaid)?.subtemas.map(item =>{
          item.completado=true;
      })
      //Curso
      if(course.temas.find(tema => !tema.completado) == undefined){
        course.completado=true;
      }
    }else{
      //Curso
      course.completado=false;
    }

    this.users.find(item => item.email == user)?.cursos.map(item =>{
      if(item.id==cursoid){
        if (course !== undefined){
          item=course;
        }
      }
    })   
    this.localStorageService.set("users", JSON.stringify(this.users));
    return ObservableOf(true);   
    }
  }

}
