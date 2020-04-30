#!/usr/bin/env bash
yarn install && yarn run web-ext run -s src/ -u zoopla.co.uk/to-rent/property/anglesey -t chromium -t firefox-desktop
