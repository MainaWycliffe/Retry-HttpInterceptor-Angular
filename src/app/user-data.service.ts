import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './User';
import { InterceptedHttp } from './http.interceptor';

@Injectable()
export class DataService {
    constructor(private apiHandler: InterceptedHttp) { }
    
    getAll(): Observable<User[]> {
        return this.apiHandler.get<User[]>('http://mocker.egen.io/users');
    }
}