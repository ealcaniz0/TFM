import { Component, OnInit } from '@angular/core';
import { Header } from 'src/app/Models/header.dto';
import { HeaderService } from 'src/app/Services/header.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authSection: boolean;
  noAuthSection: boolean;
  constructor(
    private headerService: HeaderService,
    private userService: UserService,
    private router: Router
  ) {
    this.authSection = false;
    this.noAuthSection = true;
  }
  ngOnInit(): void {
    this.authSection = false;
    this.noAuthSection = true;
    this.headerService.headerManagement.subscribe(
      (headerInfo: Header) => {
        if (headerInfo) {
          this.authSection = headerInfo.authSection;
          this.noAuthSection = headerInfo.noAuthSection;
        }
      }
    );
  }

  navigationTo(route: string): void{
    this.router.navigateByUrl(route);
  }

  logout(): void{
    this.userService.logout();
    const headerInfo: Header = {
      authSection: false,
      noAuthSection: true,
    };
    this.headerService.headerManagement.next(headerInfo);
    this.navigationTo('home');
  }
}
