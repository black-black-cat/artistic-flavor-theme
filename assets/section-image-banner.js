/**
 * Image Banner Section Script
 * ------------------------------------------------------------------------------
 * Handles parallax effect for the image banner section.
 *
 * @namespace sectionImageBanner
 */

const sectionImageBanner = {
  onLoad() {
    this.initParallax();
    window.addEventListener('scroll', this.handleScroll.bind(this));
    // Consider adding debounce/throttle for performance if needed
  },

  initParallax() {
    this.parallaxBanners = document.querySelectorAll('.banner--parallax');
    if (!this.parallaxBanners.length) return;

    this.parallaxBanners.forEach((banner) => {
      const media = banner.querySelector('.banner__media');
      if (media) {
        // Initial position calculation might be needed depending on effect
        this.applyParallax(banner, media);
      }
    });
  },

  handleScroll() {
    if (!this.parallaxBanners || !this.parallaxBanners.length) return;

    this.parallaxBanners.forEach((banner) => {
      const media = banner.querySelector('.banner__media');
      if (media) {
        this.applyParallax(banner, media);
      }
    });
  },

  applyParallax(banner, media) {
    const bannerRect = banner.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only apply effect if banner is somewhat in view
    if (bannerRect.bottom >= 0 && bannerRect.top <= windowHeight) {
      // Calculate how far the banner top is from the viewport top
      // Value is 0 when banner top is at viewport top, positive when below, negative when above
      const scrollOffset = bannerRect.top;

      // Parallax factor - adjust this value to control the speed difference (e.g., 0.3 means it moves 30% slower)
      const parallaxFactor = 0.3;

      // Calculate the translation amount
      // We want the image to move slower, so we apply a fraction of the scroll offset
      // Negative offset means scrolling down, positive means scrolling up relative to element
      const translateY = -scrollOffset * parallaxFactor;

      // Apply the transform
      // Using translate3d for potential hardware acceleration
      media.style.transform = `translate3d(0, ${translateY}px, 0)`;
      media.style.willChange = 'transform'; // Hint browser for optimization
    } else {
      // Reset transform when out of view to avoid unnecessary calculations/styles
      // Or set to initial state if needed
      media.style.transform = 'translate3d(0, 0, 0)';
      media.style.willChange = 'auto';
    }
  },

  onUnload() {
    // Clean up event listeners if the section is dynamically removed (e.g., in theme editor)
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  },
};

// --- Load Event Listeners ---
// Using DOMContentLoaded ensures the DOM is ready before selecting elements
document.addEventListener('DOMContentLoaded', () => {
  sectionImageBanner.onLoad();
});

// --- Shopify Theme Editor Integration ---
// Handle section load/unload events in the theme editor
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.matches('[id^="shopify-section-banner-"]')) {
    // Check if the loaded section is an image banner
    sectionImageBanner.onLoad(); // Re-initialize for the newly loaded section
  }
});

document.addEventListener('shopify:section:unload', (event) => {
  if (event.target.matches('[id^="shopify-section-banner-"]')) {
    sectionImageBanner.onUnload(); // Clean up for the unloaded section
  }
});

// Consider adding specific section ID handling if multiple banners need independent state
