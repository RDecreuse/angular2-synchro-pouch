import {Component, OnInit} from '@angular/core';
import {Animal} from "../shared/model/Animal";

declare var PouchDB: any;

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent implements OnInit {
  private db: any;
  public animals: Animal[];


  private pouchDatabaseName = 'mytestdb';

  ngOnInit(): any {

    console.log("test");
    this.db = new PouchDB(this.pouchDatabaseName);
    let source = new PouchDB('http://localhost:4984/r_animal');
    let options = {
      live: true,
      retry: true,

      source: "SyncGatewayUrl",
      target: "r_animal",
      filter: "sync_gateway/bychannel",
      query_params: {
        channels: "test"
      },
      back_off_function: function (delay) {
        if (delay === 0) {
          return 1000;
        }
        let finalDelay:number = delay * 3;
        console.log('retry with delay=' + finalDelay);
        return finalDelay;
      }
    };


    PouchDB.replicate(source, this.db, options).on('change', (info: any) => {
      console.log("replication change event");
      // handle change
    }).on('paused', (err: any) => {
      console.log("replication paused event");
      this.displayResult();
      // replication paused (e.g. replication up to date, user went offline)
    }).on('active', () => {
      console.log("replication active event");
      // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err: any) {
      console.log("replication denied event");
      // a document failed to replicate (e.g. due to permissions)
    }).on('complete', (info: any) => {
      console.log("replication complete event");
      this.displayResult();
      // handle complete
    }).on('error', (err: any) => {
      console.log("replication error event");
      // handle error
    });
  }

  private displayResult() {

    let db = new PouchDB(this.pouchDatabaseName);
    db.allDocs().then((allDocs: any) => {
      this.animals = new Array<Animal>();

      for (let row of allDocs.rows) {
        console.log('retrieving doc ' + row.id);

        db.get(row.id).then((doc: any) => {

          console.log("document retrieved" + doc);
          this.animals.push(doc as Animal);
        }).catch(function (err: any) {

          console.log("can\'t retrieve document " + row.id);
        });
      }
    });
  }


}
