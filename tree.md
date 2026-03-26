# 構文木の解説

## 前置き
ver 3.0.0 では、以前のような文字列から直接HTMLを生成する方法を廃止し、先に構文を解析して木を生成してからHTMLを生成する方法に変更しました。

この変更により、構文解析と描画を分けることができるため、HTML以外の描画をするときなどに便利です。(現在HTML以外の変換を実装する予定はありません)


## 概要
mdr.jsの構文木は `Object` で構成されます。木のすべての要素は `type` プロパティを持っており、 `type` の種類によってその後の処理を変更することができます。

ほぼすべての要素は `children` プロパティを持っていて、下の階層を参照することができます。 その他の多くの要素(`type` が `text` である要素など)は子要素を持つことができませんので、 `children` プロパティはなく、 `content` プロパティを持っています。

mdr.jsの構文木は内部的に `type` が `root` である要素から始まります。木からHTMLなどへの変換では、この `root` 要素の子要素へ下っていくことで実現します。


##  `type` 別　要素説明

### paragraph - 段落

```js
{
  "type": "paragraph",
  "children": [child]
}
```

* `type`: `paragraph` で固定です。
* `children`: 子要素が入る配列です。

### heading - 見出し

```js
{
  "type": "heading",
  "level": number,
  "children": [child]
}
```

* `type`: `heading` で固定です。
* `level`: 見出しの大きさを制御する数値で、1 ~ 6 までの6段階です。
* `children`: 子要素が入る配列です。

### list - 表

```js
{
  "type": "list",
  "ordered": boolean,
  "indentLevel": number,
  "items": [child]
}
```

* `type`: `list` で固定です。
* `ordered`: リストが順序付きかどうかを表します。
* `indentLevel`: リストのインデントの深さを表します。
* `items`: リストの項目が入る配列です。

### listItem - 表の項目

```js
{
  "type": "listItem",
  "children": [child]
}
```

* `type`: `listItem` で固定です。
* `children`: 子要素が入る配列です。

### checkListItem - チェックボックス付きの表の項目

```js
{
  "type": "checkListItem",
  "checked": boolean,
  "children": [child]
}
```

* `type`: `checkListItem` で固定です。
* `checked`: チェックが入っているかどうかを表します。
* `children`: 子要素が入る配列です。

### blockQuote - 引用ブロック

```js
{
  "type": "blockQuote",
  "children": [child]
}
```

* `type`: `blockQuote` で固定です。
* `children`: 子要素が入る配列です。

### note - 補足ブロック

```js
{
  "type": "note",
  "noteType": string,
  "children": [child]
}
```

* `type`: `note` で固定です。
* `noteType`: 補足の種類を表します。
* `children`: 子要素が入る配列です。

### codeBlock - コードブロック

```js
{
  "type": "codeBlock",
  "language": string,
  "content": string
}
```

* `type`: `codeBlock` で固定です。
* `language`: コードブロックの内容のプログラミング言語を表します。指定されていない場合は`""`(空文字)です。
* `content`: コードブロックの内容です。

### mathBlock - 数式ブロック

```js
{
  "type": "mathBlock",
  "content": string
}
```

* `type`: `mathBlock` で固定です。
* `content`: 数式ブロックの内容です。

### note - 補足ブロック

```js
{
  "type": "note",
  "noteType": string,
  "children": [child]
}
```

* `type`: `note` で固定です。
* `noteType`: 補足の種類を表します。
* `children`: 子要素が入る配列です。

### thematicBreak - 仕切り線

```js
{
  "type": "thematicBreak"
}
```

* `type`: `thematicBreak` で固定です。

### footnoteDefinition - 脚注定義

```js
{
  "type": "footnoteDefinition",
  "id": string,
  "footnote": string
}
```

* `type`: `footnoteDefinition` で固定です。
* `id`: 脚注のidです。
* `footnote`: 脚注の内容です。

### referenceDefinition - 参照定義

```js
{
  "type": "referenceDefinition",
  "id": string,
  "url": string
}
```

* `type`: `referenceDefinition` で固定です。
* `id`: 参照のidです。
* `url`: 参照先のURLです。

### table - 表

```js
{
  "type": "table",
  "align": [string],
  "header": [[child]],
  "rows": [
    [[child]]
  ]
}
```

* `type`: `referenceDefinition` で固定です。
* `id`: 参照のidです。
* `url`: 参照先のURLです。

### text - テキスト

```js
{
  "type": "text",
  "content": string
}
```

* `type`: `text` で固定です。
* `content`: 内容です。

### code - インラインコード

```js
{
  "type": "code",
  "content": string
}
```

* `type`: `code` で固定です。
* `content`: 内容です。

### text - テキスト

```js
{
  type: "text",
  content: string
}
```

* `type`: `text` で固定です。
* `content`: 内容です。

### strong - 太字強調

```js
{
  "type": "strong",
  "children": [child]
}
```

* `type`: `strong` で固定です。
* `children`: 子要素が入る配列です。

### em - 斜体強調

```js
{
  "type": "em",
  "children": [child]
}
```

* `type`: `em` で固定です。
* `children`: 子要素が入る配列です。

### math - インライン数式

```js
{
  "type": "math",
  "content": string
}
```

* `type`: `math` で固定です。
* `content`: 内容です。

### deleted - 打消し線

```js
{
  "type": "deleted",
  "children": [child]
}
```

* `type`: `deleted` で固定です。
* `children`: 子要素が入る配列です。

### subscript - 下付き文字

```js
{
  "type": "subscript",
  "children": [child]
}
```

* `type`: `subscript` で固定です。
* `children`: 子要素が入る配列です。

### superscript - 上付き文字

```js
{
  "type": "superscript",
  "children": [child]
}
```

* `type`: `superscript` で固定です。
* `children`: 子要素が入る配列です。

### highlight - ハイライト

```js
{
  "type": "highlight",
  "children": [child]
}
```

* `type`: `superscript` で固定です。
* `children`: 子要素が入る配列です。

### link - リンク

```js
{
  "type": "link",
  "url": string,
  "title": string,
  "children": [child]
}
```

* `type`: `link` で固定です。
* `url`: リンクのURLです。
* `title`: 多くの場合、リンクをホバーしたときに表示される文字列です。
* `children`: 子要素が入る配列です。

### referenceLink - 参照リンク

```js
{
  "type": "referenceLink",
  "id": string,
  "children": [child]
}
```

### footnote - 脚注

```js
{
  "type": "footnote",
  "id": string
}
```

* `type`: `footnote` で固定です。
* `id`: 参照のidです。

### image - 画像

```js
{
  "type": "image",
  "url": string,
  "alt": string,
  "title": string
}
```

* `type`: `image` で固定です。
* `url`: 画像のURLです。
* `alt`: 画像の代替文字です。
* `title`: 多くの場合、画像をホバーしたときに表示される文字列です。

### lineBreak - 改行

```js
{
  "type": "lineBreak"
}
```

* `type`: `lineBreak` で固定です。
