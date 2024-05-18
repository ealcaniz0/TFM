import { Subtema } from "./subtema.dto";

export class Tema{
    id: string;
    title: string;
    texto: string;
    subtemas: Subtema[];
    completado: boolean;
    img: string;
    constructor(id: string, title: string, texto: string,subtemas: Subtema[],completado:boolean,img: string){
        this.id = id;
        this.title = title;
        this.texto = texto;
        this.subtemas=subtemas;
        this.completado=completado;
        this.img=img;
    }
}