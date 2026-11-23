// ============================================
// CampusTrace - Main JavaScript
// Simple JS only, no frameworks needed 😎
// ============================================

// --- Mobile Menu Toggle ---
function toggleMenu() {
    var navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// --- Scroll Animations ---
// This makes elements appear when you scroll to them
function handleScrollAnimations() {
    var elements = document.querySelectorAll('.slide-up');
    
    elements.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 80) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// --- Counter Animation for Stats ---
function animateCounter(element, target) {
    var current = 0;
    var increment = Math.ceil(target / 60);
    var timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current + "+";
    }, 30);
}

// Start counters when stats section is visible
var statsAnimated = false;

function checkStats() {
    if (statsAnimated) return;
    
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    var rect = statsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight - 100) {
        statsAnimated = true;
        
        var stat1 = document.getElementById('stat1');
        var stat2 = document.getElementById('stat2');
        var stat3 = document.getElementById('stat3');
        var stat4 = document.getElementById('stat4');
        
        if (stat1) animateCounter(stat1, 247);
        if (stat2) animateCounter(stat2, 189);
        if (stat3) animateCounter(stat3, 156);
        if (stat4) animateCounter(stat4, 15);
    }
}

window.addEventListener('scroll', checkStats);
window.addEventListener('load', checkStats);

// --- Navbar background on scroll ---
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// --- Search functionality (basic filter) ---
function searchItems() {
    var searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    var query = searchInput.value.toLowerCase();
    var cards = document.querySelectorAll('.item-card');
    
    cards.forEach(function(card) {
        var text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Filter tabs ---
function filterItems(category, button) {
    var cards = document.querySelectorAll('.item-card');
    var tabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    button.classList.add('active');
    
    // Filter cards
    cards.forEach(function(card) {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            var badge = card.querySelector('.item-badge');
            if (badge && badge.textContent.toLowerCase() === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// --- Form submission ---
function submitReport(event) {
    event.preventDefault();
    
    // Get form values
    var form = document.getElementById('reportForm');
    var formData = new FormData(form);
    
    // Simple validation
    var itemName = formData.get('itemName');
    var category = formData.get('category');
    var location = formData.get('location');
    var description = formData.get('description');
    var contact = formData.get('contact');
    
    if (!itemName || !category || !location || !description || !contact) {
        alert('Bro fill all the fields first! 😤');
        return;
    }
    
    // Save to localStorage (since we don't have a backend lol)
    var reports = JSON.parse(localStorage.getItem('campusTraceReports') || '[]');
    
    var newReport = {
        id: Date.now(),
        type: formData.get('type') || 'lost',
        itemName: itemName,
        category: category,
        location: location,
        date: formData.get('date') || new Date().toLocaleDateString(),
        description: description,
        contact: contact,
        name: formData.get('reporterName') || 'Anonymous',
        timestamp: new Date().toISOString()
    };
    
    reports.push(newReport);
    localStorage.setItem('campusTraceReports', JSON.stringify(reports));
    
    // Show success message
    form.style.display = 'none';
    var successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.classList.add('show');
    }
    
    console.log('Report submitted:', newReport);
}

// --- Load reported items from localStorage ---
function loadReportedItems(type) {
    var reports = JSON.parse(localStorage.getItem('campusTraceReports') || '[]');
    var container = document.getElementById('reportedItems');
    
    if (!container) return;
    
    // Filter by type if specified
    var filtered = type ? reports.filter(function(r) { return r.type === type; }) : reports;
    
    if (filtered.length === 0) return;
    
    // Add user-reported items to the grid
    filtered.reverse().forEach(function(item) {
        var card = document.createElement('div');
        card.className = 'item-card slide-up visible';
        
        var badgeClass = item.type === 'lost' ? 'lost-badge' : 'found-badge';
        var badgeText = item.type === 'lost' ? 'LOST' : 'FOUND';
        
        var categoryEmojis = {
            'electronics': '📱',
            'accessories': '👓',
            'documents': '📄',
            'clothing': '👕',
            'keys': '🔑',
            'bags': '🎒',
            'books': '📚',
            'other': '📦'
        };
        
        var emoji = categoryEmojis[item.category] || '📦';
        
        card.innerHTML = '<div class="item-badge ' + badgeClass + '">' + badgeText + '</div>' +
            '<div class="item-emoji">' + emoji + '</div>' +
            '<h3>' + item.itemName + '</h3>' +
            '<p class="item-location">📍 ' + item.location + '</p>' +
            '<p class="item-date">🕐 ' + item.date + '</p>' +
            '<p class="item-desc">' + item.description + '</p>' +
            '<p style="font-size: 13px; color: #00ff88;">📞 ' + item.contact + '</p>';
        
        container.appendChild(card);
    });
}

// --- Initialize page ---
window.addEventListener('load', function() {
    // Load items on lost/found pages
    var currentPage = window.location.pathname;
    
    if (currentPage.includes('lost')) {
        loadReportedItems('lost');
    } else if (currentPage.includes('found')) {
        loadReportedItems('found');
    }
});

// --- Close mobile menu when clicking a link ---
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.closest('.nav-links')) {
        var navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
    }
});

// --- Fun console message ---
console.log('%c🔍 CampusTrace', 'font-size: 30px; font-weight: bold; color: #00ff88;');
console.log('%cMade with ❤️ by CSE students @ LPU', 'font-size: 14px; color: #aaa;');
console.log('%cLost something? We got you fam! 🫡', 'font-size: 14px; color: #888;');
