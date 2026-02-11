
import { StoreData, ReservationStatus } from '../types';

export const getMockStoreData = (): StoreData[] => {
  const dates = ["2/11(水)", "2/12(木)", "2/13(金)", "2/14(土)", "2/15(日)", "2/16(月)", "2/17(火)"];
  const eventNames = ["Sports Event", "Sports Event", "Sports Event", "Sports Event", "Sports Event", "Sports Event", "Sports Event"];
  const matchUps = [
    "日本代表 VS アメリカ代表",
    "日本代表 vs 台湾代表",
    "日本代表 vs 韓国代表",
    "プレミアリーグ 注目カード",
    "チャンピオンズリーグ 決勝T",
    "プロ野球 オープン戦",
    "Bリーグ 注目対戦"
  ];
  
  const generateEvents = (statuses: ReservationStatus[]) => {
    return dates.map((date, i) => ({
      date,
      eventName: eventNames[i],
      matchUp: matchUps[i],
      status: statuses[i] || 'available'
    }));
  };

  return [
    {
      store: {
        id: "store_1",
        numericId: 1,
        name: "８２ 三田店",
        name_en: "82 Mita",
        url: "https://www.pub-hub.com/index.php/shop/detail/5",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['none', 'available', 'available', 'few', 'none', 'available', 'available'])
    },
    {
      store: {
        id: "store_2",
        numericId: 2,
        name: "８２ 赤坂店",
        name_en: "82 Akasaka",
        url: "#",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['none', 'available', 'available', 'available', 'none', 'available', 'available'])
    },
    {
      store: {
        id: "store_3",
        numericId: 3,
        name: "８２ 品川店",
        name_en: "82 Shinagawa",
        url: "#",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['available', 'available', 'available', 'full', 'available', 'available', 'available'])
    },
    {
      store: {
        id: "store_4",
        numericId: 4,
        name: "８２ 浜松町店",
        name_en: "82 Hamamatsucho",
        url: "#",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['none', 'available', 'available', 'available', 'none', 'available', 'available'])
    },
    {
      store: {
        id: "store_5",
        numericId: 5,
        name: "HUB 外苑前店",
        name_en: "HUB Gaienmae",
        url: "#",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['available', 'available', 'available', 'available', 'available', 'available', 'available'])
    },
    {
      store: {
        id: "store_6",
        numericId: 6,
        name: "HUB 新橋銀座口店",
        name_en: "HUB Shinbashi Ginza",
        url: "#",
        address: "東京都 港区",
        region: "関東",
        prefecture: "東京都",
        prefecture_en: "Tokyo",
        city: "港区"
      },
      updatedAt: new Date().toISOString(),
      events: generateEvents(['available', 'available', 'available', 'available', 'available', 'available', 'available'])
    }
  ];
};
