export class AukcijaService{
    constructor(){}
    static get(){
        return fetch("http://localhost:3000/artikli")
        .then(response=>response.json());
    }
    static getKorisnik(){
        return fetch("http://localhost:3000/korisnici")
        .then(response=>response.json());
    }
    static get_request(){
        const axios = require('axios');
        return axios.get('http://localhost:3000/artikli').then(response=>response.json());
    }
    static put_request(id,naziv,opis,cena){
        const axios = require('axios');
        axios.put('http://localhost:3000/artikli/'+id, {
            naziv:naziv,
            opis:opis,
            cena:cena
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });  
    }
    static post_request(korisnik){
        const axios = require('axios');
        axios.post('http://localhost:3000/korisnici', {
            ime:korisnik.ime,
            prezime:korisnik.prezime,
            brojLicneKarte:korisnik.brojLicneKarte,
            korisnickoIme:korisnik.korisnickoIme,
            lozinka:korisnik.lozinka,
            prijavljen:korisnik.prijavljen
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
    console.log(error);
        });
    }
    static vratiKorisnika(){
        return fetch("http://localhost:3000/korisnici")
        .then(response=>response.json());
    }
}