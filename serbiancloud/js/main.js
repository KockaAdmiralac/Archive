/**
 * main.js
 *
 * Main JavaScript file for SerbianCloud
 */
(function() {
    var form, result, submit, input;
    function onLoad() {
        form = document.getElementById('form');
        result = document.getElementById('result');
        submit = document.getElementById('submit');
        input = document.getElementById('input');
        form.addEventListener('submit', onSubmit);
    }
    function error(error) {
        submit.classList.remove('loading');
        if (error === 'notext') {
            input.classList.add('error');
            input.placeholder = 'Morate uneti tekst!';
            input.focus();
            input.addEventListener('input', onInput);
            submit.value = 'Unesi';
        } else {
            submit.classList.add('error');
            submit.value = 'Desila se greška';
        }
    }
    function onSubmit(e) {
        e.preventDefault();
        submit.classList.add('loading');
        submit.value = '';
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('loadend', onFinish);
        xhr.open('POST', 'image.php', true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('json=1&text=' + encodeURIComponent(input.value));
    }
    function onFinish() {
        if (this.status === 200) {
            var res = this.response;
            if (!res) {
                error('noresponse');
            } else if (res.error) {
                error(res.error);
            } else {
                result.src = window.location.pathname + 'i/' + res.file + '.png';
                submit.classList.remove('loading');
                submit.value = 'Unesi';
            }
        } else {
            error('Server returned error code: ' + this.status);
        }
    }
    function onInput() {
        input.classList.remove('error');
        input.removeEventListener('input', onInput);
    }
    document.addEventListener('DOMContentLoaded', onLoad);
})();
