import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder,UntypedFormControl,Validators } from '@angular/forms';
import { Categories } from 'src/app/Models/categories.dto';
import { Curso } from 'src/app/Models/curso.dto';
import { Router,ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/Services/course.service';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.scss']
})
export class CursoFormComponent implements OnInit {
  public categories: Categories[];
  courseForm: UntypedFormGroup;
  title: UntypedFormControl;
  description: UntypedFormControl;
  category: UntypedFormControl;
  publicado: UntypedFormControl;
  course: Curso;
  id: string | null;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private courseService: CourseService, private activatedRoute: ActivatedRoute,private _ngZone: NgZone){
    this.course =  new Curso('','',new Date(),'','','',[],false,false);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.categories =[
      {
        title: 'Política Internacional',
        description: "Analiza las relaciones entre países y los eventos geopolíticos.",
        url: 'https://images.pexels.com/photos/4008336/pexels-photo-4008336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Cocina y Recetas',
        description: "Descubre nuevas recetas y técnicas culinarias.",
        url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Desarrollo Personal',
        description: "Aprende sobre crecimiento personal y auto-mejora.",
        url: 'https://images.pexels.com/photos/4876922/pexels-photo-4876922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Cine y Películas',
        description: "Explora el mundo del cine y la producción audiovisual.",
        url: 'https://images.pexels.com/photos/275406/pexels-photo-275406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Tecnología y Gadgets',
        description: 'Mantente al día con las últimas tendencias tecnológicas.',
        url: 'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Historia Antigua',
        description: 'Sumérgete en los eventos y civilizaciones del pasado.',
        url: 'https://images.pexels.com/photos/460406/pexels-photo-460406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Deportes y Fitness',
        description: 'Información y consejos sobre deportes y ejercicio físico.',
        url: 'https://images.pexels.com/photos/4167788/pexels-photo-4167788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Viajes y Aventuras',
        description: 'Inspírate para explorar nuevos destinos y culturas.',
        url: 'https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Misterios y Paranormal',
        description: 'Explora lo inexplicable y lo sobrenatural.',
        url: 'https://images.pexels.com/photos/1587803/pexels-photo-1587803.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      },
      {
        title: 'Animales Salvajes',
        description: 'Fotografías de animales en su entorno natural.',
        url: 'https://images.pexels.com/photos/2920121/pexels-photo-2920121.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=200'
      }      
    ]
    this.title = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);
    this.description = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(25),
      Validators.maxLength(500),
    ]);
    this.category =  new UntypedFormControl('',[
      Validators.required
    ]);
    this.publicado =  new UntypedFormControl(false)
    this.courseForm = this.formBuilder.group({
      title:this.title,
      description:this.description,
      category: this.category
    });

  }
  /*triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }*/
  ngOnInit(): void{
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.courseService.getCourse(this.id).subscribe((curso => {
        this.course=curso;
        this.title.setValue(curso.title);
        this.category.setValue(curso.categoria);
        this.description.setValue(curso.descripcion);
        this.publicado.setValue(curso.publicado);
      }));
    }
  }

  save(): void{
    if (this.courseForm.invalid) {
      return;
    }  
    this.course.title= this.title.value;
    this.course.descripcion= this.description.value;
    this.course.categoria= this.category.value;
    this.course.publicado= this.publicado.value;
    if (this.id==null){
      this.courseService.create(this.course).subscribe((id: string) => {
        if (id) {
          this.router.navigateByUrl('cursos/'+ id) ;
        }
      });
    }else{
      this.courseService.update(this.course).subscribe((value: boolean) => {
        if (value) {
          this.router.navigateByUrl('profile');
        }
      });
    }    
}

editTema(id: string): void {
  this.router.navigateByUrl('cursos/'+ this.id+'/'+id) ;
}
deleteTema(id: string): void {
  if(this.id){
    this.courseService.delete(this.id,id).subscribe((value: boolean) => {
      if (value) {
        if(this.id){
          this.courseService.getCourse(this.id).subscribe((curso => {
            this.course=curso;
          }));
        }
      }
    });
  }
}

navigationTo(route: string): void{
  this.router.navigateByUrl('cursos/'+this.id+'/'+route);
}
goBack(): void{
  this.router.navigateByUrl('profile') ;
}
}
