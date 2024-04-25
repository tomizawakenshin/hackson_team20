"use client";

import { useEffect, useState, } from 'react';
import React from 'react'
import '/app/researchHospital.css';

function MyComponent() {
  const [address, setAddress] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Google Maps APIを読み込む
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_r6XctDWr1H8MiGuBOrqTNFsL3imHV5o`;
    script.async = true;
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
    const geocoder = new google.maps.Geocoder();
    const latlng = {
      lat: latitude,
      lng: longitude
    };

    try {
      // Geocodeリクエストを行い、結果を取得
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      // 結果があれば最初の住所を返す
      if (response && response.length > 0) {
        console.log(response[0].formatted_address);
        return extractStreetAddress(response[0].formatted_address);
      } else {
        return "住所が見つかりません";
      }
    } catch (error) {
      console.error("Geocoder failed due to: ", error);
      return "Geocoderエラー: " + error;
    }
  }

  // 住所から番地の部分だけを抽出する関数
  function extractStreetAddress(fullAddress) {
    const startIndex = fullAddress.indexOf(' ');
    const streetAddress = fullAddress.slice(startIndex + 1);
    return streetAddress;
  }

  // 検索関数
  async function searchHospital() {
    const apiKey = 'AIzaSyAcJ-apLCQRIn04yW12exu_zMphmEWKNts';
    const keyword = `${address}%20にある%20${searchInput}%20の診察ができる病院を教えて`;
    console.log("住所: ", keyword);
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=e14ae0429ae364f60&q=${keyword}&num=10`;
    console.log("URL: ", apiUrl);
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

  // 検索結果を表示する関数
function displaySearchResults(results) {
  // console.log(JSON.stringify(results, null, 2));
  // 2つずつの結果をグループ化
  const groupedResults = [];
  for (let i = 0; i < results.length; i += 2) {
    groupedResults.push(results.slice(i, i + 2));
  }
  console.log(groupedResults.map);
  return (
    <div className="search-results">
      <table className="search-results-table">
        <tbody>
          {groupedResults.map((group, index) => (
            <tr key={index} className="search-result-row">
              {group.map((result, resultIndex) => (
                <td key={resultIndex} className="search-result-cell">
                 {result && (
                    <>
                      <a href={result.link} className="search-result-title" target="_blank">{result.title}</a>
                        <>
                          <img src={result.pagemap && result.pagemap.cse_thumbnail && result.pagemap.cse_thumbnail[0] && result.pagemap.cse_thumbnail[0].src} alt="Result Image" className="search-result-image" />
                          <p className="search-result-url">{result.imageLink}</p>
                        </>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  return (
    <div className="main">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="検索"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" id="researchHospital" onClick={searchHospital}>検索</button>
      </div>
      {displaySearchResults(searchResults)}
    </div>
  );
}

export default MyComponent;