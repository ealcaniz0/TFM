import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Header } from '../Models/header.dto';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerManagement: BehaviorSubject<Header> =
    new BehaviorSubject<Header>({
      authSection: false,
      noAuthSection: true
    });

    constructor(private localStorageService: LocalStorageService) {
      const user = this.localStorageService.get('user');
      if (user){
        const headerInfo: Header = {
          authSection: true,
          noAuthSection: false,
        };
        this.headerManagement.next(headerInfo);
      }else{
        const headerInfo: Header = {
          authSection: false,
          noAuthSection: true,
        };
        this.headerManagement.next(headerInfo);
      }
    }
    
}
