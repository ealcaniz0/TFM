import { Component } from '@angular/core';
import { Categories } from 'src/app/Models/categories.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public categories: Categories[];

  constructor(private router: Router){
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
  }

  navigationTo(route: string): void{
    this.router.navigateByUrl(route);
  }
}
