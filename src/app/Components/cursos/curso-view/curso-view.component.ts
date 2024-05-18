import { Component,OnInit } from '@angular/core';
import { Curso } from 'src/app/Models/curso.dto';
import { Router,ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/Services/course.service';
import { Tema } from 'src/app/Models/tema.dto';
import { Subtema } from 'src/app/Models/subtema.dto';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SubtemaService } from 'src/app/Services/subtema.service';
import { TemaService } from 'src/app/Services/tema.service';
import { UserService } from 'src/app/Services/user.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

@Component({
  selector: 'app-curso-view',
  templateUrl: './curso-view.component.html',
  styleUrls: ['./curso-view.component.scss']
})
export class CursoViewComponent implements OnInit {
  course: Curso;
  id: string | null;
  titulo:string;
  texto: string;
  img: string;
  temaid: string | null;
  subtemaid: string | null;
  constructor(private activatedRoute: ActivatedRoute, private courseService: CourseService, private subtemaService: SubtemaService, private temaService: TemaService, private userService: UserService,private localStorageService: LocalStorageService){
    this.course =  new Curso('','',new Date(),'','','',[],false,false);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.titulo='';
    this.texto='';
    this.img='';
    this.temaid=null;
    this.subtemaid=null;
  }
  ngOnInit(): void{
    if (this.id) {
      this.userService.getCourse(JSON.parse(this.localStorageService.get('user') || ''),this.id).subscribe((curso => {
        this.course=curso;
        this.titulo='';
        this.texto=curso.descripcion;
        this.img='';
      }));
    }
  }

  selectTema(tema:Tema){    
      this.temaid=tema.id;
      this.subtemaid=null;
      this.course.temas.map(item => {
          if (item.id == tema.id){
            this.titulo=item.title;
            this.texto=item.texto;
            this.img=item.img;
          }
        }
      )
  }
  selectSubtema(tema:Tema, subtema:Subtema){
    this.temaid=tema.id;
    this.subtemaid=subtema.id;
    this.course.temas.find(item => item.id ==tema.id)?.subtemas.map(item => {
      if (item.id == subtema.id){
        this.titulo=item.title;
        this.texto=item.texto;
        this.img=item.img;
      }
    })
  }

  toggleChanged(event: MatSlideToggleChange, temaid: string, subtemaid: string) {
      if(temaid){
        if(subtemaid){
          this.userService.completeSubtema(JSON.parse(this.localStorageService.get('user') || ''),subtemaid,temaid,this.course.id,event.checked).subscribe();
        }else{
          this.userService.completeTema(JSON.parse(this.localStorageService.get('user') || ''),temaid,this.course.id,event.checked).subscribe();
        }
        if (this.id) {
          this.userService.getCourse(JSON.parse(this.localStorageService.get('user') || ''),this.id).subscribe((curso => {
            this.course=curso;
          }));
        }
      }  
  }
}
