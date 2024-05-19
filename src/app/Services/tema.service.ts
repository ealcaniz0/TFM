import { Injectable } from '@angular/core';
import { Curso } from '../Models/curso.dto';
import { LocalStorageService } from './local-storage.service';
import { Tema } from '../Models/tema.dto';
import { Observable } from 'rxjs';
import { of as ObservableOf } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
  })
  export class TemaService {
    private courses: Curso[];

    constructor(private localStorageService: LocalStorageService) {
        this.courses = (JSON.parse(localStorageService.get("cursos") || "[]") || []).map(      
            (course: Curso) => new Curso(course.id, course.title, course.publication_date,course.author,course.descripcion,course.categoria,course.temas,course.publicado,course.completado)
          );
    }

    getTemas(cursoid: string): Observable<Tema[]>{
        this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
        let temas = (this.courses.find(course =>course.id==cursoid)?.temas || [])
        return ObservableOf(temas);
      }
    getTema(id: string, cursoid: string): Observable<Tema>{
        this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
        let foundTema= ((this.courses.find(each => each.id == cursoid ) || new Curso('','',new Date(),'','','',[],false,false)).temas.find(each => each.id == id) || new Tema('','','',[],false,''));
        return ObservableOf(foundTema);
    }
    create(tema: Tema, cursoid: string): Observable<string>{
      this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
      if (this.courses.find(course =>course.id==cursoid)?.temas == undefined){
        return ObservableOf('');
      }else{
        tema.id=uuidv4();
        tema.completado=false;
        this.courses.find(course =>course.id==cursoid)?.temas.push(tema);
        this.localStorageService.set("cursos", JSON.stringify(this.courses));
        return ObservableOf(tema.id);
      }
    }
    update(tema: Tema, cursoid: string, position: number): Observable<boolean>{
      this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
      this.courses.map(course =>{
        if (course.id == cursoid) {
          course.temas.map(item =>{
            if (item.id == tema.id) {
              item=tema
            }
          });
          //Position
          if (position !== course.temas.map(item => item.id).indexOf(tema.id)+1){
            course.temas.splice(position -1, 0, course.temas.splice(course.temas.map(item => item.id).indexOf(tema.id), 1)[0]);
          }
        }
      });
      this.localStorageService.set("cursos", JSON.stringify(this.courses));
      return ObservableOf(true); 
    }
    delete(cursoid: string, temaid: string, subtemaid: string): Observable<boolean>{
      this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]")
      this.courses.map(course =>{
        if (course.id == cursoid) {
          course.temas.map(item =>{
            if (item.id == temaid) {
              item.subtemas=item.subtemas.filter(item => item.id !== subtemaid);
            }
          });
        }
      });
      this.localStorageService.set("cursos", JSON.stringify(this.courses));
      return ObservableOf(true); 
    }
  }