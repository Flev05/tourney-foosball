import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Car } from '../../components/domain/car';
import { CarService } from '../../service/carservice';

@Component({
    templateUrl: './tornei-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class TorneiDetailView implements OnInit {

    selectedCar: Car;
    cars: Car[];
    newCar: boolean;

    constructor(
        private route: ActivatedRoute,
        private carService: CarService,
        private location: Location
    ) {}

    ngOnInit() {
        this.getCar();
    }

    getCar(): void {
        this.carService.getCarsSmall().then(cars => this.cars = cars);
        const vin = this.route.snapshot.paramMap.get('vin');

        console.log("Vin=" + vin);

        this.selectedCar = this.cars.find( car => car.vin == vin);

        console.log("SelectedCar=" + this.selectedCar);
      }

    save() {
        console.log("Saving car: " + this.selectedCar);
    }

    delete() {
        console.log("Deleting car: " + this.selectedCar);
    }

    goBack(): void {
        this.location.back();
    }
}
