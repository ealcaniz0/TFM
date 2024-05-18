import { Component,OnInit,ViewChild } from '@angular/core';
import { Curso } from 'src/app/Models/curso.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Models/user.dto';
import { UserService } from 'src/app/Services/user.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-cursos-list',
  templateUrl: './cursos-list.component.html',
  styleUrls: ['./cursos-list.component.scss']
})
export class CursosListComponent implements OnInit  {
    cursos: Curso[]=[];
    id: string | null;
    user: User;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource = new MatTableDataSource<any>(this.cursos);

    constructor(private localStorageService: LocalStorageService, private activatedRoute: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {
      this.user =  new User('','','',new Date(),'','',[]);
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      this.cursos = (JSON.parse(localStorageService.get("cursos")||'[]') || []).filter((element: Curso) => element.publicado==true);
      if (this.id) {
        this.cursos = this.cursos.filter((element: Curso) => element.categoria==this.id);
      }
    }
    ngOnInit(): void{
      if(this.localStorageService.get('user')){
        this.userService.getUser(JSON.parse(this.localStorageService.get('user')||'')).subscribe(user => {
          this.user=user;
        });
      }
      this.dataSource.data = this.cursos; 
      this.dataSource.sort = this.sort;
    }
    sortData(event: any) {
      const sortColumn = event.active;
      const sortDirection = event.direction;
      this.dataSource.data = this.cursos.sort((a, b) => {
        const isAsc = sortDirection === 'asc';
        switch (sortColumn) {
          case 'titulo': return this.compare(a.title, b.title, isAsc);
          case 'categoria': return this.compare(a.categoria, b.categoria, isAsc);
          case 'autor': return this.compare(a.author, b.author, isAsc);
          case 'descripcion': return this.compare(a.descripcion, b.descripcion, isAsc);
          default: return 0;
        }
      });
    }
    compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    suscribe(curso: Curso): void{
      const user = JSON.parse(this.localStorageService.get('user') || '');
      if (user){
        this.userService.suscribeCourse(user,curso).subscribe((value: boolean) =>{
          if(!value){
            this.openDialog();
          }
        });
      }
    }
    openDialog() {
      this.dialog.open(DialogComponent,{data: {title: 'PVA', message: 'Ya estas sucrito a este curso'}});
    }
}
