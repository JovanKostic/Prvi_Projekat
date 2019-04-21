import {Artikal} from './artikal.js';
import {Korisnik} from './korisnik';
import {AukcijaService} from './aukcijaservice.js';
import { range, interval, Observable, from, of, Subject, fromEvent} from "rxjs";
import { filter, map, take, takeUntil, scan, debounceTime, switchMap, concatAll, create} from "rxjs/operators";
import * as Rxjs from "rxjs";
import {from as fromPromise} from "rxjs";
import { fileURLToPath } from 'url';
export class Aukcija{
    constructor(){
        this.listaKorisnika=[];
        this.listaArtikala=null;
        this.listaPrijavljenihKorisnika=[];
        this.container=null;
    }
    dodajKorisnika(k){this.listaKorisnika=k;}
    dodajArtikal(a){this.listaArtikala=a;console.log(a);}
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
        divzaartikal.appendChild(dugme);
        dugme.onclick = (ev)=>{
            const divpredmeta=document.getElementById("predmeti");
            divpredmeta.hidden=true;
            const sekcijaaukcija=document.getElementById("predmet");
            const formazalicitaciju=document.createElement("div");
            sekcijaaukcija.appendChild(formazalicitaciju);
            formazalicitaciju.className="formazalicitaciju";
            const deozaslikuiopis=document.createElement("div");
            const id=ev.target;
            console.log(id.value);
            deozaslikuiopis.className="deozaslikuiopis";
            formazalicitaciju.appendChild(deozaslikuiopis);
            const predmet=this.listaArtikala[id.value-1];
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
            const dugmelic=document.createElement("button");
            dugmelic.className="dugmelicitiraj";
            dugmelic.value=predmet.id;
            dugmelic.innerHTML="Licitiraj";
            deozalicitaciju.appendChild(dugmelic);
            const unos=document.createElement("input");
            unos.type="number";
            unos.placeholder=predmet.cena;
            deozalicitaciju.appendChild(unos);
            const dugmeodustani=document.createElement("button");
            dugmeodustani.innerHTML="Odustani od licitacije";
            deozalicitaciju.appendChild(dugmeodustani);
            dugmeodustani.onclick=(ev)=>{
                divpredmeta.hidden=false;
                formazalicitaciju.hidden=true;
                obs.unsubscribe(observer);
            }
            let observer=(x)=>{AukcijaService.azuriranjeCene(x.id,x.naziv,x.opis,unos.value);console.log(x.id,x.naziv,x.opis,unos.value);}
            const obs=fromEvent(dugmelic,'click').pipe(
                            map(ev=>ev.target.value),
                            switchMap(ev=>fromPromise(
                                 fetch("http://localhost:3000/artikli/"+ev)
                                    .then(response=>response.json())
                                )),
                            filter(f=>f.cena<parseInt(unos.value)),
                            filter()
            ).subscribe(observer);
        }
    }
}
