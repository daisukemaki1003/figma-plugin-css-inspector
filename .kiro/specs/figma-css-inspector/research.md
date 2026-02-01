# Research & Design Decisions

## Summary
- **Feature**: `figma-css-inspector`
- **Discovery Scope**: New Feature（グリーンフィールド開発）
- **Key Findings**:
  - Figma Plugin APIは`getCSSAsync()`メソッドでCSS抽出を直接サポート
  - プラグインはcode.ts（メインスレッド）とui.html（iframe）の2ファイル構成
  - postMessage APIによる双方向通信が必要

## Research Log

### Figma Plugin API - CSS抽出機能
- **Context**: 選択ノードからCSSプロパティを取得する方法の調査
- **Sources Consulted**:
  - [Figma Plugin API - Shared Node Properties](https://developers.figma.com/docs/plugins/api/node-properties/)
  - [Figma Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/)
- **Findings**:
  - `node.getCSSAsync()` - Figma Inspect panelと同等のCSSをJSON形式で返却
  - 手動でも各プロパティ（fills, strokes, effects, typography等）から取得可能
  - 返却形式: `{ "property-name": "value", ... }`
- **Implications**: getCSSAsyncをベースにしつつ、カテゴリ分類ロジックを追加実装

### Figma Plugin アーキテクチャ
- **Context**: プラグイン構造とUI通信方式の理解
- **Sources Consulted**:
  - [Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/)
  - [postMessage Documentation](https://developers.figma.com/docs/plugins/api/properties/figma-ui-postmessage/)
- **Findings**:
  - 2ファイル構成: `code.ts`（Figma APIアクセス）、`ui.html`（ユーザーインターフェース）
  - iframe内でUIが動作、`figma.showUI(__html__)`で表示
  - 通信: UI→Plugin: `parent.postMessage({ pluginMessage }, '*')`
  - 通信: Plugin→UI: `figma.ui.postMessage(data)`
  - themeColorsオプションでライト/ダークテーマ対応可能
- **Implications**: メッセージベースの非同期通信設計が必要、型安全なメッセージ型定義推奨

### ノードプロパティとCSS対応
- **Context**: FigmaノードプロパティからCSSへのマッピング理解
- **Sources Consulted**:
  - [Shared Node Properties](https://developers.figma.com/docs/plugins/api/node-properties/)
- **Findings**:
  - レイアウト: width, height, x, y, rotation, layoutMode, itemSpacing, padding系
  - 色・塗り: fills, fillStyleId, opacity, blendMode
  - 線: strokes, strokeWeight, strokeAlign, strokeCap, strokeJoin, dashPattern
  - 効果: effects, effectStyleId
  - 角丸: cornerRadius, 個別角指定（topLeftRadius等）
  - テキスト: fontName, fontSize, fontWeight, letterSpacing, lineHeight, textCase, textDecoration
- **Implications**: カテゴリ分類ロジックはこれらプロパティグループに基づいて設計

### 選択変更の監視
- **Context**: ユーザーの選択変更をリアルタイム検知する方法
- **Sources Consulted**:
  - [Figma API Reference](https://developers.figma.com/docs/plugins/api/api-reference/)
- **Findings**:
  - `figma.on("selectionchange", callback)` でイベント監視
  - `figma.currentPage.selection` で現在選択中ノード取得
- **Implications**: selectionchangeイベントでCSS再抽出をトリガー

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Simple 2-Layer | code.ts + ui.html直接通信 | シンプル、Figma標準パターン | 大規模化で複雑化 | プラグイン規模に適合 |
| React UI | ui部分をReact SPAで実装 | コンポーネント再利用、状態管理 | ビルド設定追加 | 今回採用 |
| Message Queue | 複雑なメッセージルーティング | 拡張性高い | オーバーエンジニアリング | 不採用 |

**Selected**: Simple 2-Layer + React UI
- code.tsでFigma API操作、UIはReactでSPA構築
- 型安全なメッセージング（TypeScript）

## Design Decisions

### Decision: getCSSAsyncベースのCSS抽出
- **Context**: ノードからCSSを取得する方法の選択
- **Alternatives Considered**:
  1. 各プロパティを手動でCSS変換 — 完全な制御可能だが実装コスト高
  2. getCSSAsync使用 — Figma標準出力、実装効率高い
- **Selected Approach**: getCSSAsyncをメインに使用し、カテゴリ分類は後処理で実装
- **Rationale**: Figma公式APIで信頼性高く、Inspectパネルと同等出力を保証
- **Trade-offs**: Figmaの出力形式に依存するが、カスタマイズは後処理で対応可能
- **Follow-up**: 出力されるプロパティ一覧の網羅的テストが必要

### Decision: React + TypeScriptによるUI実装
- **Context**: プラグインUIの技術選定
- **Alternatives Considered**:
  1. Vanilla HTML/CSS/JS — シンプルだが状態管理が煩雑
  2. React + TypeScript — コンポーネント化、型安全性
  3. Vue/Svelte — 代替フレームワーク
- **Selected Approach**: React + TypeScript
- **Rationale**: コンポーネント再利用、状態管理、TypeScriptとの親和性
- **Trade-offs**: ビルドプロセス追加だが、保守性向上
- **Follow-up**: esbuildまたはViteでのビルド設定

### Decision: CSSプロパティのカテゴリ分類
- **Context**: 開発用途別に分類する基準の決定
- **Alternatives Considered**:
  1. CSSプロパティ名のプレフィックスで分類
  2. Figmaプロパティ種別で分類
  3. 開発用途（レイアウト/装飾/テキスト）で分類
- **Selected Approach**: 開発用途ベースの6カテゴリ分類
- **Rationale**: 開発者の実際のワークフローに沿った分類が最も有用
- **Trade-offs**: 一部プロパティは複数カテゴリに関連する可能性
- **Follow-up**: ユーザーフィードバックでカテゴリ調整

## Risks & Mitigations
- **getCSSAsync未サポートノード** — エラーハンドリングとフォールバック表示
- **大量プロパティ時のパフォーマンス** — 仮想スクロールは初期スコープ外、必要に応じて追加
- **クリップボード API制限** — iframe内での navigator.clipboard.writeText 使用（HTTPS必須だがFigma環境で対応済み）

## References
- [Figma Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/) — プラグイン開発の基礎
- [Figma Plugin API Reference](https://developers.figma.com/docs/plugins/api/api-reference/) — 公式APIリファレンス
- [Shared Node Properties](https://developers.figma.com/docs/plugins/api/node-properties/) — ノードプロパティ一覧
- [Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/) — UI作成ガイド
- [Plugin Typings](https://github.com/figma/plugin-typings) — TypeScript型定義
