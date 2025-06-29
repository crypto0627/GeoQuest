export type MapNode = {
    id: string;              // 節點唯一 ID（可以是 multiaddr 或 CID）
    lat: number;             // 緯度
    lng: number;             // 經度
    name: string;            // 店名 / 地點名（storeName）
    creator: string;         // 鏈上 address，顯示創建者
    gameUrl?: string;        // 點開跳轉的遊戲網址（選填）
  }