# Introduction #
the following version (0.2) will be a full rewrite of the entire app. Virtually NO code will remain unrewritten (is that a word?). It will also shift the focus of the app from being another flash clone to a more community oriented, cross-platform (IE support) and multi-format (possibly including flash, processing, javafx, silverlight, flex, smil, svg, html, gif, apng, and more).


# Details #
  * New JSON save format. Unlike the old one, that was a weird concoction between two seperate formats that are nothing related (JSON+SVG), this one will be pure JSON. For faster parsing, simpler design (and parser), better cross-platformity-ness, and more.
  * Refined UI. As it is a rewrite, the entire UI will be redesigned, bearing some resemlence but not a complete clone.
  * Ext 2.1, updated to a new version of the UI/JS toolkit/framework that I use
  * No Prototype, the app no longer has a prototype dependency
  * OnlyPaths. Probably one of the biggest features is the brand new super-editor that is being worked on. It supports Freeform paths, images, zoom, IE support, abstraction of the native formats, transforms, rotation, and more.
  * New tweening engine. Much faster (noticably so, even with cache disabled), New design (viewing tweens is real-time).
  * GPL v3