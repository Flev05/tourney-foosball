import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Car } from '../domain/car';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  
@Injectable()
export class CarService {
    private torenoUrl = 'api/tornei';  // URL to web api

    selectedCar : Car;

    cars: Car[];

    newCar : boolean = false;

    firstTime : boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of CarService");
    }

    loadCarSmall (): Observable<Car[]> {
        return this.http.get<Car[]>(this.torenoUrl)
        .pipe(
            tap(_ => this.log(`fetched all cars`)),
            catchError(this.handleError('loadCarsSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getCar(id: number): Observable<Car> {
        const url = `${this.torenoUrl}/${id}`;
        return this.http.get<Car>(url).pipe(
            tap(_ => this.log(`fetched Car id=${id}`)),
            catchError(this.handleError<Car>(`getCar id=${id}`))
        );
    }

    /** POST: add a new car to the server */
    addCar (car: Car): Observable<Car> {
        return this.http.post<Car>(this.torenoUrl, car, httpOptions).pipe(
            tap((car: Car) => this.log(`added Car w/ id=${car.vin}`)),
            catchError(this.handleError<Car>('addCar'))
        );
    }

    /** PUT: update the car on the server */
    updateCar (car: Car): Observable<Car> {
        const id =  car.vin;
        const url = `${this.torenoUrl}/${id}`;

        return this.http.put(url, car, httpOptions).pipe(
            tap(_ => this.log(`updated Car id=${car.vin}`)),
            catchError(this.handleError<Car>('updateCar'))
        );
    }
    
    /** DELETE: delete the car from the server */
    deleteCar (car: Car | number): Observable<Car> {
        const id = typeof car === 'number' ? car : car.vin;
        const url = `${this.torenoUrl}/${id}`;

        return this.http.delete<Car>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Car id=${id}`)),
            catchError(this.handleError<Car>('deleteCar'))
        );
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
      
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('HeroService: ' + message);
    }
    
    getCarsSmall() {
        return this.http.get<any>('assets/showcase/data/cars-small.json')
          .toPromise()
          .then(res => <Car[]>res.data)
          .then(data => { return data; });
      }
  
      getCarsMedium() {
        return this.http.get<any>('assets/showcase/data/cars-medium.json')
          .toPromise()
          .then(res => <Car[]>res.data)
          .then(data => { return data; });
      }
  
        getCarsLarge() {
      return this.http.get<any>('assets/showcase/data/cars-large.json')
        .toPromise()
        .then(res => <Car[]>res.data)
        .then(data => { return data; });
    }

    getCarsHuge() {
      return this.http.get<any>('assets/showcase/data/cars-huge.json')
        .toPromise()
        .then(res => <Car[]>res.data)
        .then(data => { return data; });
    }
}
