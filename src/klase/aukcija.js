import {Artikal} from './artikal.js';
import {Korisnik} from './korisnik';
import {AukcijaService} from './aukcijaservice.js';
import { forkJoin,publish, range, interval, Observable, from, of, Subject, fromEvent, timer} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll, create, concatMap, zip} from "rxjs/operators";
import * as Rxjs from "rxjs";
import {from as fromPromise} from "rxjs";
export class Aukcija{
    constructor(){
        this.listaArtikala=null;
        this.container=null;
    }
    dodajArtikal(a){this.listaArtikala=a;}
    crtajArtikle(host){
        const divzacrtanje=document.createElement("div");
        divzacrtanje.className="divzacrtanje";
        host.appendChild(divzacrtanje);
        this.listaArtikala.forEach(a=>this.crtajArtikal(divzacrtanje,a));
    }
    crtajArtikal(divzacrtanje,a){
        const divzaartikal=document.createElement("div");
        divzaartikal.className="divzaartikal";
        divzacrtanje.appendChild(divzaartikal);
        let naziv=document.createElement("label");
        naziv.className="naziv";
        naziv.innerHTML=a.naziv;
        divzaartikal.appendChild(naziv);
        const slika=document.createElement("img");
        slika.className="slika";
        slika.src="./slike/"+a.naziv+".jpg";
        divzaartikal.appendChild(slika);
        const dugme=document.createElement("button");
        dugme.innerHTML="Licitiraj";
        dugme.className=a.id;
        dugme.value=a.id;
        dugme.classList="btn btn-default btn-secondary btn-sm";
        divzaartikal.appendChild(dugme);
        const selekt=document.getElementById("selekt");
        const opcija=document.createElement("option");
        opcija.innerHTML=a.naziv;
        opcija.value=a.id;
        selekt.appendChild(opcija);
        const ob=(ev)=>{
            const divpredmeta=document.getElementById("predmeti");
            divpredmeta.className="divpredmeta";
            divpredmeta.hidden=true;
            const sekcijaaukcija=document.getElementById("predmet");
            const formazalicitaciju=document.createElement("div");
            formazalicitaciju.id="formazalicitaciju";
            const obavestenja=document.createElement("div");
            obavestenja.className="obavestenja";
            sekcijaaukcija.appendChild(formazalicitaciju);
            const deozaslikuiopis=document.createElement("div");
            console.log(ev.target.value);
            deozaslikuiopis.className="deozaslikuiopis";
            formazalicitaciju.appendChild(deozaslikuiopis);
            const id=ev.target.value;
            const predmet=this.listaArtikala[id-1];
            console.log(predmet);
            const opis=document.createElement("h5");
            opis.innerHTML=predmet.opis;
            deozaslikuiopis.appendChild(opis);
            const slikapredmeta=document.createElement("img");
            slikapredmeta.src="./slike/"+predmet.naziv+".jpg";
            slikapredmeta.className = "slikapredmeta";
            deozaslikuiopis.appendChild(slikapredmeta);
            const deozalicitaciju=document.createElement("div");
            deozalicitaciju.className="deozalicitaciju";
            formazalicitaciju.appendChild(deozalicitaciju);
            const unos=document.createElement("input");
            unos.type="number";
            deozalicitaciju.appendChild(unos);
            const dugmelic=document.createElement("button");
            dugmelic.classList="btn-default btn-warning";
            dugmelic.className="dugmelicitiraj";
            dugmelic.value=predmet.id;
            dugmelic.innerHTML="Licitiraj";
            deozalicitaciju.appendChild(dugmelic);
            const nazad=document.createElement("button");
            nazad.className="Nazad";
            nazad.innerHTML="Nazad na predmete";
            deozalicitaciju.appendChild(nazad);
            const trenutniKupac=document.createElement("label");
            trenutniKupac.innerHTML="";
            obavestenja.appendChild(trenutniKupac);
            const trenutnaCena=document.createElement("label");
            obavestenja.appendChild(trenutnaCena);
            deozalicitaciju.appendChild(obavestenja);
            const sub$=new Subject();
            ev.value=dugmelic.value;
            const obs1=fromEvent(dugmelic,'click').pipe(
                map(ev=>ev.target.value),
                switchMap(ev=>fromPromise(
                     fetch("http://localhost:3000/artikli/"+ev)
                        .then(response=>response.json())
                    )),
                filter(f=>f.cena<parseInt(unos.value)),
                switchMap(ev=>fromPromise(
                    fetch("http://localhost:3000/korisnici")
                       .then(response=>response.json())
                )),
                concatMap(ev=>ev),
                filter(ev=>encodeURIComponent(window.location.href).indexOf(ev.korisnickoIme)!=-1),
                filter(ev=>ev.prijavljen===true)
            ).subscribe(x=>{fromPromise(fetch("http://localhost:3000/artikli/"+dugmelic.value)
            .then(resolve=>resolve.json())).subscribe(a=>{AukcijaService.azuriranjeCeneIKupca(a.id,a.naziv,a.opis,unos.value,x.ime);alert("Licitacija uspesna. Trenutna cena "+unos.value);})});
            fromEvent(nazad,'click').subscribe(ev=>{sub$.next(),divpredmeta.hidden=false,formazalicitaciju.hidden=true,obs1.unsubscribe()});
            setTimeout(()=>{
                obs1.unsubscribe();
            },20000);
            const time=timer(20000).pipe(
                takeUntil(sub$)
            )
            time.subscribe(ev=>alert("Kraj Licitacije!"));
            const inter=interval(500).pipe(
                takeUntil(sub$)
            )
            inter.subscribe(x=>{fromPromise(fetch("http://localhost:3000/artikli/"+id).then(resolve=>resolve.json())).subscribe(a=>{trenutnaCena.innerHTML="Trenutna cena:"+a.cena,trenutniKupac.innerHTML="Kupac:"+a.kupac;})});
        }
        fromEvent(dugme,'click').subscribe(ob);
    }
}

