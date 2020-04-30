# England & Wales Energy Performance Certificate (EPC) parser

This project is a work-in-progress and may never come to fruition.

## Goal

Show the energy efficiency of properties next to listings so that prospective buyers / renters can easily see which properties are efficient.

## The problem

By law, you must be provided with an EPC before you purchase or rent a property. Many property search websites list the "EPC graph" which gives you a fairly good idea of how energy efficient the property is.

However, these graphs are provided as image files in only an approximately standard format. This makes parsing them with standard OCR techniques tricky. They are only visible once you have clicked through to the listing.

The market would be more efficient if these energy ratings were shown on the list of listings, so that people don't waste their time looking at properties which are poorly insulated (which, in the UK, is most of them).

## Approaches

- Download EPC image from page, crop, use OCR to parse, or

- Download EPC image from page and parse using trained ML model, or

- Add EPC images to listings page (easy?), or

- Use EPC API https://epc.opendatacommunities.org/domestic/ and Zoopla API https://developer.zoopla.co.uk/docs/read/Property_listings to get actual EPC for property - unfortunately, these are only updated 4 times a year and people can ask to not be listed on the register.


### OCR

My first proof of concept used `GraphicsMagick` and `tesseract` to crop and then read the efficiency rating from an EPC. However, this only works on a small number of EPCs which have the same format. I've therefore abandoned this approach.

### ML

Easy mode: can train with https://teachablemachine.withgoogle.com/train/image

The problem: need lots of data. Solution: generate our own. Need various levels of JPG-ification, PNG dithering, shapes of arrows, slightly different colours, slightly different fonts.

### Add EPC images to listing pages

Done, for Zoopla - see src/webextension/.
