import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder,UntypedFormControl,Validators } from '@angular/forms';
import { Tema } from 'src/app/Models/tema.dto';
import { Router,ActivatedRoute } from '@angular/router';
import { TemaService } from 'src/app/Services/tema.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { CourseService } from 'src/app/Services/course.service';
@Component({
  selector: 'app-tema-form',
  templateUrl: './tema-form.component.html',
  styleUrls: ['./tema-form.component.scss']
})
export class TemaFormComponent implements OnInit {
  temaForm: UntypedFormGroup;
  title: UntypedFormControl;
  position: UntypedFormControl;
  img: UntypedFormControl;
  text: UntypedFormControl;
  tema: Tema;
  idcurso: string;
  id: string | null;
  posiciones: number[];
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: UntypedFormBuilder, private router: Router, private temaService: TemaService,private _ngZone: NgZone, private courseService: CourseService) {
    this.tema = new Tema('','','',[],false,'');
    this.idcurso = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.id = this.activatedRoute.snapshot.paramMap.get('id2');
    this.title = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);
    this.position =  new UntypedFormControl('',[
      Validators.required
    ]);
    this.img = new UntypedFormControl('', [
      Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*/?)*\\?(\\S+=\\S+(&\\S+=\\S+)*)?$')
    ]);
    this.text = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(25),
      Validators.maxLength(500),
    ]);
    this.temaForm = this.formBuilder.group({
      title:this.title,
      position:this.position,
      img:this.img,
      text:this.text
    });
  }
  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void{
    this.posiciones=[];
    this.courseService.getCourse(this.idcurso).subscribe((curso => {
      for(var index in curso.temas){
        this.posiciones.push(+index+1);
      }
      if (this.id) {
        this.position.setValue(curso.temas.map(tema => tema.id).indexOf(this.id)+1);
      }else{
        this.posiciones.push(this.posiciones[this.posiciones.length-1]+1);
        this.position.setValue(this.posiciones[this.posiciones.length-1]);
        this.temaForm.controls['position'].disable();
      }
    }));     
    if (this.id) {
      this.temaService.getTema(this.id,this.idcurso).subscribe((tema => {
        this.tema=tema;
        this.title.setValue(tema.title);
        this.img.setValue(tema.img);
        this.text.setValue(tema.texto);
      }))
    }
  }
  
  save(): void{
    if (this.temaForm.invalid || this.idcurso==''){
      return;
    }   
    this.tema.title= this.title.value;
    this.tema.img= this.img.value;
    this.tema.texto= this.text.value;
    if (this.id==null){
      this.temaService.create(this.tema,this.idcurso).subscribe((id: string) => {
        if (id) {
          this.router.navigateByUrl('cursos/'+this.idcurso+'/'+id);
        }
    });
    }else{
      this.temaService.update(this.tema,this.idcurso,this.position.value).subscribe((value: boolean) => {
        if (value) {
          this.router.navigateByUrl('cursos/'+this.idcurso);
        }
    });
    }  
  
}
editSubtema(id: string): void {
  this.router.navigateByUrl('cursos/'+ this.idcurso+'/'+ this.id+'/'+id) ;
}

deleteSubtema(id: string): void {
  if(this.id){
    this.temaService.delete(this.idcurso,this.id,id).subscribe((value: boolean) => {
      if (value) {
        if(this.id){
          this.temaService.getTema(this.id,this.idcurso).subscribe((tema => {
            this.tema=tema;
          }));
        }
      }
    });
  }
}
navigationTo(route: string): void{
  this.router.navigateByUrl('cursos/'+this.idcurso+'/'+this.id+'/'+route);
}
goBack(): void{
  this.router.navigateByUrl('cursos/'+this.idcurso)
}
}
