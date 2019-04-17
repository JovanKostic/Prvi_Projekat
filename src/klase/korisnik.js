export class Korisnik{
    constructor(ime,prezime,brojLicneKarte,korisnickoIme,Lozinka){
        this.ime=ime;
        this.prezime=prezime;
        this.brojLicneKarte=brojLicneKarte;
        this.korisnickoIme=korisnickoIme;
        this.lozinka=Lozinka;
        this.prijavljen=false;
    }
}