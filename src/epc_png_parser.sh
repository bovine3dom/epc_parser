#!/bin/bash
# requires tesseract, tesseract-data-eng, graphicsmagick


# 419x415 - location of end of first column
# 497x415 - location of end of second column
# 509x467 - standard size of Zoopla image (i.e. should still work if they up the resolution one day)

# Unfortunately, the links to the images aren't real on Zoopla - they only appear with JS, so this approach doesn't work
# curl -s $1 -o - | gm convert -resize 509x467 -crop 45x330+363+84 -trim - - | tesseract - - --psm 6 digits

gm convert -resize 509x467 -crop 45x330+363+84 -trim $1 - | tesseract - - --psm 6 digits
