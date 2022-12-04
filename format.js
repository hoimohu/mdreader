/**
 * HTMLを成形します
 * @param {String} html 成形するHTMLの文字列
 * @param {Boolean} oneLine HTMLをできるだけ1行にする
 * @return {String} 成形済みHTML
 */
function format(html, oneLine = false) {
    /**
     * @type {String} 出力文字列
     */
    let output = '';
    /**
     * @type {Boolean} コードブロックかどうか
     */
    let isCode = false;
    /**
     * @type {String} HTMLタグ検知用文字列
     */
    let tagStock = '';
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
                output += html2;
            }
        } else {
            output += element;
        }
    }
    return output;
}