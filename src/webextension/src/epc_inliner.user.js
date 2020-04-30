// ==UserScript==
// @name         Energy Performance Certificate (EPC) inliner
// @namespace    https://tridactyl.xyz
// @version      0.0.2
// @description  Inlines EPC images on estate agent listing pages for Zoopla and Rightmove.
// @author       bovine3dom
// @match        https://www.zoopla.co.uk/*
// @match        https://www.rightmove.co.uk/*
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
    } else if (url.match(/rightmove\.co\.uk\/property-(to-rent|for-sale)/) !== null) {
        if (url.match(/property-[0-9]*\.html/) !== null){
            rm_page2epc_url(document).then(src => {
                document.querySelector("div.agent-content").children[0].appendChild(rm_url2epc_element(src))
            })
        } else {
            for (let x of document.querySelectorAll("a.propertyCard-link[data-test='property-details']")){
                rm_epc_nabber_element(x.href).then(i=>{
                    console.log(i);
                    i.style.maxWidth = "50%";
                    x.parentNode.parentNode.parentNode.parentNode.appendChild(i)
                })
            }
        }
    }
})()

// Zoopla
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

// Rightmove
async function rm_epc_nabber_element(link){
    try {
        const page = await (await fetch(link)).text()
        const dummy = document.createElement('html')
        dummy.innerHTML = page
        const url = await rm_page2epc_url(dummy)
        return rm_url2epc_element(url)
    } catch(e) {
        const div = document.createElement("div")
        div.innerHTML = "<b>NB:</b> No EPC found for this property."
        return div
    }
}

function rm_url2epc_element(url){
        const img = document.createElement("img")
        img.src = url
        img.style.maxWidth = "100%"
        img.style.maxHeight = "100%"
        return img
}
async function rm_page2epc_url(page){
    const redir_link = document.evaluate("//h3[contains(., 'Energy Performance Certificate (EPC) graphs')]", page, null, XPathResult.ANY_TYPE, null ).iterateNext().parentNode.querySelector("a").href
    const redir = await (await fetch(redir_link)).text()
    const dummy = document.createElement('html')
    dummy.innerHTML = redir
    return dummy.querySelector("a").href
}
