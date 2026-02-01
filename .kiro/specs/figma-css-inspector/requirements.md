# Requirements Document

## Introduction
本ドキュメントは、FigmaプラグインCSS Inspectorの要件を定義する。このプラグインは、Figmaで選択したノードからCSSプロパティを抽出し、開発用途別に分類して表示・コピーできる機能を提供する。デザイナーと開発者間のワークフロー効率化を目的とする。

## Project Description (Input)
Figmaの選択ノードからInspect相当のCSSを取得し、
開発用途ごとに分類して読みやすく表示・コピーできる
Figmaプラグインを作成する

## Requirements

### Requirement 1: ノード選択とCSS抽出
**Objective:** As a 開発者, I want Figmaで選択したノードからCSSプロパティを自動抽出したい, so that デザインの実装に必要なスタイル情報を素早く取得できる

#### Acceptance Criteria
1. When ユーザーがFigma上でノードを選択する, the Plugin shall 選択されたノードのCSSプロパティを自動的に抽出して表示する
2. When ユーザーが複数のノードを選択する, the Plugin shall 最初に選択されたノードのCSSプロパティを表示する
3. If ノードが選択されていない状態でプラグインを開く, then the Plugin shall 「ノードを選択してください」というガイダンスメッセージを表示する
4. When 選択ノードが変更される, the Plugin shall 新しく選択されたノードのCSSプロパティに表示を更新する

### Requirement 2: CSSプロパティの分類表示
**Objective:** As a 開発者, I want CSSプロパティを開発用途ごとに分類して表示したい, so that 必要なスタイル情報を素早く見つけることができる

#### Acceptance Criteria
1. The Plugin shall CSSプロパティを以下のカテゴリに分類して表示する: レイアウト（width, height, display, flexbox等）、スペーシング（margin, padding）、タイポグラフィ（font-family, font-size, line-height等）、カラー（color, background-color等）、ボーダー（border, border-radius等）、エフェクト（box-shadow, opacity等）
2. When ユーザーがカテゴリヘッダーをクリックする, the Plugin shall そのカテゴリの内容を折りたたみ/展開する
3. While プロパティが存在しないカテゴリがある, the Plugin shall そのカテゴリを非表示にするか、空であることを示す
4. The Plugin shall 各カテゴリ内のプロパティを論理的な順序で表示する

### Requirement 3: コピー機能
**Objective:** As a 開発者, I want CSSプロパティを簡単にコピーしたい, so that 実装時にスタイルを素早く適用できる

#### Acceptance Criteria
1. When ユーザーが個別のプロパティ行をクリックする, the Plugin shall そのプロパティ（例：`font-size: 16px;`）をクリップボードにコピーする
2. When ユーザーがカテゴリのコピーボタンをクリックする, the Plugin shall そのカテゴリ内の全プロパティをまとめてクリップボードにコピーする
3. When ユーザーが全体コピーボタンをクリックする, the Plugin shall 全カテゴリの全プロパティをクリップボードにコピーする
4. When コピーが成功する, the Plugin shall コピー完了を示す視覚的フィードバック（トースト通知等）を表示する

### Requirement 4: CSS出力フォーマット
**Objective:** As a 開発者, I want 出力されるCSSを適切なフォーマットで取得したい, so that そのまま実装に使用できる

#### Acceptance Criteria
1. The Plugin shall 標準的なCSS構文（プロパティ名: 値;）形式で出力する
2. The Plugin shall 色の値をHEXまたはRGBA形式で出力する
3. The Plugin shall サイズの値をpx単位で出力する
4. Where ノードにauto layoutが適用されている, the Plugin shall flexboxプロパティ（display: flex, flex-direction等）を出力する
5. Where ノードにテキストスタイルが適用されている, the Plugin shall font-family, font-weight, font-size, line-height, letter-spacingを出力する

### Requirement 5: ユーザーインターフェース
**Objective:** As a ユーザー, I want 見やすく使いやすいUIでCSSを確認したい, so that 効率的に作業できる

#### Acceptance Criteria
1. The Plugin shall Figmaのデザインシステムに調和したUIを提供する
2. The Plugin shall プラグインウィンドウをリサイズ可能にする
3. While プロパティを表示中, the Plugin shall プロパティ名と値を視覚的に区別可能な形式で表示する
4. The Plugin shall コード表示部分にモノスペースフォントを使用する
5. If プラグインウィンドウの幅が狭い場合, then the Plugin shall 長いプロパティ値を適切に折り返すまたは省略表示する

### Requirement 6: パフォーマンスと信頼性
**Objective:** As a ユーザー, I want プラグインが高速かつ安定して動作してほしい, so that 作業を中断されることなく使用できる

#### Acceptance Criteria
1. When ノードを選択する, the Plugin shall 500ms以内にCSSプロパティを表示する
2. The Plugin shall Figmaの動作パフォーマンスに悪影響を与えない
3. If CSS抽出中にエラーが発生する, then the Plugin shall ユーザーにエラーメッセージを表示し、クラッシュしない
