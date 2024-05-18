import { Injectable } from '@angular/core';
import { Curso } from '../Models/curso.dto';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';
import { of as ObservableOf } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Curso[];

  constructor(private localStorageService: LocalStorageService) {
    this.courses = (JSON.parse(localStorageService.get("cursos") || "[]") || []).map(      
      (course: Curso) => new Curso(course.id, course.title, course.publication_date,course.author,course.descripcion,course.categoria,course.temas,course.publicado,course.completado)
    );
  }

  getCourses(user: string): Observable<Curso[]>{
    let courses = this.courses.map(course =>
      course.author === user
      ? new Curso(course.id,course.title,course.publication_date,course.author,course.descripcion,course.categoria,course.temas,course.publicado,course.completado)
      : course
    );
    return ObservableOf(courses);
  }

  create(curso: Curso): Observable<string>{
    curso.id=uuidv4();
    curso.author=JSON.parse(this.localStorageService.get('user') || '');
    curso.publicado=false;
    curso.completado=false;
    this.courses.push(curso);
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(curso.id);
  }
  update(curso: Curso): Observable<boolean>{
    this.courses.map(course =>{
      if (course.id == curso.id) {
        course=curso
      }
    });
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }
  deleteCurso(cursoid: string): Observable<boolean>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
    this.courses = this.courses.filter(item => item.id !== cursoid);
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }
  delete(cursoid: string, temaid: string): Observable<boolean>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
    this.courses.map(course =>{
      if (course.id == cursoid) {
        course.temas=course.temas.filter(item => item.id !== temaid);
      }
    });
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }

  getCourse(id: string): Observable<Curso>{
      this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
      let foundCourse = (this.courses.find(each => each.id == id ) || new Curso('','',new Date(),'','','',[],false,false));
      return ObservableOf(foundCourse);
  }
  publish(id:string): Observable<boolean>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
    this.courses.map(course =>{
      if (course.id == id) {
        course.publication_date=new Date();
        course.publicado=true;
      }
    });
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }
  hide(id:string): Observable<boolean>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
    this.courses.map(course =>{
      if (course.id == id) {
        course.publicado=false;
      }
    });
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }
}
