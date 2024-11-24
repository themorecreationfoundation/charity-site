// JavaScript to adjust button positions based on screen width

function adjustButtonPositions() {
    // Get all the buttons
    var amazonButtons = document.querySelectorAll('.amazon-button-image');
    var paypalButtons = document.querySelectorAll('.paypal-button-image');
    var newButtons = document.querySelectorAll('.new-donation-button-image');

    // Combine all buttons into one NodeList
    var allButtons = [...amazonButtons, ...paypalButtons, ...newButtons];

    // Apply consistent styling to all buttons
    allButtons.forEach(function(button) {
        button.style.position = 'relative';
        button.style.top = '0';
        button.style.left = '0';
        button.style.transform = 'none';
        button.style.margin = '20px 0';
        button.style.display = 'block';
        button.style.maxWidth = '20%'; // Adjust button size as needed
    });
}

// Call the function initially
adjustButtonPositions();

// Add event listener to adjust positions on window resize
window.addEventListener('resize', adjustButtonPositions);
