import {AukcijaService} from './klase/aukcijaservice.js';
import {Aukcija} from './klase/aukcija.js';
import { range, interval, Observable, from, of, Subject, fromEvent} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll} from "rxjs/operators";
import * as Rxjs from "rxjs";
import {from as fromPromise} from "rxjs";
const aukcija=new Aukcija();
/*AukcijaService.get().then(artikal=>{
  console.log(artikal);
    aukcija.dodajArtikal(artikal);
    const auk_sek=document.getElementById("predmeti");
    aukcija.crtajArtikle(auk_sek);
});*/
document.getElementById("postavi_predmet").onclick=(ev)=>{
  dodavanjePredmeta();
}
AukcijaService.dobavljanjeArtikalaIzBaze().then(artikal=>{
  console.log(artikal.data);
  aukcija.dodajArtikal(artikal.data);
  const auk_sek=document.getElementById("predmeti");
  aukcija.crtajArtikle(auk_sek);
})
AukcijaService.dobavljanjeKorisnikaIzBaze().then(korisnik=>{
  console.log(korisnik.data);
})
