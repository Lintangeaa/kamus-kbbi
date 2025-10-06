// JavaScript for Kamus KBBI

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Search form enhancement
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input[name="q"]');
        
        // Auto-focus search input
        searchInput.focus();
        
        // Search suggestions (mock data)
        const suggestions = [
            'bahasa', 'belajar', 'indonesia', 'kamus', 'kata', 'definisi',
            'arti', 'makna', 'sinonim', 'antonim', 'tata bahasa', 'gramatika'
        ];
        
        // Create suggestions dropdown
        let suggestionsDiv = null;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length > 0) {
                const matches = suggestions.filter(word => 
                    word.toLowerCase().includes(query)
                );
                
                if (matches.length > 0) {
                    showSuggestions(matches, this);
                } else {
                    hideSuggestions();
                }
            } else {
                hideSuggestions();
            }
        });
        
        function showSuggestions(matches, input) {
            hideSuggestions();
            
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'suggestions-dropdown';
            suggestionsDiv.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-top: none;
                border-radius: 0 0 10px 10px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            
            matches.forEach(match => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.style.cssText = `
                    padding: 10px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                `;
                item.textContent = match;
                
                item.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f8f9fa';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'white';
                });
                
                item.addEventListener('click', function() {
                    input.value = match;
                    hideSuggestions();
                    searchForm.submit();
                });
                
                suggestionsDiv.appendChild(item);
            });
            
            input.parentElement.style.position = 'relative';
            input.parentElement.appendChild(suggestionsDiv);
        }
        
        function hideSuggestions() {
            if (suggestionsDiv) {
                suggestionsDiv.remove();
                suggestionsDiv = null;
            }
        }
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                hideSuggestions();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Loading state for search form
    if (searchForm) {
        searchForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="loading"></span> Mencari...';
            submitBtn.disabled = true;
            
            // Re-enable after 3 seconds (fallback)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Copy to clipboard functionality for word definitions
    document.querySelectorAll('.definition').forEach(definition => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = 'Salin definisi';
        
        copyBtn.addEventListener('click', function() {
            const text = definition.querySelector('p').textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check text-success"></i>';
                this.classList.remove('btn-outline-secondary');
                this.classList.add('btn-success');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('btn-success');
                    this.classList.add('btn-outline-secondary');
                }, 2000);
            });
        });
        
        const definitionHeader = definition.querySelector('h6');
        if (definitionHeader) {
            definitionHeader.appendChild(copyBtn);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                hideSuggestions();
            }
        }
    });
    
    // Print functionality
    window.printPage = function() {
        window.print();
    };
    
    // Share functionality
    window.shareWord = function(word, definition) {
        if (navigator.share) {
            navigator.share({
                title: `Definisi kata "${word}"`,
                text: definition,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const text = `Definisi kata "${word}": ${definition}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Definisi telah disalin ke clipboard!');
            });
        }
    };
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
