// ==UserScript==
// @name         Energy Performance Certificate (EPC) inliner
// @namespace    https://tridactyl.xyz
// @version      0.0.2
// @description  Inlines EPC images on estate agent listing pages. Currently only works on Zoopla.
// @author       bovine3dom
// @match        https://www.zoopla.co.uk/to-rent/details/*
// @match        https://www.zoopla.co.uk/for-sale/details/*
// @match        https://www.zoopla.co.uk/new-homes/details/*
// @match        https://www.zoopla.co.uk/to-rent/property/*
// @match        https://www.zoopla.co.uk/for-sale/property/*
// @match        https://www.zoopla.co.uk/new-homes/property/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    const url = document.location.href
    if (url.match(/zoopla\.co\.uk\/(to-rent|for-sale|new-homes)/) !== null) {
        if (url.match(/property/) !== null){
            for (let x of document.querySelectorAll("a.listing-results-price.text-price, a.lsrp-property-card__pricing-link")){
                epc_nabber_element(x).then(r=> {
                    try {
                        x.parentElement.parentElement.querySelector("div.status-wrapper").children[1].appendChild(r)
                    } catch(e) {
                        x.parentElement.appendChild(r)
                    }
                })
            }
        } else if (url.match(/details/) !== null){
            document.getElementById("property-details-tab").children[1].appendChild(page2epc_element(document))
        }
    } // logic for other sites if we decide to support them goes here
})()

function page2epc_element(page){
    try {
        const url = page2epc_url(page)
        const img = document.createElement("img")
        img.src = url
        img.style.maxWidth = "100%"
        return img
    } catch(e) {
        const div = document.createElement("div")
        div.innerHTML = "<b>NB:</b> No EPC found for this property."
        return div
    }
}

function page2epc_url(page){
    return page.querySelector("#epc-1").getElementsByClassName(
        "ui-modal-gallery__asset ui-modal-gallery__asset--center-content"
    )[0].style.backgroundImage.slice(5,-2)
}

async function epc_nabber_element(link){
    const page = await (await fetch(link)).text()
    const dummy = document.createElement('html')
    dummy.innerHTML = page
    return page2epc_element(dummy)
}

