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
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set background images for slides
        this.setupBackgroundImages();
        
        // Initialize first slide
        this.updateSlide();
        
        // Preload critical images
        this.preloadImages();
    }
    
    setupEventListeners() {
        // Navigation buttons - Fix navigation issues
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        });
        
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
        
        // Remove click navigation on slides to prevent conflicts
        // this.slidesContainer.addEventListener('click', (e) => {
        //     // Removed to prevent conflicts with CTA buttons
        // });
        
        // CTA button interactions - Fix button behavior
        this.setupCTAButtons();
    }
    
    setupBackgroundImages() {
        this.slides.forEach(slide => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                slide.style.backgroundImage = `url("${bgImage}")`;
                slide.style.backgroundSize = 'cover';
                slide.style.backgroundPosition = 'center';
                slide.style.backgroundRepeat = 'no-repeat';
            }
        });
    }
    
    setupCTAButtons() {
        // Add event listeners to CTA buttons in the last slide
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent slide navigation
                
                if (button.textContent.includes('Schedule')) {
                    this.handleScheduleMeeting();
                } else if (button.textContent.includes('Download')) {
                    this.handleDownloadProposal();
                }
            });
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    previousSlide() {
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
        
        // Update progress bar - Fix progress bar calculation
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update navigation button states - Fix button state logic
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === (this.totalSlides - 1);
        
        // Update button opacity for disabled state
        this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentSlide === (this.totalSlides - 1) ? '0.5' : '1';
        
        // Add slide transition effects
        this.addSlideEffects();
        
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
        // Preload the next few slide backgrounds for smooth transitions
        const imagesToPreload = [
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/a25c146383166e6412f9b9ee8f83c2becf7e5f75.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/30e9b319ab461ef7afccecf2e254837405848c04.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/61ef954afa215de97865007ef38675960dfbf597.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755364454/pplx_project_search_images/263e65a631ddd5b906c50ed6e46fca1c7de832d1.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/a01b29b729ebec7d648c44b29513e1b077d2d1ac.png',
            'https://pplx-res.cloudinary.com/image/upload/v1755675368/pplx_project_search_images/ede51a7ec03a242ead790153307ec0a0f9503430.png'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
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
        // Create a professional modal-like alert for scheduling
        const message = `Thank you for your interest in the Wayanad Backwater Wellness Retreat!

Our investment team will contact you within 24 hours to schedule a detailed presentation.

Please ensure your contact information is available for our team to reach you.

Project Details:
• Investment Amount: ₹15 Crores
• Expected ROI: 9-12% annually
• Construction Timeline: 20 months

We look forward to discussing this exclusive opportunity with you.`;
        
        alert(message);
        console.log('Schedule meeting request submitted for Wayanad Backwater Wellness Retreat');
    }
    
    handleDownloadProposal() {
        // Create a professional modal-like alert for downloading
        const message = `Wayanad Backwater Wellness Retreat - Detailed Investment Proposal

Your download will begin shortly. The proposal includes:

• Complete financial projections and ROI analysis
• Detailed architectural plans and renderings
• Market research and competitive analysis
• Legal structure and investment terms
• Development timeline and milestones
• Risk assessment and mitigation strategies

File Size: ~15MB
Format: PDF Document

Thank you for your interest in this exclusive investment opportunity.`;
        
        alert(message);
        console.log('Download proposal request submitted for Wayanad Backwater Wellness Retreat');
        
        // In a real application, this would trigger an actual file download
        // For demo purposes, we'll simulate the download
        setTimeout(() => {
            console.log('Proposal download completed');
        }, 2000);
    }
    
    // Auto-advance functionality (optional)
    startAutoAdvance(intervalMs = 30000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.stopAutoAdvance();
            }
        }, intervalMs);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    // Fullscreen toggle
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
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
    
    /* Loading state for slides */
    .slide.loading {
        background-color: var(--color-slate-900);
    }
    
    .slide.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
        border: 3px solid var(--color-primary);
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        z-index: 10;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    /* Ensure progress bar is visible */
    .progress-bar {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 4px !important;
        background: rgba(var(--color-slate-900-rgb), 0.3) !important;
        z-index: 1000 !important;
        display: block !important;
    }
    
    .progress-fill {
        height: 100% !important;
        background: linear-gradient(90deg, var(--color-primary), var(--color-teal-300)) !important;
        transition: width var(--duration-normal) var(--ease-standard) !important;
        display: block !important;
    }
`;

document.head.appendChild(styleSheet);

// Initialize the pitch deck when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pitchDeck = new PitchDeck();
    
    // Make pitch deck instance globally available for debugging
    window.pitchDeck = pitchDeck;
    
    // Add keyboard shortcut hints
    console.log('Pitch Deck Controls:');
    console.log('← → : Navigate slides');
    console.log('Space: Next slide');
    console.log('Home: First slide');
    console.log('End: Last slide');
    console.log('Swipe left/right on mobile');
    
    // Optional: Start auto-advance after a delay (uncomment if desired)
    // setTimeout(() => {
    //     pitchDeck.startAutoAdvance(45000); // 45 seconds per slide
    // }, 10000);
});

// Handle visibility change to pause auto-advance when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (window.pitchDeck) {
        if (document.hidden) {
            window.pitchDeck.stopAutoAdvance();
        }
        // Auto-advance can be restarted manually if needed
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Recalculate layouts if needed
    if (window.pitchDeck) {
        // Force a layout recalculation
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
    console.error('Pitch deck error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Pitch deck loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}
