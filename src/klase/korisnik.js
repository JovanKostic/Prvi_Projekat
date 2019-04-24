import {Artikal} from './artikal.js';
export class Korisnik{
    constructor(ime,prezime,brojLicneKarte,korisnickoIme,Lozinka){
        this.ime=ime;
        this.prezime=prezime;
        this.brojLicneKarte=brojLicneKarte;
        this.korisnickoIme=korisnickoIme;
        this.lozinka=Lozinka;
        this.prijavljen=false;
        this.artikal=null;
    }
    dodajArtikal(a){
        this.artikal=new Artikal(a.naziv,a.opis);
        console.log(this.artikal)
    }
    prikaziArtikal(){console.log(this.artikal);}
}