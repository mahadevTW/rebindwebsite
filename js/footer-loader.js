/**
 * Footer Loader Script
 * Dynamically loads the footer component and adjusts paths based on page location
 */
(function() {
	'use strict';
	
	// Determine the path level based on current page location
	function getPathLevel() {
		var path = window.location.pathname;
		// Normalize path - remove leading slash and handle index.html
		path = path.replace(/^\//, '').replace(/\/$/, '');
		
		// Special cases - check for subdirectories
		if (path.indexOf('legal/') === 0 || path.indexOf('/legal/') !== -1) {
			return { images: '../images/', legal: '', root: '../' };
		} else if (path.indexOf('blogs/') === 0 || path.indexOf('/blogs/') !== -1 || 
		           path.indexOf('jobs/') === 0 || path.indexOf('/jobs/') !== -1) {
			return { images: '../images/', legal: '../legal/', root: '../' };
		} else {
			// Root level pages (index.html, pricing.html, services.html, etc.)
			return { images: 'images/', legal: 'legal/', root: '' };
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
		
		// Debug: log paths
		console.log('Footer loader: Current path:', window.location.pathname);
		console.log('Footer loader: Calculated paths:', paths);
		
		// Fetch footer HTML
		var footerPath = 'components/footer.html';
		// Adjust footer path based on current location
		if (window.location.pathname.includes('/legal/') || 
			window.location.pathname.includes('/blogs/') || 
			window.location.pathname.includes('/jobs/')) {
			footerPath = '../components/footer.html';
		}
		
		console.log('Footer loader: Fetching from:', footerPath);
		
		fetch(footerPath)
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Failed to load footer');
				}
				return response.text();
			})
			.then(function(html) {
				// Get path values
				var imagesPath = paths.images || '';
				var legalPath = paths.legal || '';
				var rootPath = paths.root || '';
				
				console.log('Footer loader: Replacing placeholders with:', {
					images: imagesPath,
					legal: legalPath,
					root: rootPath
				});
				
				// Replace path placeholders - use split/join for reliable replacement
				html = html.split('[IMAGES_PATH]').join(imagesPath);
				html = html.split('[LEGAL_PATH]').join(legalPath);
				html = html.split('[ROOT_PATH]').join(rootPath);
				
				// Debug: log if placeholder still exists
				if (html.indexOf('[ROOT_PATH]') !== -1 || html.indexOf('[IMAGES_PATH]') !== -1 || html.indexOf('[LEGAL_PATH]') !== -1) {
					console.error('ERROR: Some placeholders not replaced!');
					console.error('Paths object:', paths);
					console.error('HTML still contains placeholders');
				} else {
					console.log('Footer loader: All placeholders replaced successfully');
				}
				
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


