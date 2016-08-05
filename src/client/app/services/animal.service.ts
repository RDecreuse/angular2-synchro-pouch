import {Injectable} from '@angular/core';
import {Animal} from "../shared/model/Animal";
import {Observable} from 'rxjs/Observable';

declare var PouchDB: any;

@Injectable()
export class AnimalService {

    private db: any;
    private pouchDatabaseName = 'mytestdb';

  constructor() {

  }

  replicate(live:boolean):Observable {

      this.db = new PouchDB(this.pouchDatabaseName);

      let source = new PouchDB('http://localhost:4984/r_animal');
      let options = {
          live: live,
          retry: true,

          source: "SyncGatewayUrl",
          target: "r_animal",
          filter: "sync_gateway/bychannel",
          query_params: {
              channels: "test"
          },
          back_off_function: function (delay:any) {
              if (delay === 0) {
                  return 1000;
              }
              let finalDelay:number = delay * 3;
              console.log('retry with delay=' + finalDelay);
              return finalDelay;
          }
      };


      let observable:Observable<any> = Observable.create((observer:any) => {
          PouchDB.replicate(source, this.db, options).on('change', (info: any) => {
              console.log("replication change event");
              // handle change
          }).on('paused', (err: any) => {
              console.log("replication paused event");
              observer.onNext();
              // replication paused (e.g. replication up to date, user went offline)
          }).on('active', () => {
              console.log("replication active event");
              // replicate resumed (e.g. new changes replicating, user went back online)
          }).on('denied', function (err: any) {
              console.log("replication denied event");
              // a document failed to replicate (e.g. due to permissions)
          }).on('complete', (info: any) => {
              console.log("replication complete event");
              observer.onCompleted();
              // handle complete
          }).on('error', (err: any) => {
              console.log("replication error event");
              // handle error
          });
      });
      return observable;
  }

    getAnimals() : Array<Animal> {
        let animals = new Array<Animal>();
        animals.push({'_id':'test'} as Animal);
        //WIP
        // let observable:Observable<any> = Observable.create((observer:any) => {
        //     let animals = new Array<Animal>();
        //
        //     let db = new PouchDB(this.pouchDatabaseName);
        //     db.allDocs().then((allDocs: any) => {
        //         animals = new Array<Animal>();
        //
        //         for (let row of allDocs.rows) {
        //             console.log('retrieving doc ' + row.id);
        //
        //             db.get(row.id).then((doc: any) => {
        //
        //                 console.log("document retrieved" + doc);
        //                 animals.push(doc as Animal);
        //             }).catch(function (err: any) {
        //
        //                 console.log("can\'t retrieve document " + row.id);
        //             });
        //         }
        //     });
        //
        // });
        return animals;
    }

}