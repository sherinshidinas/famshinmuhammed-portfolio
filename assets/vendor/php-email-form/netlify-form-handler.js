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
      let formName = thisForm.getAttribute('name') || 'contact';
      
      // Show loading state
      let loadingEl = thisForm.querySelector('.loading');
      let errorEl = thisForm.querySelector('.error-message');
      let successEl = thisForm.querySelector('.sent-message');
      
      if (loadingEl) loadingEl.classList.add('d-block');
      if (errorEl) {
        errorEl.classList.remove('d-block');
        errorEl.innerHTML = '';
      }
      if (successEl) successEl.classList.remove('d-block');

      // Prepare form data for Netlify
      let formData = new FormData(thisForm);
      
      // Ensure form-name is set
      if (!formData.has('form-name')) {
        formData.append('form-name', formName);
      }
      
      // Convert FormData to URLSearchParams for Netlify
      let encodedData = new URLSearchParams();
      for (let pair of formData.entries()) {
        // Skip bot-field in submission
        if (pair[0] !== 'bot-field' || !pair[1]) {
          encodedData.append(pair[0], pair[1]);
        }
      }
      
      // Submit to Netlify - use the current page path
      let submitUrl = window.location.pathname === '/' ? '/' : window.location.pathname;
      
      fetch(submitUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedData.toString()
      })
      .then(response => {
        if (loadingEl) loadingEl.classList.remove('d-block');
        
        // Netlify Forms returns 200 on success
        if (response.ok) {
          // Show success message
          if (successEl) successEl.classList.add('d-block');
          thisForm.reset();
        } else if (response.status === 404) {
          // If 404, try submitting without AJAX (let browser handle it)
          throw new Error('Form endpoint not found. Please check Netlify Forms configuration.');
        } else {
          throw new Error('Form submission failed. Status: ' + response.status);
        }
      })
      .catch((error) => {
        if (loadingEl) loadingEl.classList.remove('d-block');
        if (errorEl) {
          errorEl.innerHTML = error.message || 'Something went wrong. Please try again.';
          errorEl.classList.add('d-block');
        }
        console.error('Form submission error:', error);
      });
    });
  });

})();
