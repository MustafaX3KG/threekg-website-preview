(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    const button = event.target.closest('.threekg-media-button');
    if (!button || typeof wp === 'undefined' || !wp.media) return;

    event.preventDefault();
    const input = document.querySelector(button.dataset.target);
    if (!input) return;

    const frame = wp.media({
      title: 'Choose media',
      button: { text: 'Use this file' },
      multiple: false
    });

    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON();
      input.value = attachment.url;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    frame.open();
  });
})();

