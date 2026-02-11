# Project: Sports Hub - Real-time Reservation Dashboard

## 概要

100店舗以上のスポーツ放映時の予約状況を確認できるWebアプリケーション。
Googleスプレッドシートをマスターデータとして管理し、GASを用いてJSONデータを生成・GitHubへプッシュすることで、Vercel上のアプリケーションにデータを反映させる仕組み。

## アーキテクチャ

1.  **データソース**: Google Spreadsheets (シート名: `予約状況`)
2.  **データ連携 (ETL)**: Google Apps Script (GAS)
    - スプレッドシートのデータを読み取り。
    - JSONフォーマットに変換。
    - GitHub REST APIを介してリポジトリ内の `public/data/status.json` を更新。
3.  **フロントエンド**: React + Vite
    - `public/data/status.json` (またはAPI経由) からデータを読み込んで表示。
4.  **デプロイ**: Vercel
    - GitHubへのプッシュ（JSONファイルの更新含む）をトリガーに自動デプロイ（または静的ファイルの更新）。

## 技術スタック

- **Frontend**: React 19, Vite, TypeScript
- **Backend/Data**: Google Sheets, Google Apps Script
- **Infra/Hosting**: GitHub, Vercel

## 現在のステータス

- プロジェクトファイルの確認完了。
- `GAS.txt` に連携用スクリプトが存在することを確認。
- `package.json` は React + Vite 構成。

## 次のステップ (Next Steps)

1.  ローカル環境での動作確認 (`npm install`, `npm run dev`)
    - [x] `public/data/status.json` のダミーデータ作成
    - [x] `App.tsx` のデータ取得ロジックを `fetch` に変更
    - [x] ローカルでの画面表示確認
2.  GASのセットアップ（GitHubトークン設定など）
    - [ ] GitHubリポジトリ作成 (`sports-reservation-app`)
    - [ ] ローカルコードのプッシュ
    - [ ] GitHub Tokenの取得
    - [ ] GASへのスクリプトプロパティ設定
3.  Vercelへのデプロイ設定
