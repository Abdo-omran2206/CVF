    const TOKEN = "8050029665:AAGZflp6_xAePlHftJueEkq8v-IxdLh31KU";                                                                     
    const CHAT_IDS = ["1402858789" , "-1002524293222"]; // Add more chat IDs as needed
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;        

    const FORM_TOKEN_KEY = 'cvf_form_submitted';
    const form = document.getElementById('login-form');
    const formContainer = document.querySelector('.volunteer-form-container');
    const loadingOverlay = document.getElementById('loading-overlay');

    function showAlreadySubmitted() {
        form.style.display = 'none';
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        Swal.fire({
            icon: 'info',
            title: 'You have already submitted the form',
            text: 'Thank you! Your information has already been sent.',
            confirmButtonText: 'OK'
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (localStorage.getItem(FORM_TOKEN_KEY)) {
            showAlreadySubmitted();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem(FORM_TOKEN_KEY)) {
            showAlreadySubmitted();
            return;
        }
        // Show loading overlay and hide form
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        form.style.display = 'none';

        const fullname = document.getElementById('fullname').value;
        const dob = document.getElementById('dob').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const university = document.getElementById('university').value;
        const college = document.getElementById('college').value;
        const year = document.getElementById('year').value;

        // Get selected gender
        const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
        // Get selected committee
        const committee = document.querySelector('input[name="committee"]:checked')?.value || '';
        // Get all checked sources
        const sources = Array.from(document.querySelectorAll('input[name="source"]:checked')).map(cb => cb.value).join(', ');

        const message =
            `<b>New Volunteer Application</b>\n` +
            `<b>Full Name:</b> ${fullname}\n` +
            `<b>Date of Birth:</b> ${dob}\n` +
            `<b>Email:</b> ${email}\n` +
            `<b>Phone:</b> ${phone}\n` +
            `<b>Gender:</b> ${gender}\n` +
            `<b>Address:</b> ${address}\n` +
            `<b>City:</b> ${city}\n` +
            `<b>University:</b> ${university}\n` +
            `<b>College:</b> ${college}\n` +
            `<b>Year:</b> ${year}\n` +
            `<b>Committee:</b> ${committee}\n` +
            `<b>Source:</b> ${sources}`;

        let allSuccess = true;
        let allFailed = true;
        let sentCount = 0;
        CHAT_IDS.forEach(chatId => {
            axios.post(URI_API, {
                chat_id: chatId,
                parse_mode: 'html',
                text: message
            }).then(response => {
                allFailed = false;
                sentCount++;
                if (sentCount === CHAT_IDS.length) {
                    if (allFailed) {
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error sending the information. Please try again.'
                        });
                    } else {
                        localStorage.setItem(FORM_TOKEN_KEY, '1');
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                        Swal.fire({
                            icon: 'success',
                            title: 'Information sent successfully!',
                            text: 'Thank you for joining!'
                        });
                    }
                }
            }).catch(error => {
                allSuccess = false;
                sentCount++;
                if (sentCount === CHAT_IDS.length) {
                    if (allSuccess) {
                        localStorage.setItem(FORM_TOKEN_KEY, '1');
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                        Swal.fire({
                            icon: 'success',
                            title: 'Information sent successfully!',
                            text: 'Thank you for joining!'
                        });
                    } else {
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error sending the information. Please try again.'
                        });
                    }
                }
            });
        });
    });