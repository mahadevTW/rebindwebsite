/* Google Analytics Centralized Script */

// 1. Initialize the dataLayer and gtag function globally
window.dataLayer = window.dataLayer || [];
window.gtag = function () {
    window.dataLayer.push(arguments);
};

// 2. Load the external Google Tag script and configure GA
(function () {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-GSZRJ0239L';

    // Ensure document.head exists before appending
    var target = document.head || document.getElementsByTagName('head')[0];
    if (target) {
        target.appendChild(gaScript);
    }

    window.gtag('js', new Date());
    window.gtag('config', 'G-GSZRJ0239L');

    // 3. Global Button & CTA Click Tracking
    document.addEventListener('click', function (event) {
        // Target common button and link patterns
        var targetEl = event.target.closest('button, a[class*="btn"], a[class*="cta"], .navbar-nav li a');

        if (targetEl) {
            var text = targetEl.innerText.trim() || targetEl.getAttribute('aria-label') || 'unnamed_element';
            window.gtag('event', 'button_click', {
                'button_text': text,
                'page_path': window.location.pathname,
                'page_title': document.title
            });
        }
    });
})();
