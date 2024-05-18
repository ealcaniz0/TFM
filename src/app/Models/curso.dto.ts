import { Tema } from "./tema.dto";
export class Curso{
    id: string;
    title: string;
    descripcion: string;
    temas: Tema[];
    publication_date: Date;
    author: string;
    categoria: string;
    publicado: boolean;
    completado: boolean;
    constructor(id: string, title: string, publication_date: Date, author: string,descripcion: string, categoria: string,temas: Tema[],publicado: boolean,completado:boolean){
        this.id = id;
        this.title = title;
        this.publication_date= publication_date;
        this.author = author;
        this.descripcion = descripcion;
        this.categoria=categoria;
        this.temas=temas;
        this.publicado=publicado;
        this.completado=completado;
    }
}