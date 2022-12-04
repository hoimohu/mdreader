(function () {
    const input = document.getElementById('input');
    fetch('README.md')
        .then(d => d.text())
        .then(t => {
            input.value = t;
            convert();
        });
    const output = document.getElementById('output');
    const viewcode = document.getElementById('viewcode');
    function convert() {
        const code = mdread(input.value);
        output.innerHTML = format(code);
        viewcode.innerText = format(code);
    }
    input.addEventListener('input', convert);
})();