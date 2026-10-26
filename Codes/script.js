//Login/Register/Logout Page
// Helper to toggle views
function toggleView(idToShow) {
  const forms = ['loginForm', 'registerForm', 'resetForm', 'welcome'];
  forms.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(idToShow).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const firstName = document.getElementById('registerFirstName').value;
            const lastName = document.getElementById('registerLastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('userLastName', lastName);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);

            alert('Registration successful. You can now log in.');
            toggleView('loginForm');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const savedEmail = localStorage.getItem('userEmail');
            const savedPassword = localStorage.getItem('userPassword');

            if (email === savedEmail && password === savedPassword) {
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const resetEmail = document.getElementById('resetEmail').value;
            const savedEmail = localStorage.getItem('userEmail');

            if (resetEmail === savedEmail) {
                alert('Password reset link sent to your email (simulated)');
                toggleView('loginForm');
            } else {
                alert('Email not found in system.');
            }
        });
    }
});

//logout
function logout() {
  document.getElementById('userEmail').textContent = '';
  toggleView('loginForm');
}

// Rental Cost calculation
const carInput =
    document.getElementById("car");

const startDateInput =
    document.getElementById("startDate");

const endDateInput =
    document.getElementById("endDate");

const estimatedCost =
    document.getElementById("estimatedCost");

function calculateCost() {

    if (
        !carInput ||
        !startDateInput ||
        !endDateInput
    ) {
        return;
    }


    const car =
        carInput.value;

    const startDate =
        new Date(startDateInput.value);

    const endDate =
        new Date(endDateInput.value);


    if (
        car === "" ||
        isNaN(startDate) ||
        isNaN(endDate)
    ) {

        estimatedCost.textContent =
            "Please select a car and dates.";

        return;
    }


    const timeDifference =
        endDate - startDate;


    const days =
        Math.ceil(
            timeDifference /
            (1000 * 60 * 60 * 24)
        );


    if (days <= 0) {

        estimatedCost.textContent =
            "Return date must be after pickup date.";

        return;
    }


    const dailyRate =
        carPrices[car];


    const total =
        days * dailyRate;


    estimatedCost.textContent =
        days +
        " day(s) × $" +
        dailyRate +
        " = $" +
        total;
}


if (carInput) {
    carInput.addEventListener(
        "change",
        calculateCost
    );
}

if (startDateInput) {
    startDateInput.addEventListener(
        "change",
        calculateCost
    );
}

if (endDateInput) {
    endDateInput.addEventListener(
        "change",
        calculateCost
    );
}

//Get selected car
const urlParams =
    new URLSearchParams(window.location.search);

const selectedCar =
    urlParams.get("car");

const carSelect =
    document.getElementById("car");


if (selectedCar && carSelect) {

    carSelect.value = selectedCar;

}

const reservationForm =
    document.getElementById(
        "reservationForm"
    );

//Reservation Page
document.addEventListener("DOMContentLoaded", function () {

    // Get the elements
    const form = document.getElementById("reservationsForm");
    const carSelect = document.getElementById("car");
    const pickUpInput = document.getElementById("pickUp");
    const returnInput = document.getElementById("return");

    const selectedCar = document.getElementById("selected-car");
    const dailyPrice = document.getElementById("daily-price");
    const weeklyPrice = document.getElementById("weekly-price");
    const monthlyPrice = document.getElementById("monthly-price");

    if (!form || !carSelect || !pickUpInput || !returnInput) {
        return;
    }

    // Store the prices of each car
    const cars = {
        "Tesla Model 3": {
            daily: 70,
            weekly: 400,
            monthly: 1500
        },
        "BYD Seal": {
            daily: 65,
            weekly: 390,
            monthly: 1400
        },
        "Hyundai Ioniq 5": {
            daily: 75,
            weekly: 480,
            monthly: 1600
        },
        "Mercedes": {
            daily: 60,
            weekly: 350,
            monthly: 1450
        }
    };

    // Display the selected car and its prices
    function updateCarDetails() {
        const carName = carSelect.value;

        if (cars[carName]) {
            selectedCar.textContent = carName;
            dailyPrice.textContent = cars[carName].daily;
            weeklyPrice.textContent = cars[carName].weekly;
            monthlyPrice.textContent = cars[carName].monthly;
        } else {
            selectedCar.textContent = "No car selected";
            dailyPrice.textContent = "-";
            weeklyPrice.textContent = "-";
            monthlyPrice.textContent = "-";
        }
    }

    // Load the car selected from rent page, if available
    const savedCar = localStorage.getItem("selectedCar");

    if (savedCar && cars[savedCar]) {
        carSelect.value = savedCar;
    }

    //Display the initial car details
    updateCarDetails();

    //Update the prices whenever the customer changes cars
    carSelect.addEventListener("change", function () {
        updateCarDetails();
    });

    //Prevent selecting a return date before the pickup date
    pickUpInput.addEventListener("change", function () {
        returnInput.min = pickUpInput.value;

        if (returnInput.value &&
            returnInput.value < pickUpInput.value) {
            returnInput.value = "";
        }
    });

    //Set the minimum pickup date to today
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    pickUpInput.min = localToday;
    returnInput.min = localToday;

    //Calculate rental cost
    function calculateRentalCost(car, days) {
        let total = 0;

        // Use monthly rates for complete 30-day periods
        const months = Math.floor(days / 30);
        total += months * car.monthly;
        days = days % 30;

        // Use weekly rates for complete 7-day periods
        const weeks = Math.floor(days / 7);
        total += weeks * car.weekly;
        days = days % 7;

        // Charge the daily rate for remaining days
        total += days * car.daily;

        return total;
    }

    // Confirm the reservation
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const invalidField = form.querySelector(":invalid");

        if (invalidField) {
            const label = form.querySelector(`label[for="${invalidField.id}"]`);
            const fieldName = label
                ? label.textContent.trim().replace(/:$/, "")
                : "Field";
            let errorMessage = invalidField.validationMessage;

            if (invalidField.validity.valueMissing) {
                errorMessage = "This field is required.";
            } else if (invalidField.validity.typeMismatch) {
                errorMessage = "Enter a valid email address.";
            } else if (invalidField.validity.patternMismatch) {
                errorMessage = invalidField.id === "cardNumber"
                    ? "Enter exactly 16 digits."
                    : "Enter exactly 3 digits.";
            }

            alert(`${fieldName}: ${errorMessage}`);
            invalidField.focus();
            return;
        }

        const carName = carSelect.value;
        const branch = document.getElementById("branch").value;
        const pickupDate = pickUpInput.value;
        const returnDate = returnInput.value;

        // Check that a car and branch have been selected
        if (!cars[carName]) {
            alert("Please select a car.");
            return;
        }
        if (!branch) {
            alert("Please select a collection branch.");
            return;
        }
        // Check the rental dates
        if (!pickupDate || !returnDate ||
            returnDate <= pickupDate) {
            alert("Please select valid pickup and return dates. The return date must be after the pickup date.");
            return;
        }

        // Calculate the number of rental days
        const start = new Date(pickupDate + "T00:00:00");
        const end = new Date(returnDate + "T00:00:00");

        const days = Math.round(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        const total = calculateRentalCost(cars[carName], days);

        const bookingNumber = `AZR${Date.now()}`;
        const cardNumber = document.getElementById("cardNumber").value;

        // Save reservation details without storing the card number or CVV
        const booking = {
            bookingNumber: bookingNumber,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phoneNum: document.getElementById("phoneNum").value,
            car: carName,
            branch: branch,
            pickupDate: pickupDate,
            returnDate: returnDate,
            rentalDays: days,
            totalCost: total,
            paymentCardLast4: cardNumber.slice(-4),
            paymentStatus: "pending"
        };

        localStorage.setItem(
            "reservation",
            JSON.stringify(booking)
        );

        // Redirect to the booking details page
        window.location.href = "bookingDetails.html";
    });
});

//Rent page
document.addEventListener("DOMContentLoaded", function () {
    const reserveButtons = document.querySelectorAll(".reserve-btn");
    reserveButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const carName = button.dataset.car;
            const dailyPrice = button.dataset.daily;
            const weeklyPrice = button.dataset.weekly;
            const monthlyPrice = button.dataset.monthly;

            localStorage.setItem("selectedCar", carName);
            localStorage.setItem("dailyPrice", dailyPrice);
            localStorage.setItem("weeklyPrice", weeklyPrice);
            localStorage.setItem("monthlyPrice", monthlyPrice);
        });

    });

});

//Display Booking
const bookingDetails =
    document.getElementById(
        "bookingDetails"
    );


if (bookingDetails) {

    const savedBooking =
        localStorage.getItem(
            "booking"
        );
    if (savedBooking) {

        const booking =
            JSON.parse(savedBooking);

        bookingDetails.innerHTML = `

            <div class="price-box">

                <h2> Booking ${booking.bookingNumber}</h2>
                    <p><strong>Customer:</strong>${booking.name}</p>
                    <p><strong>Car:</strong>${booking.car}</p>
                    <p><strong>Pickup Branch:</strong>${booking.branch}</p>
                    <p><strong>Pickup Date:</strong>${booking.startDate}</p>
                    <p><strong>Return Date:</strong>${booking.endDate}</p>
                    <p><strong>Rental Period:</strong>${booking.days} day(s)</p>
                    <p><strong>Estimated Cost:</strong>$${booking.total}</p>
                    <p><strong>Status:</strong>Confirmed</p>
            </div>

            <a href="c:\Users\Ying Xi\OneDrive\Desktop\SIM (UOW)\ISIT207 (Frontend Web Programming)\Assignment\A2\Codes\return.html" 
                class="btn"> Return Car </a>
        `;
    }
}

//Return car
document.addEventListener("DOMContentLoaded", function () {
    const returnForm = document.getElementById("returnForm");
    const finalBillDiv = document.getElementById("finalBill");

    if (!returnForm || !finalBillDiv) {
        return;
    }

    returnForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredBookingNumber = document
            .getElementById("bookingNumber")
            .value
            .trim()
            .toUpperCase();
        const savedBooking = localStorage.getItem("reservation");

        if (!savedBooking) {
            alert("No active reservation was found.");
            return;
        }

        const booking = JSON.parse(savedBooking);

        if (enteredBookingNumber !== booking.bookingNumber.toUpperCase()) {
            alert("Booking number not found. Check the number on your booking confirmation.");
            return;
        }

        if (booking.paymentStatus === "paid") {
            alert("This booking has already been charged.");
            return;
        }

        finalBillDiv.innerHTML = `
            <h2>Final Bill</h2>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Car:</strong> ${booking.car}</p>
            <p><strong>Rental Cost:</strong> $${booking.totalCost.toFixed(2)}</p>
            <p><strong>Charge to card ending:</strong> ${booking.paymentCardLast4}</p>
            <hr>
            <h3>Final Total: $${booking.totalCost.toFixed(2)}</h3>
        `;

        const payButton = document.createElement("button");
        payButton.className = "btn";
        payButton.type = "button";
        payButton.textContent = "Confirm Payment";
        payButton.addEventListener("click", function () {
            booking.paymentStatus = "paid";
            booking.paidAt = new Date().toISOString();
            localStorage.setItem("reservation", JSON.stringify(booking));

            finalBillDiv.innerHTML = `
                <h2>Payment Complete</h2>
                <p>Charge of $${booking.totalCost.toFixed(2)} to card ending in ${booking.paymentCardLast4}.</p>
                <p>Booking ${booking.bookingNumber} is now marked as paid.</p>
            `;
        });

        finalBillDiv.appendChild(payButton);
    });
});

