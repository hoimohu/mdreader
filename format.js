/**
 * HTMLを整形します
 * @param {String} html 整形するHTMLの文字列
 * @param {Boolean} oneLine HTMLをできるだけ1行にする
 * @return {String} 整形済みHTML
 */
function format(html, oneLine = false) {
    /**
     * 半角スペースでインデントを作成します
     * @param {Number} depth インデントの深さ
     */
    function indent(depth) {
        let result = '';
        let count = depth;
        while (count > 0) {
            result += '  ';
            count--;
        }
        return result;
    }
    /**
     * @type {String} 出力文字列
     */
    let output = '';
    /**
     * @type {Boolean} コードブロックかどうか
     */
    let isCode = false;
    /**
     * @type {Number} 入れ子の深さ
     */
    let depth = 0;
    /**
     * @type {String} 変換用配列
     */
    let spl = html.split(/(<pre.*><code>|<\/code><\/pre>)/g);
    for (let index = 0; index < spl.length; index++) {
        /**
         * @type {String} 変換用文字列1
         */
        const element = spl[index];
        if (element.match(/^(<pre.*><code>|<\/code><\/pre>)$/)) {
            if (isCode) {
                isCode = false;
            } else {
                isCode = true;
            }
        }
        if (!isCode) {
            /**
             * @type {String} 変換用文字列2
             */
            let html2 = element.replace(/>/g, '>\n').replace(/<\//g, '\n</');
            while (html2.match(/\n\n/)) {
                html2 = html2.replace(/\n\n/g, '\n');
            }
            if (oneLine) {
                output += html2.replace(/\n/g, '');
            } else {
                /**
                 * @type {Array<String>} html文字列を改行で分割した配列
                 */
                const spl2 = html2.replace(/\n/g, '').split('<');
                for (let i = 1; i < spl2.length; i++) {
                    let line = spl2[i];
                    if (line[0] === '/') {
                        if (depth > 0) {
                            depth--;
                        }
                        if (line.match(/^\/(h\d|li|em|strong|code|del|sup|sub|mark)/)) {
                            output += '<' + line;
                        } else {
                            output += '\n' + indent(depth) + '<' + line;
                        }
                    } else {
                        if (line.match(/^\S+:\/\//)) {
                            output += '<' + line;
                        } else {
                            output += '\n' + indent(depth) + '<' + line;
                        }
                    }
                    if (line[0] !== '/' && !line.match(/^(img|br|hr|!|\S+:\/\/)/)) {
                        depth++;
                    }
                }
            }
        } else {
            output += '\n' + indent(depth) + element;
        }
    }
    return output.replace(/^\n+/, '').replace(/<\/code>\n<\/pre>/g, '</code></pre>');
}