import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { dataType } from '../datacomponent/interface'; 

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiurl = environment.APIEndpoint;

  constructor(private http: HttpClient) { }

  getData() :  Observable<dataType[]>{
    return this.http.get<dataType[]>(this.apiurl).pipe(
      catchError(this.handleError));
  }


  handleError(err:any){

    let errorMessage = '';
    if(err.error instanceof ErrorEvent){
      errorMessage = `Error Message: ${err.error.message}`;
    }else{
      errorMessage = `Error Message: ${err.message}`;
    }

    console.log(errorMessage);

    return throwError(()=>{
      return errorMessage;
    })
  }

}
