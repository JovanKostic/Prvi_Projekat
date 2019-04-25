import {AukcijaService} from './klase/aukcijaservice.js';
import {Aukcija} from './klase/aukcija.js';
import {Korisnik} from './/klase/korisnik.js';
import { range, interval, Observable, from, of, Subject, fromEvent} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll, concatMap} from "rxjs/operators";
import * as Rxjs from "rxjs";
import {from as fromPromise} from "rxjs";
import { create } from 'domain';
const aukcija=new Aukcija();
AukcijaService.dobavljanjeArtikalaIzBaze().then(artikal=>{
  aukcija.dodajArtikal(artikal.data);
  const auk_sek=document.getElementById("predmeti");
  aukcija.crtajArtikle(auk_sek);
})
const regModal=document.getElementById("regModal");
fromEvent(document.getElementById("registracija"),'click').pipe(
  filter(ev=>regModal.querySelector("input[name='ime']").value!=""),
  filter(ev=>regModal.querySelector("input[name='prezime']").value!=""),
  filter(ev=>regModal.querySelector("input[name='brojlicnekarte']").value!=""),
  filter(ev=>regModal.querySelector("input[name='korisnickoimeregistracija']").value!=""),
  filter(ev=>regModal.querySelector("input[name='lozinkaregistracija']").value!=""),
  map(ev=>new Korisnik(regModal.querySelector("input[name='ime']").value,regModal.querySelector("input[name='prezime']").value,
  regModal.querySelector("input[name='brojlicnekarte']").value,regModal.querySelector("input[name='korisnickoimeregistracija']").value,
  regModal.querySelector("input[name='lozinkaregistracija']").value))
).subscribe(ev=>{AukcijaService.dodavanjeKorisnikaUBazu(ev),alert("Registrovani ste!"),window.location.href="index.html"});
fromEvent(document.getElementById("odjava"),'click').pipe(
  switchMap(ev=>fromPromise(promise)),
  concatMap(ev=>ev),
  filter(ev=>ev.prijavljen===true),
  filter(ev=>ev.korisnickoIme.search(window.location.href))
).subscribe(x=>{x.prijavljen=false;AukcijaService.azuriranjeKorisnika(x);window.location.href="index.html"})
const promise=new Promise((resolve,reject)=>{resolve(AukcijaService.dobavljanjeKorisnikaIzBaze().then(value=>value.data))});
fromEvent(document.getElementById("prijavljivanje"),'click').pipe(
  switchMap(ev=>fromPromise(promise)),
  concatMap(ev=>ev),
  filter(ev=>ev.korisnickoIme===loginModal.querySelector("input[name='korisnickoime']").value),
  filter(ev=>ev.lozinka===loginModal.querySelector("input[name='lozinka']").value)
).subscribe(x=>{x.prijavljen=true;AukcijaService.azuriranjeKorisnika(x);window.location.href="index.html?="+x.korisnickoIme,alert("Prijavljeni ste!")});
/************Provera input polja****************/
const loginModal=document.getElementById("loginModal");
fromEvent(document.querySelector("input[name='lozinka']"),'input').pipe(
  map(ev=>ev.target.value)
).subscribe(x=>(x=="")?document.querySelector("input[name='lozinka']").classList="form-control validate alert-danger":console.log("neispravna sifra"));
fromEvent(document.querySelector("input[name='lozinka']"),'input').pipe(
  map(ev=>ev.target.value)
).subscribe(x=>(x!="")?document.querySelector("input[name='lozinka']").classList="form-control validate":console.log("ispravna sifra"));
fromEvent(document.querySelector("input[name='korisnickoime']"),'input').pipe(
  map(ev=>ev.target.value),
  filter(ev=>ev!=null),
  switchMap(ev=>fromPromise(
    fetch("http://localhost:3000/korisnici")
       .then(response=>response.json())
   )),
  concatMap(ev=>ev),
).subscribe(x=>(x.korisnickoIme!=loginModal.querySelector("input[name='korisnickoime']").value)?document.querySelector("input[name='korisnickoime']").classList="form-control validate alert-danger":console.log(""));
fromEvent(document.querySelector("input[name='korisnickoime']"),'input').pipe(
  map(ev=>ev.target.value),
  filter(ev=>ev!=null),
  switchMap(ev=>fromPromise(
    fetch("http://localhost:3000/korisnici")
       .then(response=>response.json())
   )),
  concatMap(ev=>ev)
).subscribe(x=>(x.korisnickoIme===loginModal.querySelector("input[name='korisnickoime']").value)?document.querySelector("input[name='korisnickoime']").classList="form-control validate alert-success":console.log(""));
/************Kraj provere input polja****************/ 
/*************Kontakt forma***************/
const kontakt=document.getElementById("sekcija_kontakt");
const selekt=document.querySelector("select");
fromEvent(document.getElementById("posalji"),'click').pipe(
  filter(ev=>document.getElementById("ziroracun").value!=""),
  filter(ev=>document.getElementById("adresaisporuke").value!=""),
  switchMap(ev=>fromPromise(
    fetch("http://localhost:3000/korisnici")
       .then(response=>response.json())
   )),
  concatMap(ev=>ev),
  filter(ev=>ev.ime===document.getElementById("ime").value),
  filter(ev=>ev.prezime===document.getElementById("prezime").value),
  filter(ev=>ev.brojLicneKarte===document.getElementById("brojlicnekarte").value),
  filter(ev=>parseInt(ev.predmet)==document.querySelector("select").options[selekt.selectedIndex].value)
).subscribe(ev=>{AukcijaService.dodavanjePoslatihPredmeta(document.getElementById("ime").value,document.getElementById("prezime").value,
document.getElementById("brojlicnekarte").value,document.getElementById("ziroracun").value,document.getElementById("adresaisporuke").value,
selekt.options[selekt.selectedIndex].innerHTML),alert("Uspesno ste narucili izlicitirani predmet!")});
/************Kraj kontakt forme**********/