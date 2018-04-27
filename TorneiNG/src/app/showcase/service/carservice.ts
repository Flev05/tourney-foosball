import 'rxjs/add/operator/toPromise';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Car } from '../domain/car';

@Injectable()
export class CarService {

    car : Car;

    constructor(private http: HttpClient) { }

    getCarSmall(vin: string): Observable<Car> {
      // TODO: send the message _after_ fetching the hero
      // this.messageService.add(`HeroService: fetched hero id=${id}`);

      this.http.get<any>('assets/showcase/data/cars-small.json')
        .toPromise().then(res => <Car[]>res.data.find(c => c.vin === vin).then(d => this.car=d));

      return of(this.car);
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
