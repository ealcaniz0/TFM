export class Subtema{
    id: string;
    title: string;
    texto: string;
    completado: boolean;
    img: string;
    constructor(id: string, title: string, texto: string, completado: boolean, img:string){
        this.id = id;
        this.title = title;
        this.texto = texto;
        this.completado=completado;
        this.img=img;
    }
}