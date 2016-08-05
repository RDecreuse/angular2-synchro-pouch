import {Component, OnInit} from '@angular/core';
import {Animal} from "../../shared/model/Animal";
import {AnimalService} from "../../services/animal.service";

declare var PouchDB: any;

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'page-synchro',
    providers: [AnimalService],
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.css']
})
export class AboutComponent implements OnInit {
    public animals: Animal[];


    constructor(private animalService: AnimalService) {
    }

    ngOnInit(): any {
        var observable = this.animalService.replicate(true);
        var subscription = observable.subscribe(
            (x: any) => {
                console.log('observable next: ' + x);
                this.displayResultAnimals();
            },
            (err: any) => {
                console.log('Error: ' + err);
            },
            () => {
                console.log('observable Completed');
                this.displayResultAnimals();
            });
    }

    private displayResultAnimals(): void {
        this.animals = this.animalService.getAnimals();
    }

}
