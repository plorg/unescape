Unescape
========

Scripts for unshortening urls and removing tracking query strings from hyperlinks.

* For several sites (Google, Youtube, Facebook, Twitter, etc.) which attempt to redirect the user through a second server, the scripts largely remove those redirects.
* For link shorteners (especially Bitly) for which I have located an API that can unshorten public links (e.g. links created by others), the scripts unshorten those links.
* For links which include tracking arguments (e.g. utm_XXX), the scripts remove those arguments.
* For elements with one of several "data-XXXXX" attributes (e.g. 'data-track' on some websites), the scripts remove those attributes.

The specific domains, arguments, and data come from urls to which I have seen links. Consequently, the script may miss a lot, but for my daily internet usage they cover most sites and links which I encounter.

Installation
============
The Unescape scripts are intended to be used in a userscript engine. Currently they are being developed for my personal use in Tampermonkey (http://tampermonkey.net/). 

In order to allow unescaping of Bitly links you will need to acquire an Oauth access token for the Bitly API:
* If you do not have a Bitly account, you can create one at https://bitly.com/a/sign_up
* You can create a personal access token at https://bitly.com/a/oauth_apps
* In each of the included scripts, find the string "INSERT_YOUR_BITLY_API_KEY_HERE" and replace it with the token you just generated.

Similar functionality is included for TinyCC, which is used far less on the internet:
* If you do not have a TinyCC account, you can create one by visiting http://tiny.cc/ and selecting the "Register" button in the upper right corner of the page.
* Log into your TinyCC account and follow the instructions at http://tiny.cc/api-docs to create an API key.
* In each of the included scripts, find the string "INSERT_YOUR_TINYCC_LOGIN_HERE" and replace it with the username of your account.
* In each of the included scripts, find the string "INSERT_YOUR_TINYCC_API_KEY_HERE" and replace it with the API key you just generated.
