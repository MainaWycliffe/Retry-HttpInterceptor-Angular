import { Injectable } from "@angular/core";
import { RequestOptions, Http, Headers, Response, RequestMethod, URLSearchParams } from "@angular/http";
import { Observable, Observer } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import "rxjs/add/operator/mergeMap";

@Injectable()
export class InterceptedHttp {

    constructor(private http: Http) { }

    getRequestOption(method: RequestMethod | string, data?: any, params?: any): RequestOptions {
        let options = new RequestOptions();
        options.headers = new Headers();
        //options.headers.append('Content-Type', 'application/json');
        options.method = method;

        let token: string = localStorage.getItem('token');
        //if (token) options.headers.append('Authorization', 'Bearer ' + token);

        if (data) options.body = data;

        if (params) {
            options.search = new URLSearchParams();
            let keys: string[] = Object.keys(params);

            keys.forEach((key, index) => {
                options.search.set(key, params[key]);
            });
        }

        return options;
    }

    refreshSessionToken(): Observable<string> {
        //Put some user identification data
        let userData: any = { id: 'abc' };
        return this.http.post('/refreshToken', userData)
            .map(res => {
                let token = res.json();
                localStorage.setItem('token', token);
                return token;
            });
    }

    getApiResponse<T>(url: string, method: RequestMethod | string, data?: Object): Observable<T> {
        let op1: RequestOptions = this.getRequestOption(method, data);
        return this.http.request(url, op1)
            .catch((err) => {
                // UnAuthorised, 401
                if (err.status == 401) {
                    return this.refreshSessionToken().flatMap(t => {
                        let op2 = this.getRequestOption(method, data);
                        return this.http.request(url, op2);
                    });
                }
                throw err;
            })
            .map((response: Response) => {
                let ret: T = response.json();
                return ret;
            });
    }

    get<T>(url: string): Observable<T> {
        return this.getApiResponse<T>(url, RequestMethod.Get);
    }

    post<T, R>(url: string, body: T): Observable<R> {
        return this.getApiResponse<R>(url, RequestMethod.Post, body);
    }

    put<T, R>(url: string, body: T): Observable<R> {
        return this.getApiResponse<R>(url, RequestMethod.Put, body);
    }

    delete<T>(url: string): Observable<T> {
        return this.getApiResponse<T>(url, RequestMethod.Delete);
    }
}