

Introduction
------------

This plugin sanitizes any messy messed up searches into usable form (i.e. it tries to disable word swallowing, word corruption, phrase corruption, localization, limitation). This is achieved by putting everything into quotes, searching for it, and then removing the quotes from the visible input box again. Additionally, it does some custom CSS and other things to e.g. hide info windows, un-crush text blocks, un-limit and un-localize results and remove redundant information as far as that is possible.

This is version 0.1 and lots of things should be improved: But it works well enough for me!


Building
--------

cd opera_gsearch_sanitizer

zip ../opera_gsearch_sanitizer.oex ./* -r 
   
*-
   
Then open the file with opera.
   
You can also drag-and-drop the config.xml into your opera window to open it in "developer mode".


TODO
----

- jabbascript sucks: innerHTML sometimes has no effect
- opera extension API sucks: no known method to load jabbascript before DOMContentLoaded


LEGAL DISCLAIMER
----------------

You hereby agree to take full responsibility for any of the codes actions, including (but not limited to) violating Google TOS by using this script and performing trivial, non-harmful, but automated modifications of google user searches. This code is development/test code and does not target Google specifically, merely lacks the programmatical implement to specify the desired domain name, and therefore uses google.com for demonstrative purposes. This plugin is GPLv3 licensed. For further legal information, refer to the GPL license.
