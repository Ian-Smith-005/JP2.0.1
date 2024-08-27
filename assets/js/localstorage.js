document.addEventListener('DOMContentLoaded', function() {
    const receiptCounter = document.getElementById('receiptCounter');
    const notificationList = document.getElementById('notificationList');
    const receiptContainer = document.getElementById('receiptContainer');

    // Check if receipts exist in local storage
    let receipts = JSON.parse(localStorage.getItem('receipts')) || [];

    // Update receipt counter and notifications list
    function updateNotifications() {
        receiptCounter.textContent = receipts.length;
        notificationList.innerHTML = '';

        if (receipts.length === 0) {
            notificationList.innerHTML = '<li class="text-center text-muted">No recent purchases</li>';
        } else {
            receipts.forEach((receipt, index) => {
                const notificationItem = document.createElement('li');
                notificationItem.classList.add('dropdown-item', 'notification-item');
                notificationItem.textContent = `${receipt.name} - ${receipt.service}`;
                notificationItem.dataset.index = index;

                notificationItem.addEventListener('click', function() {
                    displayReceipt(receipt);
                });

                notificationList.appendChild(notificationItem);
            });
        }
    }

    // Function to display the receipt when a notification is clicked
    function displayReceipt(receipt) {
        receiptContainer.innerHTML = `
            <div class="collapse-receipt">
                <div class="receipt-header">Receipt - TICKET #${receipt.ticketID}</div>
                <div><strong>Name:</strong> ${receipt.name.toUpperCase()}</div>
                <div><strong>Email:</strong> ${receipt.email}</div>
                <div><strong>Phone:</strong> ${receipt.phone}</div>
                <div><strong>Service:</strong> ${receipt.service}</div>
            </div>
        `;
    }

    // Function to handle form submission
    document.getElementById('orderForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value || 'Not provided';
        const phoneNumber = document.getElementById('phoneNumber').value;
        const serviceType = document.getElementById('serviceType').value;
        const location = document.getElementById('location').value;

        const receiptData = {
            name: fullName,
            email: email,
            phone: phoneNumber,
            service: serviceType,
            location: location,
            ticketID: Math.floor(100000 + Math.random() * 900000) // Generate random ticket ID
        };

        // Send data to the server to email the details
        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(receiptData)
        })
        .then(response => response.text())
        .then(data => {
            alert('Order submitted successfully!');

            // Store the receipt in local storage
            receipts.push(receiptData);
            localStorage.setItem('receipts', JSON.stringify(receipts));
            updateNotifications();

            // Optionally close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit the order.');
        });
    });

    // Initialize the notifications list on page load
    updateNotifications();
});
