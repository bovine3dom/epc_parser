// ==UserScript==
// @name         Energy Performance Certificate (EPC) inliner
// @namespace    https://tridactyl.xyz
// @version      0.1
// @description  Inlines EPC images on estate agent listing pages. Currently only works on Zoopla.
// @author       bovine3dom
// @match        https://www.zoopla.co.uk/to-rent/details/*
// @match        https://www.zoopla.co.uk/for-sale/details/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    try {
        const url = document.getElementById("epc-1").getElementsByClassName("ui-modal-gallery__asset ui-modal-gallery__asset--center-content")[0].style.backgroundImage.slice(5,-2);
        const img = document.createElement("img"); img.src = url;
        document.getElementById("property-details-tab").children[1].appendChild(img);
    } catch(e) {
        const div = document.createElement("div"); div.innerHTML = "<b>NB:</b> No EPC found for this property. Expect the worst.";
        document.getElementById("property-details-tab").children[1].appendChild(div);
    }
})();
