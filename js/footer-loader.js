/**
 * Footer Loader Script
 * Dynamically loads the footer component and adjusts paths based on page location
 */
(function() {
	'use strict';
	
	// Determine the path level based on current page location
	function getPathLevel() {
		var path = window.location.pathname;
		var pathParts = path.split('/').filter(function(part) {
			return part && part !== 'index.html';
		});
		
		// Count directory depth (excluding filename)
		var depth = pathParts.length - 1;
		
		// Special cases
		if (path.includes('/legal/')) {
			return { images: '../images/', legal: '' };
		} else if (path.includes('/blogs/') || path.includes('/jobs/')) {
			return { images: '../images/', legal: '../legal/' };
		} else {
			// Root level pages
			return { images: 'images/', legal: 'legal/' };
		}
	}
	
	// Load and inject footer
	function loadFooter() {
		var paths = getPathLevel();
		var footerContainer = document.getElementById('footer-container');
		
		if (!footerContainer) {
			console.warn('Footer container not found');
			return;
		}
		
		// Fetch footer HTML
		var footerPath = 'components/footer.html';
		// Adjust footer path based on current location
		if (window.location.pathname.includes('/legal/') || 
			window.location.pathname.includes('/blogs/') || 
			window.location.pathname.includes('/jobs/')) {
			footerPath = '../components/footer.html';
		}
		
		fetch(footerPath)
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Failed to load footer');
				}
				return response.text();
			})
			.then(function(html) {
				// Replace path placeholders
				html = html.replace(/\[IMAGES_PATH\]/g, paths.images);
				html = html.replace(/\[LEGAL_PATH\]/g, paths.legal);
				
				// Inject footer
				footerContainer.innerHTML = html;
			})
			.catch(function(error) {
				console.error('Error loading footer:', error);
				// Fallback: show a basic footer
				footerContainer.innerHTML = '<div class="rebind-footer"><div class="container"><div class="copyright-wrap">&copy; 2025 Rebind : Winning Trust. All Rights Reserved.</div></div></div>';
			});
	}
	
	// Load footer when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadFooter);
	} else {
		loadFooter();
	}
})();

