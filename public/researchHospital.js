import { useEffect, useState } from 'react';
import '../app/researchHospital.css';

function MyComponent() {
  const [address, setAddress] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Google Maps APIを読み込む
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_r6XctDWr1H8MiGuBOrqTNFsL3imHV5o`;
    script.defer = true;
    document.head.appendChild(script);

    // 位置情報取得
    if ("geolocation" in navigator) {
      const getPosition = () => new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      getPosition().then(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const fetchedAddress = await getGeolocationAddress(latitude, longitude);
        setAddress(fetchedAddress);
      }).catch((error) => {
        console.error("位置情報の取得に失敗しました: ", error);
      });
    } else {
      console.log("このブラウザでは位置情報の取得がサポートされていません");
    }
  }, []);

  // 位置情報取得関数
  async function getGeolocationAddress(latitude, longitude) {
    // 位置情報取得処理を実装
  }

  // 検索関数
  async function searchHospital() {
    const apiKey = 'AIzaSyAcJ-apLCQRIn04yW12exu_zMphmEWKNts'; // Google Custom Search JSON APIのAPIキー
    // 検索キーワードを組み立てる処理
    const keyword = `${address} ${searchInput} 病院`;

    // Google Custom Search JSON APIのURLを構築
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=e14ae0429ae364f60&q=${encodeURIComponent(keyword)}&num=5`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  return (
    <div className="main">
      <div className="search-container">
        {/* 検索窓 */}
        <input
          type="text"
          className="search-input"
          placeholder="検索"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {/* 検索ボタン */}
        <button className="search-button" id="researchHospital" onClick={searchHospital}>検索</button>
      </div>
      {/* 検索結果 */}
      <div className="search-results">
        {/* 検索結果の表示処理 */}
      </div>
    </div>
  );
}

export default MyComponent;