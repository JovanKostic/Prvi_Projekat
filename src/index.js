import {AukcijaService} from './klase/aukcijaservice.js';
import {Aukcija} from './klase/aukcija.js';
import {Korisnik} from './/klase/korisnik.js';
import { range, interval, Observable, from, of, Subject, fromEvent} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll, concatMap} from "rxjs/operators";
import * as Rx from "rxjs";
import {from as fromPromise} from "rxjs";
import { create } from 'domain';
const aukcija=new Aukcija();
AukcijaService.dobavljanjeArtikalaIzBaze().then(artikal=>{
  console.log(artikal.data);
  aukcija.dodajArtikal(artikal.data);
  const auk_sek=document.getElementById("predmeti");
  aukcija.crtajArtikle(auk_sek);
})
AukcijaService.dobavljanjeKorisnikaIzBaze().then(korisnik=>{
  console.log(korisnik.data);
})

let obs=()=>{
  const regModal=document.getElementById("regModal");
  const inpIme=regModal.querySelector("input[name='ime']").value;
  const inpPrezime=regModal.querySelector("input[name='prezime']").value;
  const inpBrojLicneKarte=regModal.querySelector("input[name='brojlicnekarte']").value;
  const inpKorisnickoIme=regModal.querySelector("input[name='korisnickoimeregistracija']").value;
  const inpLozinka=regModal.querySelector("input[name='lozinkaregistracija']").value;
  const k=new Korisnik(inpIme,inpPrezime,inpBrojLicneKarte,inpKorisnickoIme,inpLozinka);
  aukcija.dodajKorisnika(k);
  AukcijaService.dodavanjeKorisnikaUBazu(k);
  window.location.href="index.html";
}
fromEvent(document.getElementById("registracija"),'click').subscribe(obs);
fromEvent(document.getElementById("odjava"),'click').pipe(
  switchMap(ev=>fromPromise(promise)),
  concatMap(ev=>ev),
  filter(ev=>ev.prijavljen===true),
  filter(ev=>ev.korisnickoIme.search(window.location.href))
).subscribe(x=>{x.prijavljen=false;AukcijaService.azuriranjeKorisnika(x)})
const promise=new Promise((resolve,reject)=>{resolve(AukcijaService.dobavljanjeKorisnikaIzBaze().then(value=>value.data))});
fromEvent(document.getElementById("prijavljivanje"),'click').pipe(
  switchMap(ev=>fromPromise(promise)),
  concatMap(ev=>ev),
  filter(ev=>ev.korisnickoIme===loginModal.querySelector("input[name='korisnickoime']").value),
  filter(ev=>ev.lozinka===loginModal.querySelector("input[name='lozinka']").value)
).subscribe(x=>{x.prijavljen=true;alert("Prijavljeni ste!");console.log(x);AukcijaService.azuriranjeKorisnika(x);window.location.href="index.html#"+x.korisnickoIme;});
/************Provera input polja****************/
const loginModal=document.getElementById("loginModal");
fromEvent(document.querySelector("input[name='lozinka']"),'input').pipe(
  map(ev=>ev.target.value)
).subscribe(x=>(x=="")?document.querySelector("input[name='lozinka']").classList="form-control validate alert-danger":console.log("neispravna sifra"));
fromEvent(document.querySelector("input[name='lozinka']"),'input').pipe(
  map(ev=>ev.target.value)
).subscribe(x=>(x!="")?document.querySelector("input[name='lozinka']").classList="form-control validate":console.log("isprana sifra"));
fromEvent(document.querySelector("input[name='korisnickoime']"),'input').pipe(
  map(ev=>ev.target.value),
  filter(ev=>ev!=null),
  switchMap(ev=>fromPromise(
    fetch("http://localhost:3000/korisnici")
       .then(response=>response.json())
   )),
  concatMap(ev=>ev),
).subscribe(x=>(x.korisnickoIme!=loginModal.querySelector("input[name='korisnickoime']").value)?document.querySelector("input[name='korisnickoime']").classList="form-control validate alert-danger":console.log("neispravna"));
fromEvent(document.querySelector("input[name='korisnickoime']"),'input').pipe(
  map(ev=>ev.target.value),
  filter(ev=>ev!=null),
  switchMap(ev=>fromPromise(
    fetch("http://localhost:3000/korisnici")
       .then(response=>response.json())
   )),
  concatMap(ev=>ev)
).subscribe(x=>(x.korisnickoIme===loginModal.querySelector("input[name='korisnickoime']").value)?document.querySelector("input[name='korisnickoime']").classList="form-control validate alert-success":console.log("ispravna"));
/************Kraj provere input polja****************/ 
