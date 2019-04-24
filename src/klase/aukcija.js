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
        this.trenutnoVreme=null;
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
            sekcijaaukcija.appendChild(obavestenja);
            const unos=document.createElement("input");
            unos.type="number";
            deozalicitaciju.appendChild(unos);
            const dugmelic=document.createElement("button");
            dugmelic.classList="btn-default btn-warning";
            dugmelic.className="dugmelicitiraj";
            dugmelic.value=predmet.id;
            dugmelic.innerHTML="Licitiraj";
            deozalicitaciju.appendChild(dugmelic);
            const dugmeodustani=document.createElement("button");
            dugmeodustani.className="dugmeodustani";
            dugmeodustani.innerHTML="Odustani od licitacije";
            deozalicitaciju.appendChild(dugmeodustani);
            const labelaIme=document.createElement("label");
            labelaIme.innerHTML="";
            obavestenja.appendChild(labelaIme);
            const labelaCena=document.createElement("label");
            labelaCena.innerHTML="";
            const trenutnaCena=document.createElement("label");
            obavestenja.appendChild(trenutnaCena);
            obavestenja.appendChild(labelaCena);
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
            .then(resolve=>resolve.json())).subscribe(a=>AukcijaService.azuriranjeCene(a.id,a.naziv,a.opis,unos.value)),
            alert("Licitacija uspesna. Trenutna cena "+unos.value)},x=>{alert("Neuspesna licitacija. Trenutna vrednost predmeta ")});
            fromEvent(dugmeodustani,'click').subscribe(ev=>{sub$.next(),divpredmeta.hidden=false,formazalicitaciju.hidden=true,obs1.unsubscribe()});
            setTimeout(()=>{
                obs1.unsubscribe();
            },200000);
            const time=timer(200000).pipe(
                takeUntil(sub$)
            )
            time.subscribe(ev=>alert("Kraj Licitacije"));
            const inter=interval(2000).pipe(
                takeUntil(sub$)
            )
            inter.subscribe(x=>{fromPromise(fetch("http://localhost:3000/artikli/"+id).then(resolve=>resolve.json())).subscribe(a=>trenutnaCena.innerHTML="Trenutna cena:     "+a.cena,console.log(a.cena))});
        }
        fromEvent(dugme,'click').subscribe(ob);
    }
}


