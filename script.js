(function () {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const viewcode = document.getElementById('viewcode');

    input.addEventListener('input', () => {
        const code = mdread(input.value);
        output.innerHTML = code;
        viewcode.innerText = code;
    });
})();