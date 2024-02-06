/**
 * squarespace-promotional-popup-onclick
 * https://github.com/tcdent/squarespace-promotional-popup-onclick
 * 
 * Show a Squarespace marketing popup when a button is clicked
 * 
 * In the Squarespace admin, the popover is set to show immediately. We intercept
 * it as it loads and keep it hidden until we want to show it.
 * 
 * Any button which links to the POPOVER_ANCHOR will show the popover.
 * For example, <a href="#subscribe">Subscribe</a>
 * // SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_ANCHOR = '#subscribe'
 * 
 * We don't have access to jQuery, so we have to use vanilla JS.
 * This code is injected into the head so needs to initialize after the dom has loaded.
 * Squarespace loads the popover content after the DOM has loaded, so we need to wait to 
 * alter it. During load the `style` attribure is set to "display:block" so we have to 
 * override that to manipulate the visibility. 
 * 
 * Also adds `gtag` events for popup-shown, popup-close, and popup-submit, since 
 * Squarespace doesn't implement Google Analytics in popovers.
*/

(function(){
    if(typeof SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_DEBUG == 'undefined')
        SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_DEBUG = false;
    if(typeof SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_ANCHOR == 'undefined')
        SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_ANCHOR = '#subscribe';
    
    const DEBUG = SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_DEBUG;
    const ANCHOR = SQUARESPACE_PROMOTIONAL_POPUP_ONCLICK_ANCHOR;

    let debug = function(message){
        if(DEBUG) console.log("[squarespace-promotional-popup-onclick] "+message);
    }

    function wait_for_element(selector, callback, retry_number){
        /* 
        * Wait for an element to exist in the DOM
        * selector: function which returns the element
        * callback: function to call when element is found
        * retry_number: number of times we've already tried
        */
        const MAX_RETRIES = 42;
        let $element = selector();
        if(retry_number == null){
            retry_number = 0;
        }
        else if(retry_number > MAX_RETRIES){
            debug("Max retries reached; no element found");
            return;
        }
        if($element){
            debug("Found element DOM");
            return callback();
        }
        
        setTimeout(function(){
            debug("Waiting for element DOM");
            wait_for_element(selector, callback, retry_number +1);
        }, 500);
    }

    let _initialized;
    function init(){
        if(_initialized){
            debug("Already initialized");
            return;
        }
        var $popover;
        var $buttons = document.querySelectorAll('a[href="'+ANCHOR+'"]');

        wait_for_element(function(){
            $popover = document.querySelector('.sqs-popup-overlay');
            return $popover;
        }, function(){
            debug("Wrapping popover");
            var $wrapper = document.createElement('div');
            $wrapper.style.display = 'none';
            $popover.parentNode.insertBefore($wrapper, $popover);
            $wrapper.appendChild($popover);

            setTimeout(function(){
                debug("Hiding popover");
                $popover.style.display = 'none';
                $popover.classList.remove('visible');
                $wrapper.style.display = 'block';
                var $close_button;
                wait_for_element(function(){
                    $close_button = document.querySelector('.sqs-popup-overlay .sqs-popup-overlay-close');
                    return $close_button;
                }, function(){
                    debug("Adding event listener to close button");
                    $close_button.addEventListener('click', function(e){
                        debug("Close button click");
                        gtag('event', 'popup-close');
                        e.preventDefault();
                        $popover.style.display = 'none';
                        $popover.classList.remove('visible');
                    });
                });
                var $submit_button;
                wait_for_element(function(){
                    $submit_button = document.querySelector('.sqs-popup-overlay button[type="submit"]');
                    return $submit_button;
                }, function(){
                    debug("Adding event listener to submit button");
                    $submit_button.addEventListener('click', function(e){
                        debug("Submit button click");
                        gtag('event', 'popup-submit');
                    });
                });
            }, 500);
        });

        for (var i = 0; i < $buttons.length; i++) {
            debug("Adding event listener to buttons");
            $buttons[i].addEventListener('click', function(e){
                debug("Button click");
                gtag('event', 'popup-shown');
                e.preventDefault();
                $popover.style.display = 'block';
                $popover.classList.add('visible');
            });
        }

        _initialized = true;
    }
    document.addEventListener('DOMContentLoaded', init);

    // Show popup every time.
    window.localStorage.setItem('squarespace-popup-overlay', '0');
})();
