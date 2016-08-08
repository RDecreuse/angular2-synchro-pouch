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
        observable.subscribe(
            () => {
                console.log('observable next, replication on pause');
                this.displayResultAnimals();
            },
            (err: any) => {
                console.log('Error: ' + err);
            },
            () => {
                console.log('observable Completed, replication done');
                this.displayResultAnimals();
            });
    }

    private displayResultAnimals(): void {
        this.animals = new Array<Animal>();
        this.animalService.getAnimals().subscribe((animal: Animal) => {
                console.log('observable next, animal=' + animal);
                this.animals.push(animal);
            },
            (err: any) => {
                console.log('Error: ' + err);
            });
    }

}
