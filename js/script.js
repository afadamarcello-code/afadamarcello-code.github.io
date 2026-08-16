/* ==========================================================================
   CRASH COURSE: JAVASCRIPT BASICS
   ==========================================================================

   JavaScript (JS) makes web pages interactive.

   KEY CONCEPTS:
   1. document = the entire HTML page
   2. querySelector() = finds an element (like CSS selectors)
   3. addEventListener() = "when X happens, do Y"
   4. style.property = changes CSS directly

   COMPARISON WITH PYTHON:

   Python:          JavaScript:
   def func():      function func() {
     pass             // code
                    }

   list[0]          array[0]
   dict['key']      object.key or object['key']
   print(x)         console.log(x)
   True/False       true/false
   None             null

   SIMILARITIES:
   - Variables: let x = 5; (like x = 5)
   - If statements: if (x > 0) { ... }
   - For loops: for (let i = 0; i < 10; i++) { ... }
   - Functions: function name() { ... }
*/

/* ==========================================================================
   FEATURE 1: MOUSE-FOLLOWING ORBS
   ==========================================================================

   We listen for "mousemove" events (every time mouse moves).
   We calculate mouse position and move each orb toward it,
   but with different speeds so they lag behind each other.
*/

// Select all orb elements (returns a list like Python list)
const orbs = document.querySelectorAll('.orb');

/* 
   let = declares a variable that CAN change (like Python variable).
   const = declares a variable that NEVER changes (like Python constant).

   mouseX, mouseY = where the cursor currently is.
   orbPositions = stores each orb's current position.
*/
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Initialize orb positions (center of screen)
const orbPositions = Array.from(orbs).map(() => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
}));

/*
   Array.from(orbs) = converts the orb list to a real array.
   .map() = transforms each item (like Python's map()).
   () => ({}) = arrow function (like Python lambda).

   This creates: [{x: 500, y: 400}, {x: 500, y: 400}, {x: 500, y: 400}]
*/

// Listen for mouse movement on the entire document
document.addEventListener('mousemove', (event) => {
  /*
     event = object containing info about the mouse event.
     event.clientX = horizontal pixel position of cursor.
     event.clientY = vertical pixel position of cursor.
  */
  mouseX = event.clientX;
  mouseY = event.clientY;
});

/*
   ANIMATION LOOP
   We use requestAnimationFrame for smooth 60fps animation.
   This is better than setInterval because it syncs with the screen refresh.

   Think of it like a game loop: update positions, then draw.
*/
function animateOrbs() {
  orbs.forEach((orb, index) => {
    /*
       LERP (Linear Interpolation) = smooth movement.
       Instead of jumping to mouse position, we move 5% closer each frame.

       Formula: current = current + (target - current) * speed

       Each orb has a different speed:
       - Orb 0: 5% speed (follows closest)
       - Orb 1: 3% speed (lags behind)
       - Orb 2: 2% speed (lags furthest)
    */
    const speed = 0.05 - (index * 0.015);

    // Update stored position
    orbPositions[index].x += (mouseX - orbPositions[index].x) * speed;
    orbPositions[index].y += (mouseY - orbPositions[index].y) * speed;

    // Apply to element (subtract half size to center orb on cursor)
    const orbSize = 400;  // Approximate orb size
    orb.style.transform = `translate(
      ${orbPositions[index].x - orbSize / 2}px, 
      ${orbPositions[index].y - orbSize / 2}px
    )`;
    /*
       template literals = strings with ${variables} inside.
       Like Python f-strings: f"translate({x}px, {y}px)"
    */
  });

  // Call this function again on next frame (infinite loop)
  requestAnimationFrame(animateOrbs);
}

// Start the animation
animateOrbs();

/* ==========================================================================
   FEATURE 2: ACCORDION (Expandable Skill Sections)
   ==========================================================================

   When you click a skill header, it toggles the "active" class.
   CSS handles the visual change (max-height, arrow rotation).
*/

// Select all accordion headers
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    /*
       this = the header that was clicked.
       .parentElement = the <div class="accordion-item"> containing this header.
       .classList = list of CSS classes on that element.
       .toggle('active') = add class if missing, remove if present.
    */
    const item = header.parentElement;

    // Check if this item is already active
    const isActive = item.classList.contains('active');

    // Close ALL items first (optional: comment this out to allow multiple open)
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('active');
    });

    // If this item wasn't active, open it
    if (!isActive) {
      item.classList.add('active');
    }
    /*
       This creates "accordion" behavior: only one open at a time.
       If you want multiple open, remove the forEach loop above.
    */
  });
});

/* ==========================================================================
   FEATURE 3: ACTIVE NAVIGATION HIGHLIGHT
   ==========================================================================

   Highlights the current page in the nav bar.
   Compares each link's href with the current URL.
*/

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
/*
   window.location.pathname = "/data-science.html"
   .split('/') = ['', 'data-science.html']
   .pop() = "data-science.html" (last item)
   || 'index.html' = if empty, default to index.html
*/

document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

/* ==========================================================================
   FEATURE 4: SCROLL REVEAL (Elements fade in as you scroll)
   ==========================================================================

   Uses Intersection Observer API: watches when elements enter viewport.
   Much more efficient than scroll event listeners.
*/

const observerOptions = {
  threshold: 0.1,      // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px'  // Slightly before element enters
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);  // Stop watching once revealed
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Add CSS for revealed state via JS
document.head.insertAdjacentHTML('beforeend', `
  <style>
    section.revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);

/* ==========================================================================
   CONSOLE GREETING (Easter Egg for Developers)
   ==========================================================================

   Open browser console (F12 → Console) to see this.
   Hiring managers sometimes check console logs.
*/

console.log('%c👋 Hey there, recruiter!', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cI built this portfolio from scratch with HTML, CSS, and JavaScript.', 'font-size: 14px; color: #a0a0b0;');
console.log('%cCheck out my projects at https://github.com/afadamarcello-code', 'font-size: 12px; color: #6b6b7b;');
