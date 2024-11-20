// JavaScript to adjust button positions based on screen width

function adjustButtonPositions() {
    // Get the window width
    var windowWidth = window.innerWidth;

    // Get all the buttons
    var amazonButtons = document.querySelectorAll('.amazon-button-image');
    var paypalButtons = document.querySelectorAll('.paypal-button-image');
    var newButtons = document.querySelectorAll('.new-donation-button-image');

    // Adjust positions for Amazon buttons
    amazonButtons.forEach(function(button) {
        if (windowWidth > 800) {
            // For larger screens, apply original positions
            button.style.position = 'absolute';
            button.style.top = '-200px';
            button.style.left = '80px';
            button.style.transform = 'none';
            button.style.margin = '0';
            button.style.maxWidth = '15%'; // Control button size
        } else {
            // For smaller screens, reset positions to keep buttons visible
            button.style.position = 'relative';
            button.style.top = '0';
            button.style.left = '0';
            button.style.transform = 'none';
            button.style.margin = '20px auto';
            button.style.display = 'block';
            button.style.maxWidth = '25%'; // Control button size
        }
    });

    // Adjust positions for PayPal buttons
    paypalButtons.forEach(function(button) {
        if (windowWidth > 800) {
            // For larger screens, apply original positions
            button.style.position = 'absolute';
            button.style.top = '-200px'; // Adjusted to match your layout
            button.style.left = '80px';
            button.style.transform = 'none';
            button.style.margin = '0';
            button.style.maxWidth = '15%'; // Control button size
        } else {
            // For smaller screens, reset positions
            button.style.position = 'relative';
            button.style.top = '0';
            button.style.left = '0';
            button.style.transform = 'none';
            button.style.margin = '20px auto';
            button.style.display = 'block';
            button.style.maxWidth = '25%'; // Control button size
        }
    });

    // Adjust positions for new donation buttons
    newButtons.forEach(function(button) {
        if (windowWidth > 800) {
            button.style.position = '';
            button.style.top = '-210px'; // Adjust as needed
            button.style.left = '-400px'; // Adjust as needed
            button.style.right = '600px'; // Adjust as needed
            button.style.transform = 'none';
            button.style.margin = '10px auto';
            button.style.maxWidth = '25%'; // Control button size
        } else {
            button.style.position = 'relative';
            button.style.top = '0';
            button.style.left = '0';
            button.style.transform = 'none';
            button.style.margin = '20px auto';
            button.style.display = 'block';
            button.style.maxWidth = '25%';
        }
    });
}

// Call the function initially
adjustButtonPositions();

// Add event listener to adjust positions on window resize
window.addEventListener('resize', adjustButtonPositions);
