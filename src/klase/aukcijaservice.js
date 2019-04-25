export class AukcijaService{
    /*static get(){
        return fetch("http://localhost:3000/artikli")
        .then(response=>response.json());
    }
    static getKorisnik(){
        return fetch("http://localhost:3000/korisnici")
        .then(response=>response.json());
    }*/
    static dobavljanjeArtikalaIzBaze(){
        const axios = require('axios');
        return axios.get('http://localhost:3000/artikli');
    }
    static dobavljanjeKorisnikaIzBaze(){
        const axios = require('axios');
        return axios.get('http://localhost:3000/korisnici');
    }
    static azuriranjeCeneIKupca(id,naziv,opis,cena,kupac){
        const axios = require('axios');
        axios.put('http://localhost:3000/artikli/'+id, {
            naziv:naziv,
            opis:opis,
            cena:cena,
            kupac:kupac
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });  
    }
    static azuriranjeKorisnika(korisnik){
        const axios = require('axios');
        axios.put('http://localhost:3000/korisnici/'+korisnik.id, {
            ime:korisnik.ime,
            prezime:korisnik.prezime,
            brojLicneKarte:korisnik.brojLicneKarte,
            korisnickoIme:korisnik.korisnickoIme,
            lozinka:korisnik.lozinka,
            prijavljen:korisnik.prijavljen,
            predmet:korisnik.predmet
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });  
    }
    static dodavanjeKorisnikaUBazu(korisnik){
        const axios = require('axios');
        axios.post('http://localhost:3000/korisnici', {
            ime:korisnik.ime,
            prezime:korisnik.prezime,
            brojLicneKarte:korisnik.brojLicneKarte,
            korisnickoIme:korisnik.korisnickoIme,
            lozinka:korisnik.lozinka,
            prijavljen:korisnik.prijavljen,
            predmet:""
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
    console.log(error);
        });
    }
    static dodavanjePoslatihPredmeta(ime,prezime,brojlicnekarte,ziroracun,adresaisporuke,nazivpredmeta){
        const axios = require('axios');
        axios.post('http://localhost:3000/poslatiPredmeti', {
            ime:ime,
            prezime:prezime,
            brojLicneKarte:brojlicnekarte,
            ziroracun:ziroracun,
            adresaisporuke:adresaisporuke,
            nazivpredmeta
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
    console.log(error);
        });
    }
    static brisanjePoslatihPredmeta(id){
        const axios = require('axios');
        axios.delete('http://localhost:3000/artikli/'+id)
        .then(resp => {
            console.log(resp.data)
        }).catch(error => {
            console.log(error);
        });   
    }
}