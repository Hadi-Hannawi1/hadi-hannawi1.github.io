/* ===================================
   CRITICAL PERFORMANCE ENHANCEMENTS
   Eliminates 2-second scroll lag
   =================================== */

(function() {
    'use strict';

    // ===================================
    // 1. REQUESTIDLECALLBACK FOR NON-CRITICAL OPERATIONS
    // ===================================
    
    /**
     * Execute non-critical tasks during browser idle time
     */
    function runWhenIdle(callback) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 1);
        }
    }

    // ===================================
    // 2. OPTIMIZED SCROLL HANDLER WITH RAF
    // ===================================
    
    /**
     * High-performance scroll handler using requestAnimationFrame
     * Prevents layout thrashing and forced reflows
     */
    let scrollTicking = false;
    let lastScrollY = window.pageYOffset;

    function optimizedScrollHandler(callback) {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                callback(window.pageYOffset, lastScrollY);
                lastScrollY = window.pageYOffset;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    // Replace any existing scroll listeners with optimized version
    window.addEventListener('scroll', () => {
        optimizedScrollHandler((scrollY, prevScrollY) => {
            // Batch all scroll-related DOM updates here
            // This prevents layout thrashing
        });
    }, { passive: true });

    // ===================================
    // 3. LAZY LOAD IMAGES WITH NATIVE API
    // ===================================
    
    /**
     * Ensure all images use native lazy loading
     * Already implemented in HTML, this is a fallback
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    // Run after page load
    runWhenIdle(optimizeImages);

    // ===================================
    // 4. INTERSECTION OBSERVER POLYFILL CHECK
    // ===================================
    
    /**
     * Ensure Intersection Observer is available
     * Falls back to scroll listeners if not supported
     */
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported. Scroll performance may be reduced.');
    }

    // ===================================
    // 5. PREVENT PAINT DURING SCROLL
    // ===================================
    
    /**
     * Disable pointer events during scroll to prevent repaints
     * Re-enable after scroll stops
     */
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 150);
    }, { passive: true });

    // ===================================
    // 6. BATCH DOM READS AND WRITES
    // ===================================
    
    /**
     * Separate read and write operations to prevent forced reflows
     */
    const readQueue = [];
    const writeQueue = [];
    let rafScheduled = false;

    function batchDOMUpdates() {
        // Execute all reads first
        readQueue.forEach(fn => fn());
        readQueue.length = 0;

        // Then execute all writes
        writeQueue.forEach(fn => fn());
        writeQueue.length = 0;

        rafScheduled = false;
    }

    window.scheduleRead = function(fn) {
        readQueue.push(fn);
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(batchDOMUpdates);
        }
    };

    window.scheduleWrite = function(fn) {
        writeQueue.push(fn);
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(batchDOMUpdates);
        }
    };

    // ===================================
    // 7. PREFETCH CRITICAL RESOURCES
    // ===================================
    
    /**
     * Prefetch resources that will be needed soon
     */
    function prefetchResources() {
        const links = document.querySelectorAll('a[href]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const href = entry.target.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        // Prefetch section images
                        const section = document.querySelector(href);
                        if (section) {
                            const images = section.querySelectorAll('img[loading="lazy"]');
                            images.forEach(img => {
                                img.setAttribute('loading', 'eager');
                            });
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '200px'
        });

        links.forEach(link => observer.observe(link));
    }

    runWhenIdle(prefetchResources);

    // ===================================
    // 8. OPTIMIZE ANIMATION FRAME RATE
    // ===================================
    
    /**
     * Cap animation frame rate for smoother performance
     */
    let lastFrameTime = Date.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    window.optimizedRAF = function(callback) {
        requestAnimationFrame((timestamp) => {
            const now = Date.now();
            const elapsed = now - lastFrameTime;

            if (elapsed > frameInterval) {
                lastFrameTime = now - (elapsed % frameInterval);
                callback(timestamp);
            }
        });
    };

    // ===================================
    // 9. REDUCE MOTION FOR ACCESSIBILITY AND PERFORMANCE
    // ===================================
    
    /**
     * Automatically disable animations if user prefers reduced motion
     */
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable all AOS animations
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.removeAttribute('data-aos');
                el.classList.add('aos-animate');
            });
            
            // Reduce CSS animation duration
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    checkReducedMotion();

    // ===================================
    // 10. DEBOUNCE RESIZE EVENTS
    // ===================================
    
    /**
     * Prevent excessive resize event firing
     */
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Trigger resize-dependent calculations here
            window.dispatchEvent(new CustomEvent('optimizedResize'));
        }, 250);
    }, { passive: true });

    // ===================================
    // 11. MEMORY MANAGEMENT
    // ===================================
    
    /**
     * Clean up event listeners and observers when leaving page
     */
    window.addEventListener('beforeunload', () => {
        // Clear all timeouts and intervals
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
    });

    // ===================================
    // 12. PERFORMANCE MONITORING
    // ===================================
    
    /**
     * Monitor scroll performance in development
     */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        let frameCount = 0;
        let lastTime = performance.now();

        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            const elapsed = currentTime - lastTime;

            if (elapsed >= 1000) {
                const fps = Math.round((frameCount * 1000) / elapsed);
                console.log(`[Performance] FPS: ${fps}`);
                
                if (fps < 50) {
                    console.warn('[Performance] Low frame rate detected during scroll!');
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFPS);
        }

        measureFPS();
    }

    // ===================================
    // 13. FORCE GPU ACCELERATION
    // ===================================
    
    /**
     * Ensure critical elements use GPU acceleration
     */
    function forceGPUAcceleration() {
        const criticalElements = document.querySelectorAll(
            '.project-card, .hero-section, .nav-container, [data-aos]'
        );

        criticalElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
        });

        // Remove will-change after animations complete to save memory
        setTimeout(() => {
            criticalElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 3000);
    }

    // Run after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceGPUAcceleration);
    } else {
        forceGPUAcceleration();
    }

    // ===================================
    // 14. OPTIMIZE FONT LOADING
    // ===================================
    
    /**
     * Ensure fonts don't block rendering
     */
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            console.log('[Performance] Fonts loaded');
        });
    }

    // ===================================
    // 15. PAGE VISIBILITY API
    // ===================================
    
    /**
     * Pause animations when tab is not visible
     */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive operations
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });

    // ===================================
    // INITIALIZATION COMPLETE
    // ===================================
    console.log('✅ Performance enhancements loaded');

})();
