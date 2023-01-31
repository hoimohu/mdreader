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
    output_option.onchange = convert;
    const popupBtn = document.getElementById('popup');
    let previewWindows = [];
    popupBtn.onclick = () => {
        const w = window.open();
        w.document.title = 'mdreaderプレビュー';
        w.onclose = () => {
            previewWindows = previewWindows.filter(e => e !== w);
        };
        previewWindows.push(w);
        convert();
    };
    function convert() {
        const code = mdread(input.value);
        switch (output_option.value) {
            case 'indent':
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
        if (previewWindows.length > 0) {
            previewWindows.forEach(e => {
                e.document.body.innerHTML = code;
            });
        }
    }
    input.oninput = convert;
})();