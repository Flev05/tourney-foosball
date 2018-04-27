import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Car } from '../../components/domain/car';
import { CarService } from '../../service/carservice';

@Component({
    templateUrl: './tornei-listview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class TorneiListView implements OnInit {

    displayDialog: boolean;

    car: Car = {};

    selectedCar: Car;

    newCar: boolean;

    cars: Car[];

    cols: any[];

    constructor(private carService: CarService, public router: Router) { }

    ngOnInit() {
        this.carService.getCarsSmall().then(cars => this.cars = cars);

        this.cols = [
            { field: 'vin', header: 'TorneoId' },
            { field: 'year', header: 'Anno' },
            { field: 'brand', header: 'Marchio' },
            { field: 'color', header: 'Colore' }
        ];
    }

    showDialogToAdd() {
        this.newCar = true;
        this.car = {};
        this.displayDialog = true;
    }

    save() {
        let cars = [...this.cars];
        if (this.newCar)
            cars.push(this.car);
        else
            cars[this.cars.indexOf(this.selectedCar)] = this.car;

        this.cars = cars;
        this.car = null;
        this.displayDialog = false;
    }

    delete() {
        let index = this.cars.indexOf(this.selectedCar);
        this.cars = this.cars.filter((val, i) => i != index);
        this.car = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        console.log(event.data);

        const vin = event.data.vin;

        let redirect = '/configuration/dv/' + vin ;
        this.router.navigate([redirect]);

        // this.newCar = false;
        // this.car = this.cloneCar(event.data);
        // this.displayDialog = true;
    }
  
    cloneCar(c: Car): Car {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}