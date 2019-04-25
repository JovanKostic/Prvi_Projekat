import {Korisnik} from './korisnik.js';
export class Artikal{
    constructor(naziv,opis){
        this.naziv=naziv;
        this.opis=opis;
        this.cena=0;
        this.kupac="";
    }
}