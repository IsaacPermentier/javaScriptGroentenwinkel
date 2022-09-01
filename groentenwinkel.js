"use strict"
let lijst = document.getElementById("groente");
let groenten;
let prijs;
const tbody = document.querySelector("tbody");
leesArtikelen();
async function leesArtikelen() {
    const response = await fetch("groenten.json");
    if (response.ok) {
        groenten = await response.json();
        voegGroentenToe(groenten);
    } else {
        document.getElementById("bestandenFout").hidden = false;
    }
}

document.getElementById("toevoegen").onclick = function () {
    if (validatieInput()) {
        if(!werkMandjeBij()){;
        vulMandje();
        document.getElementById("groente").value = ""
        document.getElementById("aantal").value = ""
        }
    }
}

function voegGroentenToe(groenten) {
    for (const groente of groenten) {
        const option = document.createElement("option");
        option.innerText = `${groente.naam} (${groente.prijs}/${groente.eenheid})`
        option.value = groente.naam;
        option.id = groente.naam;
        lijst.appendChild(option)
    }
}

function validatieInput() {
    const verkeerdeElementen = document.querySelectorAll("select:invalid,input:invalid");
    for (const element of verkeerdeElementen) {
        document.getElementById(`${element.id}Fout`).hidden = false;
    }
    const correcteElementen = document.querySelectorAll("select:valid,input:valid");
    for (const element of correcteElementen) {
        document.getElementById(`${element.id}Fout`).hidden = true;
    } return verkeerdeElementen.length === 0;
}

function vulMandje() {
    let som = 0;
    const gekozenGroente = lijst.value;
    for (const artikel of groenten) {
        if (artikel.naam === gekozenGroente) {
            prijs = artikel.prijs
        }
    }
    const tabel = document.getElementById("tabelBody");
    const tr = tabel.insertRow();
    const tdGroente = tr.insertCell();
    tdGroente.id = gekozenGroente
    const tdAantal = tr.insertCell();
    const tdPrijs = tr.insertCell();
    const tdTeBetalen = tr.insertCell(); 
    const totaalTeBetalen = document.getElementById("totaalTeBetalen");
    const verwijderTd = tr.insertCell();
    tdGroente.innerText = gekozenGroente
    tdAantal.innerText = Number(document.getElementById("aantal").value);
    tdPrijs.innerText = Number(prijs);
    tdTeBetalen.innerText = (tdAantal.innerText * prijs).toFixed(2);
    const verwijderHyperlink = document.createElement("a");
    verwijderHyperlink.innerHTML = `<img src="vuilbak.png">`;
    verwijderHyperlink.href = "#";
    verwijderTd.appendChild(verwijderHyperlink);
    verwijderHyperlink.onclick = function () {
        som = 0
        const tr = this.parentElement.parentElement;
        tr.remove();
        for (let teller = 1; teller <= tbody.rows.length; teller ++){
            let teBetalen = Number(document.querySelector("tbody").rows[teller-1].cells[3].innerText);
            som += teBetalen;
        }
        totaalTeBetalen.innerText = Number((som).toFixed(2));
        if (som === 0){
            totaalTeBetalen.innerText = "";
        }
    }
    for (let teller = 1; teller <= tbody.rows.length; teller ++){
        let teBetalen = Number(document.querySelector("tbody").rows[teller-1].cells[3].innerText);
        som += teBetalen;
    }
    totaalTeBetalen.innerText = Number((som).toFixed(2));
    if (som === 0){
        totaalTeBetalen.innerText = "";
    }
}

function werkMandjeBij(){
    let som = 0;
    const groenteInput = document.getElementById("groente").value;
    const groente = document.querySelector(`td[id=${groenteInput}]`)
    for (const artikel of groenten) {
        if (artikel.naam === groente) {
            prijs = artikel.prijs
        }
    }
    if (groente === null){
        return false;
    }
    const juisteGroente = document.querySelector(`td[id=${groenteInput}]`);
    const tdTeBetalen = juisteGroente.parentElement.lastElementChild.previousElementSibling;
    let juisteAantal = Number(juisteGroente.nextElementSibling.innerText);
    juisteAantal = juisteAantal + Number(document.getElementById("aantal").value);
    juisteGroente.nextElementSibling.innerText = juisteAantal
    let nieuweTotaal = Number(juisteAantal * prijs)
    tdTeBetalen.innerText = nieuweTotaal.toFixed(2);
    const totaalTeBetalen = document.getElementById("totaalTeBetalen");
    for (let teller = 1; teller <= tbody.rows.length; teller ++){
        let teBetalen = Number(document.querySelector("tbody").rows[teller-1].cells[3].innerText);
        som += teBetalen;
    }
    totaalTeBetalen.innerText = Number((som).toFixed(2));
    if (som === 0){
        totaalTeBetalen.innerText = "";
    }
    return true;

}