squarespace-promotional-popup-onclick
=====================================

https://github.com/tcdent/squarespace-promotional-popup-onclick

Show a Squarespace marketing popup when a button is clicked.

Usage
-----
Include the follwing embed code in the header of the page, either by _Page Header Code Injection_ or or _Developer Tools Code Injection_. 

```html
<script type="text/javascript">
  const SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_ANCHOR = "#subscribe";
</script>
<script src="https://raw.githubusercontent.com/tcdent/squarespace-promotional-popup-onclick/main/embed.js" type="text/javascript"></script>
```

Set one or more buttons on the page to link to your chosen anchor name (default: `"#subscribe"`). 
```html
<a href="#subscribe">Subscribe</a>
```


Page Header Code Injection
--------------------------
This will run this code to run on a single page on your site. 

* In the Squaresapace admin navigation, choose _Pages_.
* Hover over the page you wish to include the code, click the _gear icon_.
* Select _Advanced_. 
* Paste the embed code above into the _Page Header Code Injection_ field. 

Developer Tools Code Injection
------------------------------
This will run this code on every page of your site. 

* In the Squarespace admin navigation, choose _Settings_.
* Click _Developer Tools_.
* Click _Code Injection_.
* Paste the embed code above into the _Header_ field. 
