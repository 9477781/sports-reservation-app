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

- [x] プロジェクト初期化 (React + Vite + TypeScript)
- [x] ダミーデータによるローカル表示確認
- [x] GitHubリポジトリ (`sports-reservation-app`) へのコードプッシュ完了
- [x] 日英切り替え機能・UI最適化の実装完了
- [x] GASスクリプトの作成・ GitHub連携機能の統合完了
- [x] Vercelへのデプロイ成功・初期公開完了

## 今後の課題・拡張案

1. **GASの自動実行設定**: スプレッドシートの更新に合わせて自動でGitHubへプッシュするトリガーの設定。
2. **パフォーマンス最適化**: 店舗数が非常に多くなった場合の仮想スクロール導入の検討。
3. **お気に入り機能**: ユーザーがよく行く店舗を保存して上位に表示する機能の追加。
