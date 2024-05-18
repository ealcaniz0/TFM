import { Curso } from "./curso.dto";

export class User{
    //user_id?: string;
    profile: string;
    name: string;
    surname: string;
    birth_date: Date;
    email: string;
    password: string;
    cursos: Curso[];
    constructor(profile:string, name: string, surname: string, birth_date: Date, email: string, password: string,cursos: Curso[]){
        this.profile=profile;
        this.name=name;
        this.surname=surname;
        this.birth_date = birth_date;
        this.email=email;
        this.password=password;
        this.cursos=cursos;
    }
}