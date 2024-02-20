//grab the necessary DOM elements
const form = document.querySelector('form');
const jobRoleSelect = document.querySelector('#title');
const otherJobRoleSelect = document.querySelector('.other-job-role');
const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');
const colorOptions = colorSelect.options;
const firstJsPunsOptionIndex = document.querySelector('[data-theme="js puns"]').index;
const firstHeartJSOptionIndex = document.querySelector('[data-theme="heart js"]').index;
const activitiesFieldset = document.querySelector('#activities');
const activityCheckboxes = activitiesFieldset.querySelectorAll('input[type="checkbox"]');
const totalActivitiesCostElement = document.querySelector('#activities-cost');
let totalActivitiesCost = 0;
const paymentSelect = document.querySelector('#payment');
const creditCartField = document.querySelector('#credit-card');
const payPalSelect = document.querySelector('#paypal');
const bitcoinSelect = document.querySelector('#bitcoin');

//conditional instead of simply a hint because this hint gets conditionally changed to a custom error message/hint 
const conditionalEmailErrorMessage = document.querySelector('#email-hint');

const activitiesHint = document.querySelector('#activities-hint');

//input elements
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const creditCardNumberInput = document.querySelector('#cc-num');
const zipCodeInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');

//regular expressions for validation
const nameRegex = /^(\w+ ?)+$/;
const emailRegex = /^[^@]+@[^@.]+\.[a-zA-Z]+$/;
const creditCardRegex = /^\d{13,16}$/;
const zipCodeRegex = /^\d{5}$/;
const cvvRegex = /^\d{3}$/;

//helper functions to show and hide, disable and enable elements, hints and messages or check for validity or to make 
//the code more readable
const isCreditCardSelected = () => paymentSelect.value === 'credit-card';
const hideElement = (element) => {
    element.hidden = true;
    element.disabled = true;
}
const showElement = (element) => {
    element.hidden = false;
    element.disabled = false;
}
const toggleValidityMessage = (element, action) => {
    if (action === 'show') {
        element.nextElementSibling.style.display = 'block';
    } else {
        element.nextElementSibling.style.display = 'none';
    }
}

const addInvalidityHint = (element) => {
    element.parentNode.classList.add('not-valid');
    element.parentNode.classList.remove('valid');
}
const removeInvalidityHint = (element) => {
    element.parentNode.classList.remove('not-valid');
    element.parentNode.classList.add('valid');
}

const isValid = (element, regex) => {
    const isInputValid = regex.test(element.value);
    isInputValid ? removeInvalidityHint(element) : addInvalidityHint(element);
    isInputValid ? toggleValidityMessage(element, 'hide') : toggleValidityMessage(element, 'show');
    return isInputValid;
};

const atLeastOneActivitySelected = () => activitiesFieldset.querySelectorAll('[type="checkbox"]:checked').length > 0;

//initial state
hideElement(otherJobRoleSelect);
hideElement(payPalSelect);
hideElement(bitcoinSelect);
paymentSelect.selectedIndex = 1;

jobRoleSelect.addEventListener('change', () => {
    if (jobRoleSelect.value === 'other') {
        otherJobRoleSelect.hidden = false;
        otherJobRoleSelect.disabled = false;
    } else if (!otherJobRoleSelect.hidden) {
        otherJobRoleSelect.hidden = true;
        otherJobRoleSelect.disabled = true;
    }
});


designSelect.addEventListener('change', () => {
    colorSelect.removeAttribute('disabled');
    if (designSelect.value === 'heart js') {
        colorSelect.selectedIndex = firstHeartJSOptionIndex;
        for (let i = 0; i < colorOptions.length; i++) {
            if (colorOptions[i].dataset.theme === 'js puns') {
                hideElement(colorOptions[i]);
            } else if (colorOptions[i].dataset.theme === 'heart js') {
                showElement(colorOptions[i]);
            }
        }
    } else if (designSelect.value === 'js puns') {
        colorSelect.selectedIndex = firstJsPunsOptionIndex;
        for (let i = 0; i < colorOptions.length; i++) {
            if (colorOptions[i].dataset.theme === 'heart js') {
                hideElement(colorOptions[i]);
            } else if (colorOptions[i].dataset.theme === 'js puns') {
                showElement(colorOptions[i]);
            }
        }
    }

});


activitiesFieldset.addEventListener('change', (e) => {
    const price = parseInt(e.target.dataset.cost);
    e.target.checked ? totalActivitiesCost += price : totalActivitiesCost -= price;
    totalActivitiesCostElement.innerText = `Total: $${totalActivitiesCost}`
})


paymentSelect.addEventListener('change', () => {
    if (paymentSelect.value === 'paypal') {
        showElement(payPalSelect);
        hideElement(creditCartField);
        hideElement(bitcoinSelect);
    } else if (paymentSelect.value === 'bitcoin') {
        showElement(bitcoinSelect);
        hideElement(creditCartField);
        hideElement(payPalSelect);
    } else if (paymentSelect.value === 'credit-card') {
        showElement(creditCartField);
        hideElement(bitcoinSelect);
        hideElement(payPalSelect);
    }
});


//check if at least one activity is selected and add or remove validation hints accordingly
const validateActivitiesFieldset = () => {
    if (!atLeastOneActivitySelected()) {
        activitiesFieldset.classList.remove('valid');
        activitiesFieldset.classList.add('not-valid');
        activitiesHint.style.display = 'block';
    } else {
        activitiesFieldset.classList.remove('not-valid');
        activitiesFieldset.classList.add('valid');
        activitiesHint.style.display = 'none';
    }
}

//called to check if the credit card is valid in a single function expression call to increase code readability
const isCreditCardValid = () => {
    const isCreditCardNumberValid = isValid(creditCardNumberInput, creditCardRegex);
    const isZipCodeValid = isValid(zipCodeInput, zipCodeRegex);
    const isCVVValid = isValid(cvvInput, cvvRegex);
    return isCreditCardNumberValid && isZipCodeValid && isCVVValid;
}


for (let i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener('focus', (e) => {
        e.target.parentNode.classList.add('focus');
    });
}

for (let i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener('blur', (e) => {
        e.target.parentNode.classList.remove('focus');
    });
}

//add event listeners to form elements (inputs and a fieldset) for more interactivity and dynamic validation
activitiesFieldset.addEventListener('change', (e) => {
    validateActivitiesFieldset();
    for (let i = 1; i < activityCheckboxes.length; i++) {
        if (activityCheckboxes[i] !== e.target && activityCheckboxes[i].dataset.dayAndTime === e.target.dataset.dayAndTime && !activityCheckboxes[i].disabled) {
            activityCheckboxes[i].disabled = true;
            activityCheckboxes[i].parentNode.classList.add('disabled');
        } else if (activityCheckboxes[i] !== e.target && activityCheckboxes[i].dataset.dayAndTime === e.target.dataset.dayAndTime && activityCheckboxes[i].disabled) {
            activityCheckboxes[i].disabled = false;
            activityCheckboxes[i].parentNode.classList.remove('disabled');
        }
    }
});

nameInput.addEventListener('keyup', () => {
    isValid(nameInput, nameRegex);
})

const displayConditionalEmailErrorMessage = () => {
    if (emailInput.value.length === 0) {
        conditionalEmailErrorMessage.innerText = 'Email field cannot be blank';
    } else if (conditionalEmailErrorMessage.innerText !== 'Email address must be formatted correctly') {
        conditionalEmailErrorMessage.innerText = 'Email address must be formatted correctly';
    }
}
emailInput.addEventListener('keyup', () => {
    isValid(emailInput, emailRegex);
    displayConditionalEmailErrorMessage();
})
creditCardNumberInput.addEventListener('keyup', () => {
    isValid(creditCardNumberInput, creditCardRegex);
})
zipCodeInput.addEventListener('keyup', () => {
    isValid(zipCodeInput, zipCodeRegex);
})
cvvInput.addEventListener('keyup', () => {
    isValid(cvvInput, cvvRegex);
})

//form listener that runs the necessary validation upon submit
form.addEventListener('submit', (e) => {
    const IsCreditCardDataValid = isCreditCardSelected() && isCreditCardValid();
    const isNameValid = isValid(nameInput, nameRegex);
    const isEmailValid = isValid(emailInput, emailRegex);
    const isActivitySelected = atLeastOneActivitySelected();

    if (isCreditCardSelected() && !isCreditCardValid()) {
        e.preventDefault();
    } else if (!isNameValid || !isEmailValid || !isActivitySelected) {
        e.preventDefault();
    }
    validateActivitiesFieldset();
    displayConditionalEmailErrorMessage();
})







