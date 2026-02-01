# CSS Inspector

**選択ノードのCSSを開発用途別に分類表示する Figma プラグイン**

[![Figma](https://img.shields.io/badge/Figma-Plugin-ff7262?logo=figma&logoColor=white)](https://www.figma.com/community/plugin/YOUR_PLUGIN_ID)
[![GitHub Pages](https://img.shields.io/badge/Docs-GitHub%20Pages-blue)](https://YOUR_USERNAME.github.io/figma-css-inspector/)

## 概要

CSS Inspector は、Figmaで選択したノードからCSSプロパティを抽出し、開発用途別に分類して表示するプラグインです。**Dev Mode不要**で、誰でも無料でCSSを確認できます。

👉 **[ドキュメント・使い方はこちら](https://YOUR_USERNAME.github.io/figma-css-inspector/)**

## 特徴

- **6カテゴリに分類**: レイアウト / スペーシング / タイポグラフィ / カラー / ボーダー / エフェクト
- **ワンクリックコピー**: プロパティ・カテゴリ・全体をクリックでコピー
- **Dev Mode不要**: Freeプランでも利用可能
- **高速**: 500ms以内にCSS表示

## インストール

### Figma Community から

1. [CSS Inspector](https://www.figma.com/community/plugin/YOUR_PLUGIN_ID) を開く
2. 「Try it out」をクリック

### 開発版

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/figma-css-inspector.git
cd figma-css-inspector

# 依存関係をインストール
npm install

# ビルド
npm run build
```

Figma Desktop で `Plugins` → `Development` → `Import plugin from manifest...` から `manifest.json` を選択

## 開発

```bash
# 開発サーバー（ファイル変更を監視）
npm run watch

# テスト実行
npm test

# プロダクションビルド
npm run build
```

## プロジェクト構成

```
figma-css-inspector/
├── src/
│   ├── code.ts          # Main Thread (Figma API)
│   ├── types.ts         # 共通型定義
│   ├── SelectionMonitor.ts
│   ├── CSSExtractor.ts
│   └── ui/
│       ├── index.tsx    # UI エントリーポイント
│       ├── App.tsx      # React ルートコンポーネント
│       ├── styles.css
│       ├── components/  # UI コンポーネント
│       └── utils/       # ユーティリティ
├── dist/                # ビルド出力
├── docs/                # GitHub Pages
└── manifest.json        # Figma プラグイン設定
```

## 技術スタック

- **Runtime**: Figma Plugin API
- **Language**: TypeScript
- **UI**: React 18
- **Build**: esbuild
- **Test**: Vitest

## ライセンス

MIT
