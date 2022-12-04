/**
 * マークダウンをHTMLに変換
 * @param {String} markdown HTMLに変換するマークダウンテキスト
 * @return {String} 結果
 */
function mdread(markdown) {
    /**
     * 文字列が空白ではないかの判定
     * @param {String} text 検証する文字列
     * @return {Boolean} 空白ならfalse,空白ではないならtrue
     */
    function isntEmpty(text) {
        if (text !== '') return true;
        return false;
    }

    /**
     * タグで文字列を囲む
     * @param {String} text 囲む対象の文字列
     * @param {String} tag 囲むHTMLタグの名前
     * @return {String} 結果
     */
    function surroundTag(text, tag) {
        return `<${tag}>${text}</${tag}>`;
    }

    /**
     * @type {String} エスケープした文字列
     */
    const escaped = markdown.replace(/\\&/g, '&amp;').replace(/\\\\/g, '&#92;').replace(/\\`/g, '&#96;').replace(/\\\*/g, '&#42;').replace(/\\_/g, '&#95;').replace(/\\{/g, '&#123;').replace(/\\}/g, '&#125;').replace(/\\\[/g, '&#91;').replace(/\\\]/g, '&#93;').replace(/\\</g, '&lt;').replace(/\\>/g, '&gt;').replace(/\\\(/g, '&#40;').replace(/\\\)/g, '&#41;').replace(/\\#/g, '&#35;').replace(/\\\+/g, '&#43;').replace(/\\-/g, '&#45;').replace(/\\\./g, '&#46;').replace(/\\!/g, '&#33;').replace(/\\\|/g, '&#124;').replace(/\\=/g, '&equals;').replace(/\\~/g, '&sim;').replace(/\\\^/g, '&#094;');
    /**
     * @type {Object} リンクの参照先
     */
    const refLink = {};
    /**
     * @type {Array<String>} 参照探索用配列
     */
    const searchrefArray = ('\n' + escaped).split(/\n\s*```/g);
    for (let index = 0; index < searchrefArray.length; index++) {
        if (index % 2 === 0) {
            /**
             * @type {Array<String>} 検査する文字列の配列
             */
            const element = searchrefArray[index].split('\n');
            for (let index2 = 0; index2 < element.length; index2++) {
                /**
                 * @type {String} 検査する文字列
                 */
                const element2 = element[index2];
                if (element2.match(/^\[.+\]:\s+<.+>/)) {
                    if (element2.match(/^\[.+\]:\s+<.+>\s*$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+<)\S+(?=>\s*$)/)
                        };
                    } else if (element2.match(/^\[.+\]:\s+<.+>\s+".+"$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+<)\S+(?=>\s+\S+\s*$)/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+"/, '').replace(/"\s*$/, '')
                        };
                    } else if (element2.match(/^\[.+\]:\s+<.+>\s+'.+'$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+<)\S+(?=>\s+\S+\s*$)/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+'/, '').replace(/'\s*$/, '')
                        };
                    } else if (element2.match(/^\[.+\]:\s+<.+>\s+\(.+\)$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+<)\S+(?=>\s+\S+\s*$)/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+\(/, '').replace(/\)\s*$/, '')
                        };
                    }
                } else {
                    if (element2.match(/^\[.+\]:\s+.+\s*$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+)\S+/)
                        };
                    } else if (element2.match(/^\[.+\]:\s+.+\s+".+"$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+)\S+/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+"/, '').replace(/"\s*$/, '')
                        };
                    } else if (element2.match(/^\[.+\]:\s+.+\s+'.+'$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+)\S+/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+'/, '').replace(/'\s*$/, '')
                        };
                    } else if (element2.match(/^\[.+\]:\s+.+\s+\(.+\)$/)) {
                        refLink[element2.match(/(?<=^\[).+?(?=\]:\s)/)] = {
                            href: element2.match(/(?<=^\[.+?\]:\s+)\S+/),
                            title: element2.replace(/^\[.+?\]:\s+\S+\s+\(/, '').replace(/\)\s*$/, '')
                        };
                    }
                }
            }
        }
    }

    /**
     * ハイパーリンクの追加等
     * @param {String} text 変換するテキスト
     */
    function href(text) {
        if (text.match(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/)[0];
            return href(text.replace(/<[^<>\s]+:\/\/[^<>\s]+\.[^<>\s]+>/, `<a href="${matched.match(/(?<=^<).+(?=>$)/)[0]}">${matched.match(/(?<=^<).+(?=>$)/)[0]}</a>`));
        } else if (text.match(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/)[0];
            return href(text.replace(/<[^<>\s]+@[^<>\s]+\.[^<>\s]+>/, `<a href="${matched.match(/(?<=^<).+(?=>$)/)[0]}">${matched.match(/(?<=^<).+(?=>$)/)[0]}</a>`));
        } else if (text.match(/!\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/!\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)[0];
            return href(text.replace(/!\[.+?\]\([^\(\)\s]+? "[^!\[\]\(\) "]+"\)/, `<img src="${matched.match(/(?<=^!\[.+?\]\()[^\(\)\s]+?(?= "[^\[\]\(\) "]*?"\)$)/)[0]}" title="${matched.match(/(?<=^!\[.+?\]\([^\(\)\s]+? ").*?(?="\)$)/)[0]}" alt="${matched.match(/(?<=^!\[).+?(?=\]\([^\(\)\s]+? "[^\[\]\(\) "]*?"\))/)[0]}">`));
        } else if (text.match(/!\[.+\]\([^\(\)\s]+\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/!\[.+?\]\([^\(\)\s]+?\)/)[0];
            return href(text.replace(/!\[.+?\]\([^\(\)\s]+?\)/, `<img src="${matched.match(/(?<=^!\[.+?\]\()[^\(\)\s]+?(?=\)$)/)[0]}" alt="${matched.match(/(?<=^!\[).+?(?=\]\([^\(\)\s]+?\))/)[0]}">`));
        } else if (text.match(/\[.+\]\([^\(\)\s]+\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/\[.+?\]\([^\(\)\s]+?\)/)[0];
            return href(text.replace(/\[.+?\]\([^\(\)\s]+?\)/, `<a href="${matched.match(/(?<=^\[.+?\]\()[^\(\)\s]+?(?=\)$)/)[0]}">${matched.match(/(?<=^\[).+?(?=\]\([^\(\)\s]+?\))/)[0]}</a>`));
        } else if (text.match(/\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/\[.+?\]\([^\(\)\s]+ "[^\[\]\(\) "]+"\)/)[0];
            return href(text.replace(/\[.+?\]\([^\(\)\s]+? "[^\[\]\(\) "]+"\)/, `<a href="${matched.match(/(?<=^\[.+?\]\()[^\(\)\s]+?(?= "[^\[\]\(\) "]*?"\)$)/)[0]}" title="${matched.match(/(?<=^\[.+?\]\([^\(\)\s]+? ").*?(?="\)$)/)[0]}">${matched.match(/(?<=^\[).+?(?=\]\([^\(\)\s]+? "[^\[\]\(\) "]*?"\))/)[0]}</a>`));
        } else if (text.match(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/)) {
            /**
             * @type {String} マッチした文字列
             */
            const matched = text.match(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/)[0];
            const refIndex = matched.match(/(?<=^\[[^\[\]]+\]\s*\[)[^\s\[\]]+(?=\]$)/)[0];
            if (Object.prototype.hasOwnProperty.call(refLink, refIndex)) {
                return href(text.replace(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/, `<a href="${refLink[refIndex].href}" title="${((refLink[refIndex].title != null) ? (refLink[refIndex].title.replace(/"/g, '&quot;')) : (refLink[refIndex].href))}">${matched.match(/(?<=^\[)[^\[\]]+(?=\]\s*\[[^\s\[\]]+\]$)/)[0]}</a>`));
            } else return href(text.replace(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/, text.match(/\[[^\[\]]+\]\s*\[[^\s\[\]]+\]/)[0].replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')));
        } else {
            return text;
        }
    }
    /**
     * 文字の装飾
     * @param {String} text 変換するテキスト
     */
    function decoration(text) {
        if (text.match(/^\s*(\*\*\*|---|___)[\*-_]*\s*$/)) {
            return '<hr>';
        }
        if (text.match(/\*\*\*.+\*\*\*/)) {
            return decoration(text.replace(/\*\*\*.+?\*\*\*/, '<strong><em>' + text.match(/(?<=\*\*\*).+?(?=\*\*\*)/)[0] + '</em></strong>'));
        } else if (text.match(/(^\*| \*)\*_.+_\*(\* |\*$)/)) {
            return decoration(text.replace(/(^\*| \*)\*_.+_\*(\* |\*$)/, '<strong><em>' + text.match(/(?<=(^\*| \*)\*_).+?(?=_\*(\* |\*$))/)[0] + '</em></strong> '));
        } else if (text.match(/(^\*| \*)__.+__(\* |\*$)/)) {
            return decoration(text.replace(/(^\*| \*)__.+__(\* |\*$)/, '<strong><em>' + text.match(/(?<=(^\*| \*)__).+?(?=__(\* |\*$))/)[0] + '</em></strong> '));
        } else if (text.match(/(^_| _)\*\*.+\*\*(_ |_$)/)) {
            return decoration(text.replace(/(^_| _)\*\*.+\*\*(_ |_$)/, '<strong><em>' + text.match(/(?<=(^_| _)\*\*).+?(?=\*\*(_ |_$))/)[0] + '</em></strong> '));
        } else if (text.match(/(^_| _)_\*.+\*_(_ |_$)/)) {
            return decoration(text.replace(/(^_| _)_\*.+\*_(_ |_$)/, '<strong><em>' + text.match(/(?<=(^_| _)_\*).+?(?=\*_(_ |_$))/)[0] + '</em></strong> '));
        } else if (text.match(/(^_| _)__.+__(_ |_$)/)) {
            return decoration(text.replace(/(^_| _)__.+__(_ |_$)/, '<strong><em>' + text.match(/(?<=(^_| _)__).+?(?=__(_ |_$))/)[0] + '</em></strong> '));
        } else if (text.match(/\*\*.+\*\*/)) {
            return decoration(text.replace(/\*\*.+?\*\*/, '<strong>' + text.match(/(?<=\*\*).+?(?=\*\*)/)[0] + '</strong>'));
        } else if (text.match(/\*.+\*/)) {
            return decoration(text.replace(/\*.+?\*/, '<em>' + text.match(/(?<=\*).+?(?=\*)/)[0] + '</em>'));
        } else if (text.match(/(^_| _)_.+_(_ |_$)/)) {
            return decoration(text.replace(/(^_| _)_.+?_(_ |_$)/, '<strong>' + text.match(/(?<=(^_| _)_).+?(?=_(_ |_$))/)[0] + '</strong> '));
        } else if (text.match(/(^_| _).+(_ |_$)/)) {
            return decoration(text.replace(/(^_| _).+?(_ |_$)/, '<em>' + text.match(/(?<=(^_| _)).+?(?=(_ |_$))/)[0] + '</em> '));
        } else if (text.match(/``.+?``/)) {
            return decoration(text.replace(/``.+?``/, '<code>' + text.match(/(?<=``).+?(?=``)/)[0].replace(/`/g, '&#96;') + '</code>'));
        } else if (text.match(/`.+?`/)) {
            return decoration(text.replace(/`.+?`/, '<code>' + text.match(/(?<=`).+?(?=`)/)[0] + '</code>'));
        } else if (text.match(/~~.+~~/)) {
            return decoration(text.replace(/~~.+?~~/, '<del>' + text.match(/(?<=~~).+?(?=~~)/)[0] + '</del>'));
        } else if (text.match(/~.+~/)) {
            return decoration(text.replace(/~.+?~/, '<sub>' + text.match(/(?<=~).+?(?=~)/)[0] + '</sub>'));
        } else if (text.match(/\^.+\^/)) {
            return decoration(text.replace(/\^.+?\^/, '<sup>' + text.match(/(?<=\^).+?(?=\^)/)[0] + '</sup>'));
        } else if (text.match(/==.+==/)) {
            return decoration(text.replace(/==.+?==/, '<mark>' + text.match(/(?<===).+?(?===)/)[0] + '</mark>'));
        } else if (text.match(/  $/)) {
            return href(text.match(/.*(?=  $)/)[0]) + '<br>';
        } else {
            return href(text);
        }
    }

    /**
     * 見出しを変換
     * @param {String} text 変換する文字列
     * @return {String} 結果
     */
    function heading(text) {
        if (!text.match(/^#+\s+.+/)) {
            if (text.match(/^==\s+.+/)) {
                return surroundTag(decoration(text.match(/(?<=^==\s+).+$/)[0]), 'h1');
            } else if (text.match(/^--\s+.+/)) {
                return surroundTag(decoration(text.match(/(?<=^--\s+).+$/)[0]), 'h2');
            } else return decoration(text);
        } else if (text.match(/(?<=^#*)#/g).length < 7) {
            return surroundTag(decoration(text.match(/(?<=^#+\s+).+$/)[0]), 'h' + text.match(/(?<=^#*)#/g).length);
        } else return decoration(text);
    }

    /**
     * 表を変換
     * @param {String} text 変換するテキスト
     */
    function table(text) {
        /**
         * @type {Array<String>} 文字列を分解した配列
         */
        const spl = text.split('\n');
        /**
         * @type {String} 出力文字列
         */
        let output = '';
        /**
         * @type {Array<String>} テーブル変換用配列
         */
        const tableRow = [];
        /**
         * @type {Boolean} 段落かどうか
         */
        let isParagraph = false;
        for (let index = 0; index < spl.length; index++) {
            /**
             * @type {String} 変換する文字列
             */
            const element = spl[index];
            if (element.match(/^\|\s*.+\s*\|$/)) {
                if (tableRow.length === 0 && element.match(/^\|.+\|$/)) {
                    tableRow.push(element);
                } else if (tableRow.length === 1 && element.match(/^\|[\s-:\|]*---[\s-:\|]*\|$/)) {
                    tableRow.push(element);
                } else if (1 < tableRow.length && element.match(/^\|.+\|$/)) {
                    tableRow.push(element);
                }
            } else {
                if (tableRow.length < 3) {
                    if (!isParagraph && isntEmpty(element)) {
                        output += '<p>\n';
                        isParagraph = true;
                    } if (isParagraph && !isntEmpty(element)) {
                        output += '</p>';
                        isParagraph = false;
                    }
                    while (tableRow.length !== 0) {
                        output += heading(tableRow.shift());
                    }
                    if (isntEmpty(element)) {
                        output += heading(element);
                    }
                } else {
                    /**
                     * @type {Array<string>} 表の寄せの配列
                     */
                    let tablealign = [];
                    tableRow[1].split('|').forEach(e => {
                        if (e.match(/\s*:---+:\s*/)) {
                            tablealign.push('center');
                        } else if (e.match(/\s*:---+\s*/)) {
                            tablealign.push('left');
                        } else if (e.match(/\s*---+:\s*/)) {
                            tablealign.push('right');
                        } else {
                            tablealign.push('');
                        }
                    })
                    for (let index2 = 0; index2 < tableRow.length; index2++) {
                        /**
                         * @type {Array<String>} 変換する文字列を分解した配列
                         */
                        const element2 = tableRow[index2].split('|');
                        for (let index3 = 0; index3 < element2.length; index3++) {
                            /**
                             * @type {String} 変換する文字列
                             */
                            const element3 = element2[index3];
                            if (index2 === 0) {
                                if (index3 === 0) {
                                    output += '<table><thead><tr>';
                                } else if (index3 !== element2.length - 1) {
                                    output += `<th${((tablealign[index3 - 1] != null) ? ((isntEmpty(tablealign[index3 - 1])) ? ' style="text-align:' + tablealign[index3 - 1] + '"' : '') : '')}>${heading(element3)}</th>`;
                                } else {
                                    output += '</tr></thead><tbody>';
                                }
                            } else if (index2 !== 1) {
                                if (index3 === 0) {
                                    output += '<tr>';
                                } else if (index3 !== tableRow[index2].split('|') - 1) {
                                    output += `<td${((tablealign[index3 - 1] != null) ? ((isntEmpty(tablealign[index3 - 1])) ? ' style="text-align:' + tablealign[index3 - 1] + '"' : '') : '')}>${heading(element3)}</td>`;
                                } else {
                                    output += '</tr>';
                                }
                            }
                        }
                        if (index2 === tableRow.length - 1) {
                            output += '</tbody></table>';
                        }
                    }
                }
            }
        }
        return output;
    }

    /**
     * リストを変換
     * @param {String} text 変換する文字列
     * @return {String} 結果
     */
    function list(text) {
        /**
         * @type {Array<String>} 文字列を分解した配列
         */
        const spl = text.split('\n');
        /**
         * @type {Number} 引用要素の入れ子の深さ
         */
        let depth = -1;
        /**
         * @type {String} 出力文字列
         */
        let output = '';
        /**
         * @type {String} 文字列をためる用
         */
        let stock = '';
        /**
         * @type {Array<String>} 表の入れ子を管理
         */
        let listType = [];
        for (let index = 0; index < spl.length; index++) {
            /**
             * @type {String} 変換する文字列
             */
            const element = spl[index];
            if (element.match(/^\s*(\*|\+|-|\d+\.)\s/)) {
                /**
                 * @type {Number} 変換する文字列の入れ子の深さ（インデント量）
                 */
                const thisDepth = (element.match(/^(    |\t)/g) ? element.match(/^(    |\t)/g).length : 0);
                if (depth === -1) {
                    if (isntEmpty(stock)) {
                        output += table(stock);
                        stock = '';
                    }
                } else {
                    if (isntEmpty(stock)) {
                        output += precode(stock);
                        stock = '';
                    }
                }
                if (depth < thisDepth) {
                    if (element.match(/^\d+\.\s/)) {
                        listType.push('ol');
                        output += '<ol>';
                    } else {
                        listType.push(element.match(/^./));
                        output += '<ul>';
                    }
                    depth = thisDepth;
                } else if (thisDepth < depth) {
                    while (listType.length !== thisDepth + 1) {
                        output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
                    }
                    depth = thisDepth;
                }
                if (listType[listType.length - 1] !== element.match(/^./)[0].replace(/\d/, 'ol')) {
                    output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
                    if (element.match(/^\d+\.\s/)) {
                        listType.push('ol');
                        output += '<ol>';
                    } else {
                        listType.push(element.match(/^./));
                        output += '<ul>';
                    }
                }
                if (element.match(/^\s*(\*|\+|-)\s+\[( |x)\]/)) {
                    output += surroundTag('<input type="checkbox" disabled' + ((element.match(/(?<=\s*(\*|\+|-)\s+\[)( |x)(?=\].*$)/)[0] === 'x') ? ' checked' : '') + '>' + heading(element.match(/(?<=^\s*(\*|\+|-)\s+\[( |x)\]).*$/)[0].replace(/^\s*/, '')), 'li');
                } else {
                    output += surroundTag(heading(element.replace(/^\s*(\d+\.|\*|\+|-)\s+/, '')), 'li') + '\n';
                }
            } else {
                if (spl.length !== index + 1 && index !== 0 && listType.length !== 0) {
                    if (!isntEmpty(spl[index - 1] + spl[index + 1]) && element.match(/^(    |\t)/)) {
                        stock += element.replace(/^\s+/, '');
                    } else if (!(
                        !isntEmpty(element + spl[index + 2]) && spl[index + 1].match(/^(    |\t)/) ||
                        !isntEmpty(element + spl[index - 2]) && spl[index - 1].match(/^(    |\t)/)
                    )) {
                        depth = -1;
                        while (listType.length !== 0) {
                            output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
                        }
                        stock += '\n' + element.replace(/^\s+/, '');
                    }
                } else {
                    if (spl.length === index + 1 && listType.length !== 0 && element.match(/^(    |\t)/)) {
                        if (!isntEmpty(spl[index - 1])) {
                            stock += element.replace(/^\s+/, '');
                        } else {
                            depth = -1;
                            while (listType.length !== 0) {
                                output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
                            }
                            stock += '\n' + element.replace(/^\s+/, '');
                        }
                    } else {
                        depth = -1;
                        while (listType.length !== 0) {
                            output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
                        }
                        stock += '\n' + element.replace(/^\s+/, '');
                    }
                }
            }
        }
        if (depth === -1) {
            while (listType.length !== 0) {
                output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
            }
            if (isntEmpty(stock)) {
                output += table(stock);
                stock = '';
            }
        } else {
            if (isntEmpty(stock)) {
                output += precode(stock);
                stock = '';
            }
            while (listType.length !== 0) {
                output += (listType.pop() === 'ol' ? '</ol>' : '</ul>');
            }
        }
        return output;
    }

    /**
     * 引用を変換
     * @param {String} text 変換する文字列
     * @return {String} 結果
     */
    function blockquote(text) {
        if (('\n' + text).match(/\n>/)) {
            /**
             * @type {Array<String>} 文字列を分解した配列
             */
            const spl = text.split('\n');
            /**
             * @type {Number} 引用要素の入れ子の深さ
             */
            let depth = 0;
            /**
             * @type {String} 出力文字列
             */
            let output = '';
            /**
             * @type {String} 文字列をためる用
             */
            let stock = '';
            for (let index = 0; index < spl.length; index++) {
                /**
                 * @type {String} 変換する文字列
                 */
                const element = spl[index];
                if (element.match(/^>+\s+/)) {
                    /**
                     * @type {Number} 変換する文字列の入れ子の深さ
                     */
                    const thisDepth = element.match(/(?<=^>*)>/g).length;
                    if (depth < thisDepth) {
                        output += precode(stock);
                        stock = '';
                        for (let count = 0; count < thisDepth - depth; count++) {
                            output += '<blockquote>\n';
                        }
                        depth = thisDepth;
                    } else if (thisDepth < depth) {
                        output += precode(stock);
                        stock = '';
                        for (let count = 0; count < depth - thisDepth; count++) {
                            output += '</blockquote>\n';
                        }
                        depth = thisDepth;
                    }
                    stock += element.match(/(?<=^>+\s+).*/);
                } else {
                    if (isntEmpty(stock)) {
                        output += precode(stock);
                    }
                    stock = '';
                    for (let count = 0; count < depth; count++) {
                        output += '</blockquote>\n';
                    }
                    output += list(element) + '\n';
                    depth = 0;
                }
            }
            return output;
        } else {
            return list(text);
        }
    }

    /**
     * コードブロックを変換
     * @param {String} text 変換する文字列
     * @return {String} 結果
     */
    function precode(text) {
        /**
         * @type {Array<String>} 文字列を分解した配列
         */
        const spl = ('\n' + text + '\n').split(/\n\s*```/g);
        /**
         * @type {String} 出力文字列
         */
        let output = '';
        for (let index = 0; index < spl.length; index++) {
            /**
             * @type {String} 変換する文字列
             */
            const element = spl[index];
            if (index % 2 === 0) {
                if (index === spl.length - 1 && spl.length !== 1) {
                    output += blockquote('\n```' + element);
                } else {
                    output += blockquote(element);
                }
            } else {
                if (!element.match(/^\s*\n/)) {
                    output += '<pre class="language-' + element.match(/^(?<=\s*).+(?=\n)/)[0].replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"><code>' + element.replace(/^.+/, '') + '</code></pre>';
                } else {
                    output += '<pre><code>' + element.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
                }
            }
        }
        return output;
    }

    //変換開始
    return precode(escaped);
}