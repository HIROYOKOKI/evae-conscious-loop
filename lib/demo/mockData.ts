export type DemoTabKey = "safe" | "block" | "trace";

export type AuditLogItem = {
  at: string;
  text: string;
};

export type FlowItem = {
  key: "E" | "V" | "Λ";
  label: string;
  color: string;
};

export type ResponsibilityLogItem = {
  actor: string;
  at: string;
  action: string;
};

export const demoMeta = {
  traceId: "TRC-9F27A",
  env: "本番",
  version: "v1.2.7",
};

export const demoTabs: { key: DemoTabKey; label: string; href: string }[] = [
  { key: "safe", label: "安全", href: "/demo/safe" },
  { key: "block", label: "停止", href: "/demo/block" },
  { key: "trace", label: "追跡", href: "/demo/trace" },
];

export const safeMock = {
  statusKey: "SAFE",
  statusLabel: "安全",
  timestamp: "2026-04-22 10:24:18 UTC",
  confidence: "高",
  reason: "入力とポリシー検証に問題がなく、承認範囲内のため実行可能です。",
  flowTitle: "EVΛƎ フロー",
  flow: [
    { key: "E", label: "入力確認済み", color: "#FF4500" },
    { key: "V", label: "文脈理解完了", color: "#1E3A8A" },
    { key: "Λ", label: "ポリシー通過", color: "#84CC16" },
  ] as FlowItem[],
  executionTitle: "実行結果",
  executionResult: "取引先への支払いを 14:00 JST に実行予定。",
  auditTitle: "監査プレビュー",
  auditLinkLabel: "追跡を見る",
  auditLogs: [
    { at: "10:24:16", text: "入力確認完了" },
    { at: "10:24:17", text: "ポリシー検証通過" },
    { at: "10:24:18", text: "SAFEとして承認" },
  ] as AuditLogItem[],
  resolvedMessage: "停止状態から修正され、安全状態に戻りました。",
};

export const blockMock = {
  statusKey: "BLOCK",
  statusLabel: "停止",
  timestamp: "2026-04-22 10:24:34 UTC",
  confidence: "低",
  riskLabel: "高リスク",
  reason: "危険条件を検知したため、実行前に処理を停止しました。",
  riskTitle: "リスク詳細",
  riskLevelLabel: "リスクレベル",
  riskLevelValue: "重大",
  anomalies: ["データ異常", "検証失敗", "推論異常"],
  actionTitle: "対応アクション",
  actions: {
    primary: "修正して再実行",
    secondary: "人による確認へ送る",
    danger: "上書きして実行",
  },
  overrideWarning: "上書き実行は責任ログを生成します。",
  signatureTitle: "Ǝ署名が必要",
  signatureBody: "この判定を上書きして実行するには、有効なƎ署名が必要です。",
  executionStatusTitle: "実行状態",
  executionStatusBadge: "停止中",
  executionStatusBody: [
    "処理は停止されました。",
    "後続処理は実行されていません。",
  ],
  auditTitle: "監査サマリー",
  auditLinkLabel: "追跡を見る",
  auditLogs: [
    { at: "10:24:34", text: "判定: BLOCK（高リスク）" },
    { at: "10:24:34", text: "実行前に処理を停止" },
  ] as AuditLogItem[],
};

export const traceMock = {
  statusKey: "TRACE",
  statusLabel: "追跡",
  timestamp: "2026-04-22 10:25:02 UTC",
  title: "変更追跡 / コミット",
  subtitle: "すべての変更は追跡可能で、元に戻せます。",
  startedAt: "2026-04-22 10:18:43 UTC",
  initiator: "A. Sato",
  timelineTitle: "変更履歴",
  timeline: [
    {
      step: 1,
      at: "10:18:50",
      title: "プロンプト差分を更新",
      description: "取引先支払いポリシー向けのシステムプロンプトを更新。",
    },
    {
      step: 2,
      at: "10:19:12",
      title: "ルール更新を適用",
      description: "取引先支払いのリスク閾値を調整。",
    },
    {
      step: 3,
      at: "10:19:38",
      title: "モデルバージョン変更",
      description: "コアモデルを最新安定版へ更新。",
    },
    {
      step: 4,
      at: "10:20:01",
      title: "対応をコミット",
      description: "最終判定をSAFEとして記録。",
    },
  ],
  diffTitle: "プロンプト差分を更新",
  diffButtonLabel: "差分を表示",
  diffBeforeLabel: "変更前",
  diffAfterLabel: "変更後",
  diffBefore: "金額が10,000円未満で、取引先が確認済みなら支払い承認。",
  diffAfter:
    "金額が20,000円以下で、取引先確認済み、かつリスクスコアが0.78以下なら支払い承認。",
  ruleUpdateTitle: "ルール更新を適用",
  ruleUpdateValue: "リスク閾値を調整: 0.78 → 0.85",
  modelUpdateTitle: "モデルバージョン変更",
  modelUpdateValue: "モデル版: evae-core-1.2.6 → evae-core-1.2.7",
  commitTitle: "対応をコミット",
  commitValue: "最終判定: SAFE",
  responsibilityTitle: "責任ログ",
  responsibilityLinkLabel: "すべて表示",
  responsibilityHeaders: {
    actor: "担当者",
    at: "時刻 (UTC)",
    action: "操作",
  },
  responsibilityLogs: [
    { actor: "A. Sato", at: "10:18:50", action: "プロンプト更新" },
    { actor: "M. Chen", at: "10:19:12", action: "ルール更新を適用" },
    { actor: "A. Sato", at: "10:19:38", action: "モデル版を変更" },
    { actor: "system", at: "10:20:01", action: "対応をコミット" },
  ] as ResponsibilityLogItem[],
  rollbackTitle: "前のルールセットにロールバック",
  rollbackDescription: "「ルール更新を適用」前の状態へ戻す",
  rollbackNote: "ロールバックは監査対象であり、承認が必要です。",
};
