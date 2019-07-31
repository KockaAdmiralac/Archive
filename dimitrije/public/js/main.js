/**
 * main.js
 *
 * Dimitrije client JavaScript file.
 */
'use strict';
(function() {
    let response = null;

    /**
     * Fires after the HTTP request finishes.
     */
    function request() {
        // eslint-disable-next-line no-invalid-this
        const {status} = this;
        if (status === 200) {
            response.innerText = 'Restarted.';
        } else if (status === 400) {
            response.innerText = 'Invalid token.';
        } else {
            response.innerText = 'Unknown response.';
        }
    }

    /**
     * Fires when the form is submitted.
     * @param {Event} event Event fired upon submitting the form
     */
    function submit(event) {
        event.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', request);
        xhr.open('POST', '/restart');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            token: event.target.children[0].value
        }));
        response.innerText = 'Restarting...';
    }

    /**
     * Fires when the document fully loads.
     */
    function load() {
        document
            .getElementById('form')
            .addEventListener('submit', submit);
        response = document.getElementById('response');
    }

    document.addEventListener('DOMContentLoaded', load);
}());
