export type MapNode = {
    id: string;              // 節點唯一 ID（CID）
    lat: number;             // 緯度
    lng: number;             // 經度
    name: string;            // 節點名
    creator: string;         // 鏈上 address，顯示創建者
    gameUrl?: string;        // 點開跳轉的遊戲網址
    difficulty: number;
  }