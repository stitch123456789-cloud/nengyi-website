# 能溢有限公司官網

正式網址：https://nengyi-energy.netlify.app

- `index.html`：首頁（0 元 ESCO 方案、電費試算、資格初審表單）
- `solution.html`：產業解決方案頁（依網址 #factory、#office、#hotel、#medical、#retail 切換）
- `thanks.html`：表單送出後的感謝頁
- `assets/`：Logo 與圖示
- `tools/ac-calc.html`：專業版空調節能計算工具
- `tools/diagnosis.html`：免費電費健檢診斷報告產生器（內部使用）

客戶資料、電費單、合約請勿放進這個專案。

## 更新流程

1. Claude 把修改推到 `preview` 分支，Netlify 產生預覽網址 `preview--nengyi-energy.netlify.app`。
2. S 確認後，合併到 `main`，正式網站自動更新。
