# Week 3 - 全台公車動態時刻查詢應用服務

GitHub Page: [https://celeste6666.github.io/DynamicBusRoute/](https://celeste6666.github.io/DynamicBusRoute/)

採用 F2E 3rd [lencheng之設計稿](https://2021.thef2e.com/users/6296427084285740109?week=3&type=1)。


# 使用技術

- Vue3
- Vuex
- Vue Router
- Vue CLI
- Leaflet
- Bootstrap
- Font-Awesome

API 採用[ TDX 運輸資料流通服務](https://tdx.transportdata.tw/api-service/swagger)。

# 挑戰

已經用 Vue.js 等相關技術去製作前 2 週的介面，但好像一直都沒想辦法簡化程式碼，有些用過的功能，在模組中不斷地出現，我都是用複製貼上的方式處理，所以本次想試試將這些重複的功能單獨拎出來，再透過 import 引入。

另外也要嘗試將 vuex 中 actions 中的程式碼簡化，每次執行不同 API 請求就製作一個方法，但方法內的功能大同小異，所以這次業要嘗試將其縮減。


## Icon

bookmark
reply
globe
map
map-marker
bars
chevron-up
chevron-down
exchange-alt
backspace
