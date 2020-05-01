// ==UserScript==
// @name         Greendigger
// @namespace    https://tridactyl.xyz
// @version      0.0.4
// @description  Helps you to find digs that are green. Inlines EPC images on listing pages for Zoopla and Rightmove.
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
                fake_page(x).then(r=> {
                    r = zp_page2epc_element(r)
                    try {
                        x.parentElement.parentElement.querySelector("div.status-wrapper").children[1].appendChild(r)
                    } catch(e) {
                        x.parentElement.appendChild(r)
                    }
                })
            }
        } else if (url.match(/details/) !== null){
            document.getElementById("property-details-tab").children[1].appendChild(zp_page2epc_element(document))
        }
    } else if (url.match(/rightmove\.co\.uk\/property-(to-rent|for-sale)/) !== null) {
        if (url.match(/property-[0-9]*\.html/) !== null){
            rm_page2epc_url(document).then(src => {
                document.querySelector("div.agent-content").children[0].appendChild(img(src))
            })
        } else {
            for (let x of document.querySelectorAll("a.propertyCard-link[data-test='property-details']")){
                rm_epc_nabber_element(x.href).then(i=>{
                    i.style.maxWidth = "50%"
                    x.parentNode.parentNode.parentNode.parentNode.appendChild(i)
                })
            }
        }
    }
})()

// Generic
function error_div(){
    const div = document.createElement("div")
    div.innerHTML = "<b>NB:</b> No EPC found for this property."
    return div
}

async function fake_page(link){
    const page = await (await fetch(link)).text()
    const dummy = document.createElement('html')
    dummy.innerHTML = page
    return dummy
}

function img(link){
    const img = document.createElement("img")
    img.src = link
    img.style.maxWidth = "100%"
    return img
}

// Zoopla
function zp_page2epc_element(page){
    try {
        const url = zp_page2epc_url(page)
        return img(url)
    } catch(e) {
        return error_div()
    }
}

function zp_page2epc_url(page){
    return page.querySelector("#epc-1").getElementsByClassName(
        "ui-modal-gallery__asset ui-modal-gallery__asset--center-content"
    )[0].style.backgroundImage.slice(5,-2)
}

// Rightmove
async function rm_epc_nabber_element(link){
    try {
        const url = await rm_page2epc_url(await fake_page(link))
        return img(url)
    } catch(e) {
        return error_div()
    }
}

async function rm_page2epc_url(page){
    const redir_link = document.evaluate("//h3[contains(., 'Energy Performance Certificate (EPC) graphs')]", page, null, XPathResult.ANY_TYPE, null ).iterateNext().parentNode.querySelector("a").href
    const dummy = await fake_page(redir_link)
    return dummy.querySelector("a").href
}
