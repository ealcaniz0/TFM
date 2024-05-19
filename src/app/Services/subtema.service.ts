import { Injectable } from '@angular/core';
import { Curso } from '../Models/curso.dto';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';
import { of as ObservableOf } from 'rxjs';
import { Subtema } from '../Models/subtema.dto';
import { Tema } from '../Models/tema.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SubtemaService {
  private courses: Curso[];

  constructor(private localStorageService: LocalStorageService) { 
    this.courses = JSON.parse(localStorageService.get("cursos") || "[]");
  }
  getSubtema(id: string, temaid: string, cursoid: string): Observable<Subtema>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]");
    let foundSubtema= (((this.courses.find(each => each.id == cursoid ) || new Curso('','',new Date(),'','','',[],false,false)).temas.find(each => each.id == temaid) || new Tema('','','',[],false,'')).subtemas.find(each => each.id ==id) || new Subtema('','','',false,''));
    return ObservableOf(foundSubtema);
  }
  create(subtema: Subtema, temaid: string, cursoid: string): Observable<string>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]");
    if (this.courses.find(course =>course.id==cursoid)?.temas == undefined){
      return ObservableOf('');
    }else{
      if (this.courses.find(course =>course.id==cursoid)?.temas.find(tema => tema.id == temaid)?.subtemas == undefined){
        return ObservableOf('');
      }else{
        subtema.id=uuidv4();
        subtema.completado=false
        this.courses.find(course =>course.id==cursoid)?.temas.find(tema => tema.id == temaid)?.subtemas.push(subtema);
        this.localStorageService.set("cursos", JSON.stringify(this.courses));
        return ObservableOf(subtema.id);
      }
    }
  }
  update(subtema: Subtema, temaid: string, cursoid: string, position: number): Observable<boolean>{
    this.courses = JSON.parse(this.localStorageService.get("cursos") || "[]");
    this.courses.map(course =>{
      if (course.id == cursoid) {
        course.temas.map(item =>{
          if (item.id == temaid) {
            item.subtemas.map(item =>{
              if (item.id == subtema.id) {
                item=subtema
              }
            });
          
          //Position
          if (position !== item.subtemas.map(item => item.id).indexOf(subtema.id)+1){
            item.subtemas.splice(position -1, 0, item.subtemas.splice(item.subtemas.map(item => item.id).indexOf(subtema.id), 1)[0]);
          }
          }
        });
      }
    });     
    this.localStorageService.set("cursos", JSON.stringify(this.courses));
    return ObservableOf(true); 
  }
}
