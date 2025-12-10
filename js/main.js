/**
 * Modern Portfolio JavaScript
 * Author: Hadi Hannawi
 * Description: Interactive functionality for portfolio website
 */

// ===================================
// Global State & Configuration
// ===================================
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 80,
    counterSpeed: 2000,
    formSubmitEndpoint: 'hadi.hennawi2005@gmail.com' // Email for form submissions
};

// ===================================
// Utility Functions
// ===================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// ===================================
// Navigation
// ===================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('navMenu');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll behavior
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
        
        // Mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-wrapper')) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
        
        // Update active nav link
        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + CONFIG.scrollOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu?.classList.toggle('active');
        this.mobileMenuBtn?.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.navMenu?.classList.remove('active');
        this.mobileMenuBtn?.classList.remove('active');
    }
    
    handleNavClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - CONFIG.scrollOffset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        this.closeMobileMenu();
    }
}

// ===================================
// Scroll to Top Button
// ===================================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTopBtn');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 100));
        this.button?.addEventListener('click', () => this.scrollToTop());
    }
    
    handleScroll() {
        if (window.scrollY > 300) {
            this.button?.classList.add('visible');
        } else {
            this.button?.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===================================
// Counter Animation
// ===================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Initial check
        this.checkCounters();
        
        // Check on scroll
        window.addEventListener('scroll', debounce(() => this.checkCounters(), 100));
    }
    
    checkCounters() {
        this.counters.forEach(counter => {
            if (this.isElementInViewport(counter) && !this.animated.has(counter)) {
                this.animateCounter(counter);
                this.animated.add(counter);
            }
        });
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = CONFIG.counterSpeed;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ===================================
// Scroll Animations (AOS Alternative)
// ===================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        // Initial check
        this.checkElements();
        
        // Check on scroll
        window.addEventListener('scroll', debounce(() => this.checkElements(), 50));
    }
    
    checkElements() {
        this.elements.forEach(element => {
            if (this.isElementInViewport(element) && !this.animated.has(element)) {
                this.animateElement(element);
                this.animated.add(element);
            }
        });
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    animateElement(element) {
        const delay = element.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
            element.classList.add('aos-animate');
        }, parseInt(delay));
    }
}

// ===================================
// Contact Form
// ===================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusElement = document.getElementById('formStatus');
        this.submitButton = null;
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('.btn-submit');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Update UI
        if (!isValid) {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
        } else {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showStatus('Please fill in all required fields correctly', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission (in production, this would send to a backend or email service)
            await this.submitForm(data);
            
            // Success
            this.showStatus('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            this.form.reset();
        } catch (error) {
            // Error
            this.showStatus('Oops! Something went wrong. Please try again or email me directly at hadi.hennawi2005@gmail.com', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitForm(data) {
        // In a production environment, you would send this to your backend or use a service like Formspree
        // For now, we'll create a mailto link as a fallback
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Create mailto link
                const subject = encodeURIComponent(data.subject);
                const body = encodeURIComponent(
                    `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
                );
                const mailtoLink = `mailto:${CONFIG.formSubmitEndpoint}?subject=${subject}&body=${body}`;
                
                // Open default email client
                window.location.href = mailtoLink;
                
                resolve();
            }, 1000);
        });
    }
    
    setLoadingState(isLoading) {
        const btnText = this.submitButton.querySelector('.btn-text');
        const btnLoading = this.submitButton.querySelector('.btn-loading');
        
        if (isLoading) {
            this.submitButton.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            this.submitButton.disabled = false;
            btnText.style.display = 'inline-flex';
            btnLoading.style.display = 'none';
        }
    }
    
    showStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type}`;
        this.statusElement.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.statusElement.style.display = 'none';
        }, 10000);
    }
}

// ===================================
// Skill Bars Animation
// ===================================
class SkillBarsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.pro-skill-fill');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        if (this.skillBars.length === 0) return;
        
        // Initial check
        this.checkSkillBars();
        
        // Check on scroll
        window.addEventListener('scroll', debounce(() => this.checkSkillBars(), 100));
    }
    
    checkSkillBars() {
        this.skillBars.forEach(bar => {
            if (this.isElementInViewport(bar) && !this.animated.has(bar)) {
                this.animateBar(bar);
                this.animated.add(bar);
            }
        });
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * 0.85
        );
    }
    
    animateBar(bar) {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    }
}

// ===================================
// Project Links Handler
// ===================================
class ProjectLinks {
    constructor() {
        this.init();
    }
    
    init() {
        // Track clicks on project links
        const projectLinks = document.querySelectorAll('.project-link, .project-links a');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const projectTitle = link.closest('.project-card')?.querySelector('.project-title')?.textContent;
                console.log(`Project link clicked: ${projectTitle}`);
            });
        });
    }
}

// ===================================
// Performance Monitoring
// ===================================
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
                
                // Check if load time is acceptable
                if (pageLoadTime > 3000) {
                    console.warn('⚠️ Page load time exceeds 3 seconds. Consider optimizing assets.');
                }
            }
        });
    }
}

// ===================================
// Lazy Loading Images
// ===================================
class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }
    
    init() {
        // Modern browsers support native lazy loading
        // This is just for additional optimization
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ===================================
// Smooth Scroll for Hash Links
// ===================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Console Easter Egg
// ===================================
class ConsoleEasterEgg {
    constructor() {
        this.init();
    }
    
    init() {
        const styles = [
            'background: linear-gradient(135deg, #2563eb, #8b5cf6)',
            'color: white',
            'padding: 10px 20px',
            'border-radius: 8px',
            'font-weight: bold',
            'font-size: 14px'
        ].join(';');
        
        console.log('%c👋 Hi there, fellow developer!', styles);
        console.log('%cLiked what you see? Let\'s work together!', 'color: #2563eb; font-size: 12px; font-weight: bold;');
        console.log('%c📧 hadi.hennawi2005@gmail.com', 'color: #6b7280; font-size: 12px;');
        console.log('%c🔗 https://github.com/hadi-hannawi1', 'color: #6b7280; font-size: 12px;');
    }
}

// ===================================
// Initialize All Components
// ===================================
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        console.log('🚀 Initializing Hadi Hannawi Portfolio...');
        
        // Initialize all components
        new Navigation();
        new ScrollToTop();
        new CounterAnimation();
        new ScrollAnimations();
        new ContactForm();
        new SkillBarsAnimation();
        new ProjectLinks();
        new PerformanceMonitor();
        new LazyLoadImages();
        new SmoothScroll();
        new ConsoleEasterEgg();
        
        console.log('✅ Portfolio initialized successfully!');
    }
}

// Start the application
new App();