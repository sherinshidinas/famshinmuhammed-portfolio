/**
* Netlify Forms Handler - Custom implementation for contact forms
* Works with Netlify Forms while maintaining the same UI/UX as PHP Email Form
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      
      // Show loading state
      let loadingEl = thisForm.querySelector('.loading');
      let errorEl = thisForm.querySelector('.error-message');
      let successEl = thisForm.querySelector('.sent-message');
      
      if (loadingEl) loadingEl.classList.add('d-block');
      if (errorEl) errorEl.classList.remove('d-block');
      if (successEl) successEl.classList.remove('d-block');

      // Prepare form data for Netlify
      let formData = new FormData(thisForm);
      let encodedData = new URLSearchParams();
      
      // Convert FormData to URLSearchParams for Netlify
      for (let pair of formData.entries()) {
        encodedData.append(pair[0], pair[1]);
      }
      
      // Submit to Netlify
      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedData.toString()
      })
      .then(response => {
        if (loadingEl) loadingEl.classList.remove('d-block');
        if (response.ok) {
          // Success
          if (successEl) successEl.classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error('Form submission failed. Please try again.');
        }
      })
      .catch((error) => {
        if (loadingEl) loadingEl.classList.remove('d-block');
        if (errorEl) {
          errorEl.innerHTML = error.message || 'Something went wrong. Please try again.';
          errorEl.classList.add('d-block');
        }
      });
    });
  });

})();
