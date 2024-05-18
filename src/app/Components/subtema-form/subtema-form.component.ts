import { Component, NgZone, OnInit, ViewChild  } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder,UntypedFormControl,Validators } from '@angular/forms';
import { Subtema } from 'src/app/Models/subtema.dto';
import { Router,ActivatedRoute } from '@angular/router';
import { SubtemaService } from 'src/app/Services/subtema.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { CourseService } from 'src/app/Services/course.service';
@Component({
  selector: 'app-subtema-form',
  templateUrl: './subtema-form.component.html',
  styleUrls: ['./subtema-form.component.scss']
})
export class SubtemaFormComponent implements OnInit{
  subtemaForm: UntypedFormGroup;
  title: UntypedFormControl;
  position: UntypedFormControl;
  img: UntypedFormControl;
  text: UntypedFormControl;
  subtema: Subtema;
  idcurso: string;
  idtema: string;
  id: string | null;
  posiciones: number[];
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: UntypedFormBuilder, private router: Router, private subtemaService: SubtemaService,private _ngZone: NgZone, private courseService: CourseService) {
    this.subtema = new Subtema('','','',false,'');
    this.idcurso = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.idtema = this.activatedRoute.snapshot.paramMap.get('id2') || '';
    this.id = this.activatedRoute.snapshot.paramMap.get('id3');
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
    this.subtemaForm = this.formBuilder.group({
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
      
      for(var index in curso.temas.find(tema => tema.id == this.idtema)?.subtemas){
        this.posiciones.push(+index+1);
      }
      if (this.id) {
        let tema =curso.temas.find(tema => tema.id == this.idtema);
        if (tema){
          this.position.setValue(tema.subtemas.map(subtema => subtema.id).indexOf(this.id)+1);
        }
      }else{
        this.posiciones.push(this.posiciones[this.posiciones.length-1]+1);
        this.position.setValue(this.posiciones[this.posiciones.length-1]);
        this.subtemaForm.controls['position'].disable();
      }
    })); 

    if (this.id) {
      this.subtemaService.getSubtema(this.id,this.idtema,this.idcurso).subscribe((item => {
        this.subtema=item;
        this.title.setValue(item.title);
        this.img.setValue(item.img);
        this.text.setValue(item.texto);
      }))
    }
  }
  save(): void{
    if (this.subtemaForm.invalid || this.idcurso=='' || this.idtema==''){
      return;
    }   
    this.subtema.title= this.title.value;
    this.subtema.img= this.img.value;
    this.subtema.texto= this.text.value;
    if (this.id==null){
      this.subtemaService.create(this.subtema,this.idtema,this.idcurso).subscribe((id: string) => {
        if (id) {
          this.router.navigateByUrl('cursos/'+this.idcurso+'/'+this.idtema);
        }
    });
    }else{
      this.subtemaService.update(this.subtema,this.idtema,this.idcurso,this.position.value).subscribe((value: boolean) => {
        if (value) {
          this.router.navigateByUrl('cursos/'+this.idcurso+'/'+this.idtema);
        }
    });
    }  
  }
  goBack(): void{
    this.router.navigateByUrl('cursos/'+this.idcurso+'/'+this.idtema);
  }
}
