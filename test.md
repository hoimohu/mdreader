# Markdownの基本構文

# 見出し

```Markdown

#の数で見出しのレベルを変えることができる

# h1
## h2
### h3
#### h4
##### h5
###### h6

h1とh2だけ別の書き方がある  
h1は次の行を\=\=に、h2は--にする(=,-の数は2つ以上)

h1
==
h2
--

```

## 結果

#の数で見出しのレベルを変えることができる

# h1
## h2
### h3
#### h4
##### h5
###### h6

h1とh2だけ別の書き方がある  
h1は次の行を\=\=に、h2は--にする(=,-の数は2つ以上)

h1
==
h2
--

# 段落

```Markdown

段落1↓空白行で区切る

段落2

```

## 結果

段落1↓空白行で区切る

段落2

# 改行

```

スペース2つ→  
で改行

```

## 結果

スペース2つ→  
で改行

# 強調

```Markdown

単語を強調

This is a **bold** text.  
This is a __bold__ text.

単語の途中を強調

レモンもミカンの**仲間**です  
レモンもミカンの__仲間__です←アンダースコアは不可

```

## 結果

単語とフレーズ

This is a **bold** text.  
This is a __bold__ text.

単語の途中を強調

レモンもミカンの**仲間**です  
レモンもミカンの__仲間__です←アンダースコアは不可

## イタリック

```

単語

This is a *italic* text.  
This is a _italic_ text.

単語の途中をイタリックに

Kyoto*Nagoya*Tokyo  
Kyoto_Nagoya_Tokyo←アンダースコアは不可

```

## 結果

単語

This is a *italic* text.  
This is a _italic_ text.

単語の途中をイタリックに

Kyoto*Nagoya*Tokyo  
Kyoto_Nagoya_Tokyo←アンダースコアは不可

# 強調+イタリック

```

単語

This is a very ***important*** text.  
This is a very **_important_** text.  
This is a very *__important__* text.  
This is a very _**important**_ text.  
This is a very __*important*__ text.  
This is a very ___important___ text.  

単語の途中を強調+イタリックに

very***Important***Text←これを使うべし  
very**_Important_**Text  
very*__Important__*Text  
very_**Important**_Text  
very__*Important*__Text  
very___Important___Text  

```

## 結果

単語

This is a very ***important*** text.  
This is a very **_important_** text.  
This is a very *__important__* text.  
This is a very _**important**_ text.  
This is a very __*important*__ text.  
This is a very ___important___ text.  

単語の途中を強調+イタリックに

very***Important***Text←これを使うべし  
very**_Important_**Text  
very*__Important__*Text  
very_**Important**_Text  
very__*Important*__Text  
very___Important___Text  

# 引用

```

> これは引用です

> 複数の段落の引用の場合
> 
> \>のみの行を追加します

> 入れ子にする場合は
>> \>の数を増やします

```

## 結果

> これは引用です

> 複数の段落の引用の場合
> 
> \>のみの行を追加します

> 入れ子にする場合は
>> \>の数を増やします

# リスト

```

順序付きリスト

1. a
2. b
3. c
4. d

数字は1から始めれば順番でなくてもよい

1. a
3. b
11. c
1110. d

階層化

1. a
2. b
    1. a
    2. b
3. c

数字の後にピリオドを付けて行頭に置きたいとき
1\. のようにバックスラッシュでエスケープできます

順序付けされていないリスト

- a
- a
- a

+ a
+ a
+ a

* a
* a
* a

同じリストに違う記号を混ぜるのはダメ

- a
* a
+ a
- a

階層化

- a
- a 
    - b
    
+ a
+ a 
    + b

* a
* a 
    * b

リストの途中で要素(段落など)を挟む

* a
* a

    段落(タブもしくは4つのスペース)

* a

* a
* a

    > 引用

* a

順序付きリストに順序付けされていないリストを入れ子にする(その逆も)

1. a
2. b
3. c
    * ©
    * C
4. d

* 1
* a
* A
    1. A
    2. B
* あ

```

## 結果

順序付きリスト

1. a
2. b
3. c
4. d

数字は1から始めれば順番でなくてもよい

1. a
3. b
11. c
1110. d

階層化

1. a
2. b
    1. a
    2. b
3. c

数字の後にピリオドを付けて行頭に置きたいとき  
1\. のようにバックスラッシュでエスケープできます

順序付けされていないリスト

- a
- a
- a

+ a
+ a
+ a

* a
* a
* a

同じリストに違う記号を混ぜるのはダメ

- a
* a
+ a
- a

階層化

- a
- a 
    - b
    
+ a
+ a 
    + b

* a
* a 
    * b

リストの途中で要素(段落など)を挟む

* a
* a

    段落(タブもしくは4つのスペース)

* a

+ b
+ b

    > 引用

+ b

順序付きリストに順序付けされていないリストを入れ子にする(その逆も)

1. a
2. b
3. c
    * ©
    * C
4. d

* 1
* a
* A
    1. A
    2. B
* あ

# コード

```

コードは`<html></html>`のようにバッククォートで囲む

囲むコードにバッククォートが含まれている場合、``const a = `a`;``のように二つのバッククォートで囲む

また、タブもしくは4つのスペースを行頭におくとコードブロックを表せる

    <html>
        <head></head>
        <body></body>
    </html>

```

## 結果

コードは`<html></html>`のようにバッククォートで囲む

コードにバッククォートが含まれている場合、``const a = `a`;``のように2つのバッククォートで囲む

また、タブもしくは4つのスペースを行頭におくとコードブロックを表せる

    <html>
        <head></head>
        <body></body>
    </html>

# 水平線

```

3つ以上のアスタリスク(***)、ダッシュ(---)、アンダースコア(___)のみの行を作る

***

---

___

```

## 結果

3つ以上のアスタリスク(***)、ダッシュ(---)、アンダースコア(___)のみの行を作る

***

---

___

# リンク

```

リンクのテキストを[]で囲み、その後すぐにリンクのURLを()で囲ったものを続ける  
タイトルをつける場合はURLの後にスペース+ダブルクォーテーションで囲んだタイトル

リンクの例→ [ここをクリック](http://www.example.com/)  
リンクの例→ [ここをクリック](http://www.example.com/ "タイトル付き")

リンクを強調する場合は[]()を囲む、コードにする場合は[]の中身を囲む

リンクの例→ **[ここをクリック](http://www.example.com/)**  
リンクの例→ *[ここをクリック](http://www.example.com/)*  
リンクの例→ [`ここをクリック`](http://www.example.com/)

また、<>でURL、メールアドレスを囲ってそのままリンクにもできる

<http://www.example.com/>

```

## 結果

リンクのテキストを[]で囲み、その後すぐにリンクのURLを()で囲ったものを続ける  
タイトルをつける場合はURLの後にスペース+ダブルクォーテーションで囲んだタイトル

リンクの例→ [ここをクリック](http://www.example.com/)  
リンクの例→ [ここをクリック](http://www.example.com/ "タイトル付き")

リンクを強調する場合は[]()を囲む、コードにする場合は[]の中身を囲む

リンクの例→ **[ここをクリック](http://www.example.com/)**  
リンクの例→ *[ここをクリック](http://www.example.com/)*  
リンクの例→ [`ここをクリック`](http://www.example.com/)

また、\<\>でURL、メールアドレスを囲ってそのままリンクにもできる

<http://www.example.com/>

# 参照型リンク

```

[テキスト][参照先の文字(大文字小文字の区別はない)]

[example][1]  
[example] [1]←上と同じ

※なぜかVS codeだと同じにならない

[参照]:(スペース)URL単体もしくは<>で囲んだURL(スペース)"、'、()のいずれかで囲んだタイトル

[1]: http://www.example.com/
[1]: http://www.example.com/ "タイトル"
[1]: http://www.example.com/ 'タイトル'
[1]: http://www.example.com/ (タイトル)
[1]: <http://www.example.com/> "タイトル"
[1]: <http://www.example.com/> 'タイトル'
[1]: <http://www.example.com/> (タイトル)

```

## 結果

[テキスト][参照先の文字(大文字小文字の区別はない)]

[example][1]  
[example] [1]←上と同じ

※VS codeだと同じにならない

[参照]:(スペース)URL単体もしくは\<\>で囲んだURL(スペース)"、'、()のいずれかで囲んだタイトル

[1]: http://www.example.com/
[1]: http://www.example.com/ "タイトル"
[1]: http://www.example.com/ 'タイトル'
[1]: http://www.example.com/ (タイトル)
[1]: <http://www.example.com/> "タイトル"
[1]: <http://www.example.com/> 'タイトル'
[1]: <http://www.example.com/> (タイトル)

# 画像

```

!←エクスクラメーションマーク[画像の代替テキスト](画像のURL "画像のタイトル")  
[!←エクスクラメーションマーク[画像の代替テキスト](画像のURL "画像のタイトル")](リンク先のURL)

![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")  
[![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")](http://www.example.com/)

```

## 結果

!←エクスクラメーションマーク[画像の代替テキスト](画像のURL "画像のタイトル")  
[!←エクスクラメーションマーク[画像の代替テキスト](画像のURL "画像のタイトル")](リンク先のURL)

![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")  
[![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")](http://www.example.com/)

# エスケープ文字

```

エスケープ文字(バックスラッシュを前につける)

\\

\`

\*

\_

\{

\}

\[

\]

\<

\>

\(

\)

\#

\+

\-

\.

\!

\|

```

## 結果

エスケープ文字(バックスラッシュを前につける)

\\

\`

\*

\_

\{

\}

\[

\]

\<

\>

\(

\)

\#

\+

\-

\.

\!

\|

# HTMLタグ

```

HTMLタグを使用できる

![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")  
<img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+" alt="しろくろ" title="ものくろ">

↑どちらも同じ

```

## 結果

HTMLタグを使用できる

![しろくろ](data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+ "ものくろ")  
<img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMiAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KICAgIDxyZWN0IHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIiAvPg0KPC9zdmc+" alt="しろくろ" title="ものくろ">

↑どちらも同じ


