import {AukcijaService} from './klase/aukcijaservice.js';
import {Aukcija} from './klase/aukcija.js';
import { range, interval, Observable, from, of, Subject, fromEvent} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll} from "rxjs/operators";
import * as Rxjs from "rxjs";
import {from as fromPromise} from "rxjs";
const aukcija=new Aukcija();
AukcijaService.get().then(artikal=>{
    aukcija.dodajArtikal(artikal);
    const auk_sek=document.getElementById("predmeti");
    aukcija.crtajArtikle(auk_sek);
});
document.getElementById("postavi_predmet").onclick=(ev)=>{
  dodavanjePredmeta();
}
const ob=fromEvent(document.getElementById("registracija"),'click');
ob.subscribe(ev=>console.log("reg"));    
  