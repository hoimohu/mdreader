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
    const output_option = document.getElementById('output_option');
    let option = 'none';
    output_option.addEventListener('change', () => {
        option = output_option.value;
        convert();
    });
    function convert() {
        const code = mdread(input.value);
        switch (option) {
            case 'br':
                output.innerHTML = format(code);
                viewcode.innerText = format(code);
                break;
            case 'fewbr':
                output.innerHTML = format(code, true);
                viewcode.innerText = format(code, true);
                break;
            default:
            case 'none':
                output.innerHTML = code;
                viewcode.innerText = code;
                break;
        }
    }
    input.addEventListener('input', convert);
})();