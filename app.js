// Pitch Deck JavaScript

class PitchDeck {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.slidesContainer = document.getElementById('slidesContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        
        this.init();
    }
    
    init() {
        // Set total slides
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Set background images for slides FIRST
        this.setupBackgroundImages();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize first slide
        this.updateSlide();
        
        // Preload critical images
        this.preloadImages();
        
        // Force setup CTA buttons after a delay
        setTimeout(() => {
            this.setupCTAButtons();
        }, 2000);
    }
    
    setupEventListeners() {
        // Navigation buttons - Enhanced click handling
        if (this.prevBtn && this.nextBtn) {
            // Remove any existing listeners
            this.prevBtn.onclick = null;
            this.nextBtn.onclick = null;
            
            // Add comprehensive event listeners
            ['click', 'mousedown', 'touchend'].forEach(eventType => {
                this.prevBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Previous button ${eventType}`);
                    this.previousSlide();
                    return false;
                });
                
                this.nextBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Next button ${eventType}`);
                    this.nextSlide();
                    return false;
                });
            });
            
            // Direct onclick handlers as backup
            this.prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct onclick previous');
                this.previousSlide();
                return false;
            };
            
            this.nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct onclick next');
                this.nextSlide();
                return false;
            };
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        let startX = null;
        let startY = null;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only handle horizontal swipes that are more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    setupBackgroundImages() {
        console.log('Setting up background images...');
        this.slides.forEach((slide, index) => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                console.log(`Setting background for slide ${index + 1}: ${bgImage}`);
                slide.style.backgroundImage = `url("${bgImage}")`;
                slide.style.backgroundSize = 'cover';
                slide.style.backgroundPosition = 'center';
                slide.style.backgroundRepeat = 'no-repeat';
            }
        });
    }
    
    setupCTAButtons() {
        // Find all CTA buttons in the last slide
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
        console.log('Setting up CTA buttons, found:', ctaButtons.length);
        
        if (ctaButtons.length === 0) {
            console.log('No CTA buttons found, retrying in 1 second...');
            setTimeout(() => this.setupCTAButtons(), 1000);
            return;
        }
        
        ctaButtons.forEach((button, index) => {
            console.log(`Setting up button ${index}: ${button.textContent}`);
            
            // Remove existing event listeners by cloning the button
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add comprehensive event listeners
            ['click', 'mousedown', 'touchend'].forEach(eventType => {
                newButton.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`CTA Button ${eventType}:`, newButton.textContent);
                    
                    if (newButton.textContent.includes('Schedule')) {
                        this.handleScheduleMeeting();
                    } else if (newButton.textContent.includes('Download')) {
                        this.handleDownloadProposal();
                    }
                    return false;
                });
            });
            
            // Direct onclick handler
            newButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct onclick CTA:', newButton.textContent);
                
                if (newButton.textContent.includes('Schedule')) {
                    this.handleScheduleMeeting();
                } else if (newButton.textContent.includes('Download')) {
                    this.handleDownloadProposal();
                }
                return false;
            };
        });
    }
    
    nextSlide() {
        console.log('NextSlide called, current:', this.currentSlide, 'total:', this.totalSlides);
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    previousSlide() {
        console.log('PreviousSlide called, current:', this.currentSlide);
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlide();
        }
    }
    
    updateSlide() {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.slides[this.currentSlide].classList.add('active');
        
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide + 1;
        
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update navigation button states
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.nextBtn.disabled = this.currentSlide === (this.totalSlides - 1);
            
            // Update button opacity for disabled state
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.nextBtn.style.opacity = this.currentSlide === (this.totalSlides - 1) ? '0.5' : '1';
        }
        
        // Add slide transition effects
        this.addSlideEffects();
        
        // Re-setup CTA buttons when on last slide
        if (this.currentSlide === this.totalSlides - 1) {
            setTimeout(() => {
                this.setupCTAButtons();
            }, 500);
        }
        
        // Track slide views (for analytics if needed)
        this.trackSlideView();
    }
    
    addSlideEffects() {
        const currentSlideElement = this.slides[this.currentSlide];
        
        // Add entrance animation to slide content
        const slideContent = currentSlideElement.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.animation = 'none';
            slideContent.offsetHeight; // Trigger reflow
            slideContent.style.animation = 'slideIn 0.6s ease-out';
        }
        
        // Add special effects for specific slides
        this.addSpecialSlideEffects();
    }
    
    addSpecialSlideEffects() {
        const slideIndex = this.currentSlide;
        
        // Title slide (slide 0) - Add typing effect to subtitle
        if (slideIndex === 0) {
            setTimeout(() => {
                const subtitle = document.querySelector('.hero-subtitle');
                if (subtitle) {
                    subtitle.style.animation = 'fadeInUp 0.8s ease-out 0.3s both';
                }
            }, 300);
        }
        
        // Market opportunity slide (slide 2) - Animate stats
        if (slideIndex === 2) {
            setTimeout(() => {
                this.animateCounters();
            }, 500);
        }
        
        // Financial projections slide (slide 13) - Animate revenue items
        if (slideIndex === 13) {
            setTimeout(() => {
                this.animateFinancialData();
            }, 500);
        }
        
        // CTA slide (slide 16) - Add pulse effect to buttons
        if (slideIndex === 16) {
            setTimeout(() => {
                const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
                ctaButtons.forEach((button, index) => {
                    button.style.animation = `pulse 2s infinite ${index * 0.2}s`;
                });
            }, 800);
        }
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-card h3');
        counters.forEach(counter => {
            const text = counter.textContent;
            const numberMatch = text.match(/[\d.,]+/);
            if (numberMatch) {
                const number = parseFloat(numberMatch[0].replace(/,/g, ''));
                if (!isNaN(number)) {
                    this.animateNumber(counter, 0, number, text);
                }
            }
        });
    }
    
    animateNumber(element, start, end, originalText) {
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;
            
            // Format number based on original text
            let formattedNumber;
            if (originalText.includes('Billion')) {
                formattedNumber = '₹' + (current / 1000).toFixed(2) + ' Billion';
            } else if (originalText.includes('%')) {
                formattedNumber = current.toFixed(1) + '%';
            } else if (originalText.includes('₹')) {
                formattedNumber = '₹' + current.toLocaleString('en-IN');
            } else {
                formattedNumber = Math.round(current).toLocaleString();
            }
            
            element.textContent = formattedNumber;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateFinancialData() {
        const revenueItems = document.querySelectorAll('.revenue-item');
        revenueItems.forEach((item, index) => {
            item.style.animation = `slideInLeft 0.6s ease-out ${index * 0.1}s both`;
        });
        
        const breakdownItems = document.querySelectorAll('.breakdown-item');
        breakdownItems.forEach((item, index) => {
            item.style.animation = `slideInRight 0.6s ease-out ${index * 0.1}s both`;
        });
    }
    
    preloadImages() {
        // Preload the key slide backgrounds for smooth transitions
        const imagesToPreload = [
            'https://pplx-res.cloudinary.com/image/upload/v1755678473/pplx_project_search_images/a9e0b5bf98829c2bd6fa08b78e95c3f6f3b88a9b.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/30e9b319ab461ef7afccecf2e254837405848c04.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/61ef954afa215de97865007ef38675960dfbf597.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755364454/pplx_project_search_images/263e65a631ddd5b906c50ed6e46fca1c7de832d1.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/a01b29b729ebec7d648c44b29513e1b077d2d1ac.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/ede51a7ec03a242ead790153307ec0a0f9503430.png'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => console.log(`Preloaded: ${src}`);
            img.onerror = () => console.error(`Failed to preload: ${src}`);
            img.src = src;
        });
    }
    
    trackSlideView() {
        // This could be used for analytics
        console.log(`Viewing slide ${this.currentSlide + 1}: ${this.getSlideTitle()}`);
    }
    
    getSlideTitle() {
        const currentSlideElement = this.slides[this.currentSlide];
        const titleElement = currentSlideElement.querySelector('.slide-title, .hero-title, .cta-title');
        return titleElement ? titleElement.textContent.trim() : `Slide ${this.currentSlide + 1}`;
    }
    
    handleScheduleMeeting() {
        console.log('Schedule meeting handler called');
        // Create a professional modal-like alert for scheduling
        const message = `🏨 Al Monsoon-Casa Riviera Investment Opportunity

Thank you for your interest in our boutique luxury resort project!

✅ MEETING REQUEST SUBMITTED

Our investment team will contact you within 24 hours to schedule a detailed presentation.

📋 PROJECT HIGHLIGHTS:
• Resort Name: Al Monsoon-Casa Riviera
• Investment: ₹15 Crores (Boutique Scale)
• Annual Revenue: ₹12.6 Crores
• ROI: 9-12% annually
• Timeline: 30 months to completion
• Location: Wayanad Backwaters, Kerala

🏖️ UNIQUE FEATURES:
• 4 Floating Cottages (First in Kerala)
• Japanese Modular Construction
• Tulah-inspired Wellness Center
• 16 Premium Accommodation Units
• Exclusive Clubhouse Membership

We look forward to discussing this exclusive boutique luxury resort opportunity with you!

Contact: Investment Relations Team
Email: investors@almonsoonriviera.com`;
        
        alert(message);
    }
    
    handleDownloadProposal() {
        console.log('Download proposal handler called');
        // Create a professional modal-like alert for downloading
        const message = `📄 Al Monsoon-Casa Riviera - Investment Proposal

✅ DOWNLOAD INITIATED

Your detailed investment proposal is being prepared...

📋 PROPOSAL CONTENTS:
• Executive Summary & Investment Overview
• Complete Financial Projections & ROI Analysis
• Detailed Architectural Plans & Renderings
• Market Research & Competitive Analysis
• Legal Structure & Investment Terms
• Development Timeline & Milestones
• Risk Assessment & Mitigation Strategies

🏨 BOUTIQUE PROJECT DETAILS:
• Investment Amount: ₹15 Crores
• Annual Revenue: ₹12.6 Crores
• 16 Premium Units (4 Floating Cottages)
• Japanese Modular Construction
• 15-acre Waterfront Property
• Tulah-inspired Wellness Center

📱 FILE DETAILS:
• Format: PDF Document
• Size: ~8MB
• Pages: 45+ detailed pages
• High-resolution renderings included

Thank you for your interest in Al Monsoon-Casa Riviera - Kerala's most exclusive boutique resort investment opportunity!

Download will complete in 3-5 seconds...`;
        
        alert(message);
        
        // In a real application, this would trigger an actual file download
        // For demo purposes, we'll simulate the download
        setTimeout(() => {
            console.log('✅ Al Monsoon-Casa Riviera proposal download completed');
        }, 2000);
    }
}

// CSS Animations for enhanced effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes glow {
        0% {
            box-shadow: 0 0 5px rgba(var(--color-primary-rgb), 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.8);
        }
        100% {
            box-shadow: 0 0 5px rgba(var(--color-primary-rgb), 0.5);
        }
    }
    
    .nav-btn:hover:not(:disabled) {
        animation: glow 2s ease-in-out infinite;
    }
    
    .slide-content {
        animation: slideIn 0.6s ease-out;
    }
    
    /* Smooth transitions for all interactive elements */
    .nav-btn,
    .btn,
    .concept-item,
    .benefit-card,
    .activity-card,
    .advantage-card {
        transition: all var(--duration-normal) var(--ease-standard);
    }
    
    /* Enhanced hover effects */
    .concept-item:hover,
    .benefit-card:hover,
    .activity-card:hover,
    .advantage-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
    
    /* Enhanced navigation button styles */
    .nav-btn {
        cursor: pointer !important;
        position: relative;
        z-index: 1001;
        pointer-events: auto !important;
    }
    
    .nav-btn:hover:not(:disabled) {
        transform: scale(1.1);
        animation: glow 2s ease-in-out infinite;
    }
    
    .nav-btn:active:not(:disabled) {
        transform: scale(0.95);
    }
    
    /* Enhanced CTA button styles */
    .cta-buttons .btn {
        cursor: pointer !important;
        position: relative;
        z-index: 10;
        pointer-events: auto !important;
    }
    
    .cta-buttons .btn:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.4);
    }
    
    .cta-buttons .btn:active {
        transform: scale(0.98);
    }
    
    /* Force background images to display */
    .slide[data-bg] {
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
    }
`;

document.head.appendChild(styleSheet);

// Initialize the pitch deck when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏨 Initializing Al Monsoon-Casa Riviera Pitch Deck...');
    
    // Wait for images to potentially load
    setTimeout(() => {
        const pitchDeck = new PitchDeck();
        
        // Make pitch deck instance globally available for debugging
        window.pitchDeck = pitchDeck;
        
        // Add keyboard shortcut hints
        console.log('🎮 Al Monsoon-Casa Riviera Pitch Deck Controls:');
        console.log('← → : Navigate slides');
        console.log('Space: Next slide');
        console.log('Home: First slide');
        console.log('End: Last slide');
        console.log('📱 Swipe left/right on mobile');
        
        console.log('✅ Al Monsoon-Casa Riviera pitch deck initialized successfully');
    }, 500);
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (window.pitchDeck && document.hidden) {
        console.log('Document hidden, stopping any auto-advance');
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    if (window.pitchDeck) {
        window.pitchDeck.updateSlide();
    }
});

// Prevent context menu on right-click for cleaner presentation
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Disable text selection for cleaner presentation
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Al Monsoon-Casa Riviera pitch deck error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`✅ Al Monsoon-Casa Riviera pitch deck loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }
        }, 0);
    });
}
