/**
 * MarkdownをHTMLに変換
 * @param {String} md 原文
 */
function mdread(md) {
    /**
     * @type {Array} 原文を改行で分割
     */
    const linespl = md.split('\n');

    /**
     * @type {Array} 変換結果
     */
    let result = [];

    /**
     * @type {Object} 変換時のデータが入ります
     */
    const data = {
        /**
         * @type {String} 現在の行がコードブロックか
         */
        codeblock: 'no',
        /**
         * @type {Number} コードブロックを示すバッククォートの最大個数
         */
        maxcodebq: ('\n' + md).split(/\n```|\n> ```/).length - 1,
        /**
         * @type {Number} コードブロックを示すバッククォートの最大個数(参照用)
         */
        maxrefcodebq: ('\n' + md).split('\n```').length - 1,
        /**
         * @type {Number} コードブロックを示すバッククォートの通過回数
         */
        codebqcount: 0,
        /**
         * @type {Number} リストの階層(-1=リストではない)
         */
        listnumber: -1,
        /**
         * @type {Array} リストの種類
         */
        listtype: [],
        /**
         * @type {Number} 引用の階層
         */
        blockquotenumber: 0,
        /**
         * @type {Number} リスト内引用の階層
         */
        listblqtnumber: 0,
        /**
         * @type {Boolean} 段落かどうか
         */
        paragraph: false,
        /**
         * @type {Array} コード内のテキスト
         */
        codetext: [],
        /**
         * @type {Object} 参照型リンクの内容
         */
        refstylelink: {},
        /**
         * @type {Object} 脚注の内容
         */
        footnote: {}
    };

    /**
     * 参照型リンクの先読み
     * @param {String} t 検索対象
     * @param {Number} i 要素のインデックス
     */
    function getreflink(t, i) {
        if (data.codeblock === 'no') {
            if (t.match(/^```/) && data.codebqcount + 1 < data.maxrefcodebq) {
                data.codeblock = 'bq';
                data.codebqcount++;
            } else {
                if (t.match(/^\[\^[^\s\[\]]+\]:\s+.+$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[\^[^\s\[\]]+\]:\s+.+$/)[0];
                    data.footnote[m.match(/(?<=^\[\^)[^\s\[\]]+(?=\]:\s+.+$)/)[0]] = {
                        text: m.match(/(?<=^\[\^[^\s\[\]]+\]:\s+).+$/)[0]
                    };
                    linespl[i] = '';
                    for (let index = 1; i + index < linespl.length; index++) {
                        if (linespl[i + index].match(/^(    |\t)/)) {
                            data.footnote[m.match(/(?<=^\[\^)[^\s\[\]]+\]:\s+.+$/)[0]].text += ('\n' + linespl[i + index].match(/(?<=^(    |\t)).*/)[0]);
                            linespl[i + index] = '';
                        } else {
                            break;
                        }
                    }
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=>\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+".+"\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+".+"\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+".+"\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=\s+".+"\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+").+(?="\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+".+"\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+".+"\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+".+"\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=>\s+".+"\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+").+(?="\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+'.+'\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+'.+'\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+'.+'\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=\s+'.+'\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+').+(?='\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+'.+'\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+'.+'\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+'.+'\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=>\s+'.+'\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+').+(?='\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+\(.+\)\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+\(.+\)\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+\(.+\)\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=\s+\(.+\)\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)\s+\().+(?=\)\s*$)/)[0]
                    };
                    linespl[i] = '';
                } else if (t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+\(.+\)\s*$/)) {
                    /**
                     * @type {String} マッチした文字列
                     */
                    const m = t.match(/^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+\(.+\)\s*$/)[0];
                    data.refstylelink[m.match(/(?<=^\[)\S+?(?=\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+\(.+\)\s*$)/)[0]] = {
                        href: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<)([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)(?=>\s+\(.+\)\s*$)/)[0],
                        title: m.match(/(?<=^\[[^\s\[\]]+\]:\s+<([^\s<>]+:\/\/\S+\.[^<>\s]+|[^<>\s]+@\S+\.[^<>\s]+)>\s+\().+(?=\)\s*$)/)[0]
                    };
                    linespl[i] = '';
                }
            }
        } else if (data.codeblock === 'bq') {
            if (t.match(/^```$/)) {
                data.codeblock = 'no';
                data.codebqcount++;
            }
        }
    }

    /**
     * 先頭から4スペースとタブ文字を数えます
     * @param {String} text 数える対象のテキスト
     * @param {Number} [count=0] 回数カウント
     */
    function countspace(text, count = 0) {
        if (typeof text === 'string') {
            if (text.match(/^    /)) {
                return countspace(text.replace(/^    /, ''), ++count);
            } else if (text.match(/^\t/)) {
                return countspace(text.replace(/^\t/, ''), ++count);
            } else {
                return count;
            }
        } else {
            return count;
        }
    }

    /**
     * 先頭の>を数えます
     * @param {String} text 数える対象のテキスト
     * @param {Number} [count=0] 回数カウント
     */
    function countgt(text, count = 0) {
        if (typeof text === 'string') {
            if (text.match(/^>+ /)) {
                if (text.match(/^>/)) {
                    return countgt(text.replace(/^>/, ''), ++count);
                } else {
                    return count;
                }
            } else {
                return count;
            }
        } else {
            return count;
        }
    }

    /**
     * ==と--の見出しがあるかの確認
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function headingcheck(t, i) {
        if (data.codeblock === 'no' && i !== linespl.length - 1) {
            if (linespl[i + 1].match(/^==+/)) {
                blockquote('# ' + t, i);
                linespl[i + 1] = '';
            } else if (linespl[i + 1].match(/^--/)) {
                blockquote('## ' + t, i);
                linespl[i + 1] = '';
            } else {
                blockquote(t, i);
            }
        } else {
            blockquote(t, i);
        }
    }

    /**
     * 引用の変換
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function blockquote(t, i) {
        if (data.codeblock === 'no') {
            const escaped = t.replace(/\\\\/g, '&#92;').replace(/\\`/g, '&#96;').replace(/\\\*/g, '&#42;').replace(/\\_/g, '&#95;').replace(/\\{/g, '&#123;').replace(/\\}/g, '&#125;').replace(/\\\[/g, '&#91;').replace(/\\\]/g, '&#93;').replace(/\\</g, '&lt;').replace(/\\>/g, '&gt;').replace(/\\\(/g, '&#40;').replace(/\\\)/g, '&#41;').replace(/\\#/g, '&#35;').replace(/\\\+/g, '&#43;').replace(/\\-/g, '&#45;').replace(/\\\./g, '&#46;').replace(/\\!/g, '&#33;').replace(/\\\|/g, '&#124;').replace(/\\=/g, '&equals;').replace(/\\&/g, '&amp;');
            const gtcount = countgt(escaped);
            if (data.blockquotenumber < gtcount) {
                for (let count = 0; count < gtcount - data.blockquotenumber; count++) {
                    if (data.listnumber !== -1) {
                        result.push(`</li>`);
                        for (let index = 0; index < data.listtype.length; index++) {
                            if (data.listtype.pop() === 'ol') {
                                result.push(`</ol>`);
                            } else {
                                result.push(`</ul>`);
                            }
                        }
                        data.listnumber = -1;
                    }
                    if (data.paragraph === true) {
                        result.push(`</p>`);
                        data.paragraph = false;
                    }
                    result.push(`<blockquote>`);
                }
            } else if (gtcount < data.blockquotenumber) {
                for (let count = 0; count < data.blockquotenumber - gtcount; count++) {
                    result.push(`</blockquote>`);
                }
            }
            data.blockquotenumber = gtcount;
            precode(escaped.replace(/^>+ /, ''), i);
            if (linespl.length - 1 === i) {
                for (let count = 0; count < data.blockquotenumber; count++) {
                    result.push(`</blockquote>`);
                }
            }
        } else {
            precode(t, i);
        }
    }

    /**
     * コードブロックの変換
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function precode(t, i) {
        if (data.codeblock === 'no') {
            if (t.match(/^```/) && data.codebqcount + 1 < data.maxcodebq) {
                data.codeblock = 'bq';
                data.codebqcount++;
                if (data.paragraph === true) {
                    result.push(`</p>`);
                    data.paragraph = false;
                }
                result.push(`<pre><code${t.match(/(?<=```\s*)\S+(?=\s*)/)?' class="'+t.match(/(?<=```\s*)\S+(?=\s*)/)[0]+'"':''}>`);
            } else if (t.match(/^(    |\t)/ && data.listnumber === -1)) {
                data.codeblock = 'sp';
                if (data.paragraph === true) {
                    result.push(`</p>`);
                    data.paragraph = false;
                }
                result.push(`<pre><code>${t.replace(/^(    |\t)/,'')}`);
            } else {
                horizon(t, i);
            }
        } else if (data.codeblock === 'bq') {
            if (t.match(/^```$/)) {
                data.codeblock = 'no';
                data.codebqcount++;
                result.push(`</code></pre>`);
            } else {
                result.push(t.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            }
        } else if (data.codeblock === 'sp') {
            if (t.match(/^(    |\t)/)) {
                result.push(t.replace(/^(    |\t)/, '').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            } else {
                data.codeblock = 'no';
                result.push(`</pre></code>`);
                horizon(t, i);
            }
        }
    }

    /**
     * 水平線の変換
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function horizon(t, i) {
        if (t.match(/^(\*\*\*+|---+|___+)$/)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            result.push(`<hr>`);
        } else {
            list(t, i);
        }
    }

    /**
     * リストの変換
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function list(t, i) {
        if (data.listnumber === -1) {
            if (t.match(/^1\. /)) {
                if (data.paragraph === true) {
                    result.push(`</p>`);
                    data.paragraph = false;
                }
                data.listnumber = 0;
                data.listtype.push('ol');
                result.push(`<ol><li>`);
                heading(t.replace(/^\s*\d+\. /, ''), i);
            } else if (t.match(/^(-|\*|\+) /)) {
                if (data.paragraph === true) {
                    result.push(`</p>`);
                    data.paragraph = false;
                }
                data.listnumber = 0;
                data.listtype.push(t.match(/^(-|\*|\+)/)[0]);
                result.push(`<ul>`);
                result.push(`<li>`);
                heading(t.replace(/^\s*(-|\*|\+) /, ''), i);
            } else {
                heading(t, i);
            }
        } else if (0 < countspace(t) && !(t.match(/^\s*(\d+\.|(-|\*|\+)) /))) {
            if (1 < countspace(t)) {
                //リスト内割り込みprecode
                if (data.listtype[data.listtype.length - 1].match(/(ol|-|\*|\+)/)) {
                    data.listtype.push('</pre></code>');
                    result.push(`<pre><code>`);
                } else if (data.listtype[data.listtype.length - 1] !== '</pre></code>') {
                    result.push(data.listtype.pop());
                    data.listtype.push('</pre></code>');
                    result.push(`<pre><code>`);
                }
                result.push(t.replace(/^(    |\t)(    |\t)/, ''));
            } else if (t.match(/^(    |\t)>+ /)) {
                //リスト内割り込みblockquote
                const gtcount = countgt(t.replace(/^(    |\t)/, ''));
                if (data.listblqtnumber === 0) {
                    if (data.listtype[data.listtype.length - 1].match(/(ol|-|\*|\+)/)) {
                        data.listtype.push('');
                    } else if (!(data.listtype[data.listtype.length - 1].match(/(<\/blockquote>)+/))) {
                        result.push(data.listtype.pop());
                        data.listtype.push('');
                    }
                }
                if (data.listblqtnumber < gtcount) {
                    for (let count = 0; count < gtcount - data.listblqtnumber; count++) {
                        result.push(`<blockquote>`);
                        data.listtype[data.listtype.length - 1] += '</blockquote>';
                    }
                } else if (gtcount < data.listblqtnumber) {
                    for (let count = 0; count < data.listblqtnumber - gtcount; count++) {
                        result.push(`</blockquote>`);
                        data.listtype[data.listtype.length - 1].replace(/^<\/blockquote>/, '');
                    }
                }
                data.listblqtnumber = gtcount;
                heading(t.replace(/^(    |\t)>+ /, ''), i);
            } else {
                //リスト内割り込みparagraph
                if (data.listtype[data.listtype.length - 1].match(/(ol|-|\*|\+)/)) {
                    data.listtype.push('</p>');
                    result.push(`<p>`);
                } else if (data.listtype[data.listtype.length - 1] !== '</p>') {
                    result.push(data.listtype.pop());
                    data.listtype.push('</p>');
                    result.push(`<p>`);
                }
                decoration(t.replace(/^(    |\t)/, ''), i);
            }
        } else if (t !== '' || i + 1 === linespl.length) {
            if (!(data.listtype[data.listtype.length - 1].match(/(ol|-|\*|\+)/))) {
                result.push(data.listtype.pop());
            }
            if (countspace(t) === 0 && !(t.match(/^\s*(\d+\.|(-|\*|\+)) /))) {
                result.push(`</li>`);
                for (let index = 0; index < data.listtype.length; index++) {
                    if (data.listtype.pop() === 'ol') {
                        result.push(`</ol>`);
                    } else {
                        result.push(`</ul>`);
                    }
                }
                heading(t, i);
                data.listnumber = -1;
            } else if (data.listnumber < countspace(t)) {
                if (t.match(/^\s*\d+\. /)) {
                    data.listnumber++;
                    data.listtype.push('ol');
                    result.push(`</li><ol><li>`);
                    heading(t.replace(/^\s*\d+\. /, ''), i);
                } else if (t.match(/^\s*(-|\*|\+) /)) {
                    data.listnumber++;
                    data.listtype.push(t.match(/(?<=^\s*)(-|\*|\+)/)[0]);
                    result.push(`</li><ul>`);
                    result.push(`<li>`);
                    heading(t.replace(/^\s*(-|\*|\+) /, ''), i);
                }
            } else if (countspace(t) < data.listnumber) {
                result.push(`</li>`);
                for (let index = 0; index < data.listnumber - countspace(t); index++) {
                    if (data.listtype.pop() === 'ol') {
                        result.push(`</ol>`);
                    } else {
                        result.push(`</ul>`);
                    }
                }
                if (t.match(/^\s*\d+\. /)) {
                    if (data.listtype[data.listtype.length - 1] !== 'ol') {
                        result.push(`</ul>`);
                        result.push(`<ol>`);
                        data.listtype[data.listtype.length - 1] = 'ol';
                    }
                    data.listnumber = countspace(t);
                    result.push(`<li>`);
                    heading(t.replace(/^\s*\d+\. /, ''), i);
                } else if (t.match(/^\s*(-|\*|\+) /)) {
                    if (data.listtype[data.listtype.length - 1] === 'ol') {
                        result.push(`</ol>`);
                        result.push(`<ul>`);
                        data.listtype[data.listtype.length - 1] = t.match(/(?<=^\s*)(-|\*|\+)/)[0];
                    } else if (data.listtype[data.listtype.length - 1] !== t.match(/(?<=^\s*)(-|\*|\+)/)[0]) {
                        result.push(`</ul>`);
                        result.push(`<ul>`);
                        data.listtype[data.listtype.length - 1] = t.match(/(?<=^\s*)(-|\*|\+)/)[0];
                    }
                    data.listnumber = countspace(t);
                    result.push(`<li>`);
                    heading(t.replace(/^\s*(-|\*|\+) /, ''), i);
                }
            } else if (countspace(t) === data.listnumber) {
                if (t.match(/^\s*\d+\. /)) {
                    if (data.listtype[data.listtype.length - 1] !== 'ol') {
                        result.push(`</li></ul>`);
                        result.push(`<ol>`);
                        data.listtype[data.listtype.length - 1] = 'ol';
                    } else {
                        result.push(`</li>`);
                    }
                    result.push(`<li>`);
                    heading(t.replace(/^\s*\d+\. /, ''), i);
                } else if (t.match(/^\s*(-|\*|\+) /)) {
                    if (data.listtype[data.listtype.length - 1] === 'ol') {
                        result.push(`</li></ol>`);
                        result.push(`<ul>`);
                        data.listtype[data.listtype.length - 1] = t.match(/(?<=^\s*)(-|\*|\+)/)[0];
                    } else if (data.listtype[data.listtype.length - 1] !== t.match(/(?<=^\s*)(-|\*|\+)/)[0]) {
                        result.push(`</li></ul>`);
                        result.push(`<ul>`);
                        data.listtype[data.listtype.length - 1] = t.match(/(?<=^\s*)(-|\*|\+)/)[0];
                    } else {
                        result.push(`</li>`);
                    }
                    result.push(`<li>`);
                    heading(t.replace(/^\s*(-|\*|\+) /, ''), i);
                }
            }
        }
        if (linespl.length - 1 === i && data.listnumber !== -1) {
            const lstypelength = data.listtype.length;
            if (linespl[linespl.length - 1].match(/^>* *\s*(\d+\.|-|\*|\+) /)) {
                result.push(`</li>`);
            }
            for (let index = 0; index < lstypelength; index++) {
                const datapop = data.listtype.pop();
                switch (datapop) {
                    case 'ol':
                        result.push(`</ol>`);
                        break;
                    case '-':
                    case '*':
                    case '+':
                        result.push(`</ul>`);
                        break;
                    default:
                        result.push(`${datapop}</li>`);
                        break;
                }
            }
            data.listnumber = -1;
        }
    }

    /**
     * 見出しの変換
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function heading(t, i) {
        if (t.match(/^# /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h1>${t.replace(/^# /, '')}</h1>`, i);
        } else if (t.match(/^## /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h2>${t.replace(/^## /, '')}</h2>`, i);
        } else if (t.match(/^### /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h3>${t.replace(/^### /, '')}</h3>`, i);
        } else if (t.match(/^#### /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h4>${t.replace(/^#### /, '')}</h4>`, i);
        } else if (t.match(/^##### /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h5>${t.replace(/^##### /, '')}</h5>`, i);
        } else if (t.match(/^###### /)) {
            if (data.paragraph === true) {
                result.push(`</p>`);
                data.paragraph = false;
            }
            decoration(`<h6>${t.replace(/^###### /, '')}</h6>`, i);
        } else if (t.match(/(?<!^\S)\|.+\|(?!\S$)/)) {
            table(t, i);
        } else {
            if (data.paragraph === true && t === '') {
                result.push(`</p>`);
                data.paragraph = false;
            }
            if (data.paragraph === false && t.match(/.+/) && data.listnumber === -1 && data.blockquotenumber === 0) {
                result.push(`<p>`);
                data.paragraph = true;
            }
            decoration(t, i);
            if (data.paragraph === true && linespl.length - 1 === i) {
                result.push(`</p>`);
                data.paragraph = false;
            }
        }
    }

    /**
     * 文字の装飾
     * @param {Number} i 要素のインデックス
     * @param {String} t 変換するテキスト
     */
    function table(t, i) {
        const rawtable = [];
        for (let n = 0; i + n < linespl.length; n++) {
            if (rawtable.length === 0 && linespl[i + n].match(/(?<!^\S)\|.+\|(?!\S$)/)) {
                rawtable.push(linespl[i + n]);
            } else if (rawtable.length === 1 && linespl[i + n].match(/(?<!^\S)\|[\s-:\|]*---[\s-:\|]*\|(?!\S$)/)) {
                rawtable.unshift(linespl[i + n]);
            } else if (1 < rawtable.length && linespl[i + n].match(/(?<!^\S)\|.+\|(?!\S$)/)) {
                rawtable.push(linespl[i + n]);
            } else if (i + n === linespl.length - 1) {
                break;
            } else {
                break;
            }
        }
        if (rawtable.length < 3) {
            if (data.paragraph === false && t.match(/.+/) && data.listnumber === -1 && data.blockquotenumber === 0) {
                result.push(`<p>`);
                data.paragraph = true;
            }
            decoration(t, i);
            if (data.paragraph === true && linespl.length - 1 === i) {
                result.push(`</p>`);
                data.paragraph = false;
            }
        } else {
            const tablealign = [];
            for (let n2 = 0; n2 < rawtable.length; n2++) {
                linespl[i + n2] = '';
                if (n2 === 0) {
                    rawtable[n2].split('|').forEach((element, index) => {
                        if (index !== rawtable[n2].split('|') - 1 && index !== 0) {
                            if (element.match(/\s*:---+:\s*/)) {
                                tablealign.push('center');
                            } else if (element.match(/\s*:---+\s*/)) {
                                tablealign.push('left');
                            } else if (element.match(/\s*---+:\s*/)) {
                                tablealign.push('right');
                            } else {
                                tablealign.push('');
                            }
                        }
                    });
                } else if (n2 === 1) {
                    rawtable[n2].split('|').forEach((element, index) => {
                        if (index === 0) {
                            result.push('<table><thead><tr>');
                        } else if (index !== rawtable[n2].split('|').length - 1) {
                            result.push(`<th${((tablealign[index-1]!=null)?((tablealign[index-1]!=='')?' style="text-align:'+tablealign[index-1] + '"':''):'')}>${element}</th>`);
                        } else {
                            result.push('</tr></thead><tbody>');
                        }
                    });
                } else if (n2 === rawtable.length - 1) {
                    rawtable[n2].split('|').forEach((element, index) => {
                        if (index === 0) {
                            result.push('<tr>');
                        } else if (index !== rawtable[n2].split('|').length - 1) {
                            result.push(`<td${((tablealign[index-1]!=null)?((tablealign[index-1]!=='')?' style="text-align:'+tablealign[index-1] + '"':''):'')}>${element}</td>`);
                        } else {
                            result.push('</tr></tbody></table>');
                        }
                    });
                } else {
                    rawtable[n2].split('|').forEach((element, index) => {
                        if (index === 0) {
                            result.push('<tr>');
                        } else if (index !== rawtable[n2].split('|') - 1) {
                            result.push(`<td${((tablealign[index-1]!=null)?((tablealign[index-1]!=='')?' style="text-align:'+tablealign[index-1] + '"':''):'')}>${element}</td>`);
                        } else {
                            result.push('</tr>');
                        }
                    });
                }
            }
        }
    }

    /**
     * 文字の装飾
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function decoration(t, i) {
        if (t.match(/\*\*\*.+\*\*\*/)) {
            decoration(t.replace(/\*\*\*.+?\*\*\*/, '<strong><em>' + t.match(/(?<=\*\*\*).+?(?=\*\*\*)/)[0] + '</em></strong>'), i);
        } else if (t.match(/(^\*| \*)\*_.+_\*(\* |\*$)/)) {
            decoration(t.replace(/(^\*| \*)\*_.+_\*(\* |\*$)/, ' <strong><em>' + t.match(/(?<=(^\*| \*)\*_).+?(?=_\*(\* |\*$))/)[0] + '</em></strong> '), i);
        } else if (t.match(/(^\*| \*)__.+__(\* |\*$)/)) {
            decoration(t.replace(/(^\*| \*)__.+__(\* |\*$)/, ' <strong><em>' + t.match(/(?<=(^\*| \*)__).+?(?=__(\* |\*$))/)[0] + '</em></strong> '), i);
        } else if (t.match(/(^_| _)\*\*.+\*\*(_ |_$)/)) {
            decoration(t.replace(/(^_| _)\*\*.+\*\*(_ |_$)/, ' <strong><em>' + t.match(/(?<=(^_| _)\*\*).+?(?=\*\*(_ |_$))/)[0] + '</em></strong> '), i);
        } else if (t.match(/(^_| _)_\*.+\*_(_ |_$)/)) {
            decoration(t.replace(/(^_| _)_\*.+\*_(_ |_$)/, ' <strong><em>' + t.match(/(?<=(^_| _)_\*).+?(?=\*_(_ |_$))/)[0] + '</em></strong> '), i);
        } else if (t.match(/(^_| _)__.+__(_ |_$)/)) {
            decoration(t.replace(/(^_| _)__.+__(_ |_$)/, ' <strong><em>' + t.match(/(?<=(^_| _)__).+?(?=__(_ |_$))/)[0] + '</em></strong> '), i);
        } else if (t.match(/\*\*.+\*\*/)) {
            decoration(t.replace(/\*\*.+?\*\*/, '<strong>' + t.match(/(?<=\*\*).+?(?=\*\*)/)[0] + '</strong>'), i);
        } else if (t.match(/\*.+\*/)) {
            decoration(t.replace(/\*.+?\*/, '<em>' + t.match(/(?<=\*).+?(?=\*)/)[0] + '</em>'), i);
        } else if (t.match(/(^_| _)_.+_(_ |_$)/)) {
            decoration(t.replace(/(^_| _)_.+?_(_ |_$)/, ' <strong>' + t.match(/(?<=(^_| _)_).+?(?=_(_ |_$))/)[0] + '</strong> '), i);
        } else if (t.match(/(^_| _).+(_ |_$)/)) {
            decoration(t.replace(/(^_| _).+?(_ |_$)/, ' <em>' + t.match(/(?<=(^_| _)).+?(?=(_ |_$))/)[0] + '</em> '), i);
        } else if (t.match(/`[^`<>]+`/)) {
            /**
             * @type {Object} push対象のオブジェクト
             */
            const pushobj = {
                class: 'codeinsert' + data.codetext.length,
                text: t.match(/(?<=`)[^`<>]+(?=`)/)[0]
            };
            data.codetext.push(pushobj);
            decoration(t.replace(/`.+?`/, '<code class="' + pushobj.class + '"></code>'), i);
        } else if (t.match(/~~.+~~/)) {
            decoration(t.replace(/~~.+?~~/, '<del>' + t.match(/(?<=~~).+?(?=~~)/)[0] + '</del>'), i);
        } else if (t.match(/~.+~/)) {
            decoration(t.replace(/~.+?~/, '<sub>' + t.match(/(?<=~).+?(?=~)/)[0] + '</sub>'), i);
        } else if (t.match(/\[\^[^\s\[\]]+\]/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/\[\^[^\s\[\]]+\]/)[0];
            decoration(t.replace(/\[\^[^\s\[\]]+\]/, `<sup><a href="#${encodeURIComponent(m.match(/(?<=\[\^)[^\s\[\]]+(?=\])/)[0])}">${Object.keys(data.footnote).indexOf(m.match(/(?<=\[\^)[^\s\[\]]+(?=\])/)[0])+1}</a></sup>`), i);
        } else if (t.match(/\^.+\^/)) {
            decoration(t.replace(/\^.+?\^/, '<sup>' + t.match(/(?<=\^).+?(?=\^)/)[0] + '</sup>'), i);
        } else if (t.match(/==.+==/)) {
            decoration(t.replace(/==.+?==/, '<mark>' + t.match(/(?<===).+?(?===)/)[0] + '</mark>'), i);
        } else if (t.match(/  $/)) {
            href(t.match(/.*(?=  $)/)[0], i);
            result.push('<br>');
        } else {
            href(t, i);
        }
    }

    /**
     * ハイパーリンクの追加等
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function href(t, i) {
        if (t.match(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/)[0];
            href(t.replace(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/, `<a href="${m.match(/(?<=^<).+(?=>$)/)[0]}">${m.match(/(?<=^<).+(?=>$)/)[0]}</a>`), i);
        } else if (t.match(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/)[0];
            href(t.replace(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/, `<a href="${m.match(/(?<=^<).+(?=>$)/)[0]}">${m.match(/(?<=^<).+(?=>$)/)[0]}</a>`), i);
        } else if (t.match(/!\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/!\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)[0];
            href(t.replace(/!\[.+?\]\([^\(\)\s]+? "[^!\[\]\(\) "]+"\)/, `<img src="${m.match(/(?<=^!\[.+?\]\()[^\(\)\s]+?(?= "[^\[\]\(\) "]*?"\)$)/)[0]}" title="${m.match(/(?<=^!\[.+?\]\([^\(\)\s]+? ").*?(?="\)$)/)[0]}" alt="${m.match(/(?<=^!\[).+?(?=\]\([^\(\)\s]+? "[^\[\]\(\) "]*?"\))/)[0]}">`), i);
        } else if (t.match(/!\[.+\]\([^\(\)\s]+\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/!\[.+?\]\([^\(\)\s]+?\)/)[0];
            href(t.replace(/!\[.+?\]\([^\(\)\s]+?\)/, `<img src="${m.match(/(?<=^!\[.+?\]\()[^\(\)\s]+?(?=\)$)/)[0]}" alt="${m.match(/(?<=^!\[).+?(?=\]\([^\(\)\s]+?\))/)[0]}">`), i);
        } else if (t.match(/\[.+\]\([^\(\)\s]+\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/\[.+?\]\([^\(\)\s]+?\)/)[0];
            href(t.replace(/\[.+?\]\([^\(\)\s]+?\)/, `<a href="${m.match(/(?<=^\[.+?\]\()[^\(\)\s]+?(?=\)$)/)[0]}">${m.match(/(?<=^\[).+?(?=\]\([^\(\)\s]+?\))/)[0]}</a>`), i);
        } else if (t.match(/\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/\[.+?\]\([^\(\)\s]+ "[^\[\]\(\) "]+"\)/)[0];
            href(t.replace(/\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/, `<a href="${m.match(/(?<=^\[.+?\]\()[^\(\)\s]+?(?= "[^\[\]\(\) "]*?"\)$)/)[0]}" title="${m.match(/(?<=^\[.+?\]\([^\(\)\s]+? ").*?(?="\)$)/)[0]}">${m.match(/(?<=^\[).+?(?=\]\([^\(\)\s]+? "[^\[\]\(\) "]*?"\))/)[0]}</a>`), i);
        } else if (t.match(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/)) {
            /**
             * @type {String} マッチした文字列
             */
            const m = t.match(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/)[0];
            href(t.replace(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/, ((Object.prototype.hasOwnProperty.call(data.refstylelink, m.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0])) ? `<a href="${data.refstylelink[m.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0]].href}" title="${((data.refstylelink[m.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0]].title!=null)?(data.refstylelink[m.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0]].title.replace(/"/g,'&quot;')):(data.refstylelink[m.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0]].href))}">${m.match(/(?<=^\[)[^\[\]]+(?=\]\s*\[[^\s\[\]]+\]$)/)[0]}</a>` : m.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')), i));
        } else {
            insert(t, i);
        }
    }

    /**
     * 挿入
     * @param {String} t 変換するテキスト
     * @param {Number} i 要素のインデックス
     */
    function insert(t, i) {
        if (0 < data.codetext.length) {
            /**
             * @type {Object} コードへの参照とテキスト
             */
            const codeobj = data.codetext.pop();
            insert(t.replace(`<code class="${codeobj.class}"></code>`, `<code class="${codeobj.class}">${codeobj.text.replace(/&#92;/g, '\\\\').replace(/&#96;/g, '\\`').replace(/&#42;/g, '\\*').replace(/&#95;/g, '\\_').replace(/&#123;/g, '\\{').replace(/&#125;/g, '\\}').replace(/&#91;/g, '\\[').replace(/&#93;/g, '\\]').replace(/&lt;/g, '\\<').replace(/&gt;/g, '\\>').replace(/&#40;/g, '\\(').replace(/&#41;/g, '\\)').replace(/&#35;/g, '\\#').replace(/&#43;/g, '\\+').replace(/&#45;/g, '\\-').replace(/&#46;/g, '\\.').replace(/&#33;/g, '\\!').replace(/&#124;/g, '\\|').replace(/&equals;/g, '\\=').replace(/&amp;/g, '\\&').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`), i);
        } else if (0 < result.length && data.listnumber !== -1) {
            if (result[result.length - 1].match(/<li>$/) && t.match(/^\[( |x)\] .+$/)) {
                result.push(t.replace(/^\[( |x)\]/, `<input type="checkbox" disabled${((t.match(/(?<=^\[)( |x)(?=\] .+$)/)[0] === 'x') ? ' checked' : '')}>`));
            } else {
                result.push(t);
            }
        } else {
            result.push(t);
        }
    }

    /**
     * 脚注を最後に挿入
     * @param {String} k オブジェクトのkey
     * @param {Number} i 要素のインデックス
     */
    function footnote(k, i) {
        if (i === 0) {
            result.push('<ol id="footnote">');
        }
        result.push(`<li id="${encodeURIComponent(k)}">${data.footnote[k].text.replace(/\n/g, '<br>')}</li>`);
                    if (i === Object.keys(data.footnote).length - 1) {
                        result.push('</ol>');
                    }
                }

                //  参照型リンクを先読み
                linespl.forEach(getreflink);

                //  codebqcountをリセット
                data.codebqcount = 0;

                //  htmlに変換
                linespl.forEach(headingcheck);

                //  脚注の挿入
                if (0 < Object.keys(data.footnote).length) {
                    Object.keys(data.footnote).forEach(footnote);
                }

                return result.join('\n');
}