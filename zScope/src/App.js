import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const dogImages = {
    'ボーダー・コリー': '/Collie.jpg',
    'イングリッシュ・ブルドッグ': '/Fbulldog.jpg',
    'パピヨン': '/Papillon.jpg',
    'ラブラドール・レトリバー': '/Retriever.jpg',
    'シベリアン・ハスキー': '/Huskey.jpg',
    'ジャーマン・シェパード': '/Shepherd.jpg',
    'カヴァリア・キング・チャールズ・スパニエル': '/Spaniel.jpg',
    'ドーベルマン': '/Doberman.jpg',
    'オーストラリアン・シェパード': 'Ashepherd.jpg',
    'セント・バーナード': '/Bernard.jpg',
    'ダルメシアン': '/Dalmatian.jpg',
    'ゴールデン・レトリバー': '/Gretriever.jpg',
  };
  
  const [mySign, setMySign] = useState('');
  const [partnerSign, setPartnerSign] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [dogType, setDogType] = useState('');
  const [dogCharacter, setDogCharacter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mySign) {
      fetchDogInfo();
    }
    calculateCompatibility();
  }, [mySign, partnerSign]);

  const handleSignChange = (event, setter) => {
    setter(event.target.value);
  };

  const fetchDogInfo = async () => {
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A2:C13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === mySign);
      if (matchingRow) {
        setDogType(matchingRow[1]);
        setDogCharacter(matchingRow[2]);
      } else {
        setDogType('');
        setDogCharacter('');
      }
    } catch (error) {
      console.error('Error fetching dog data:', error);
      setError('Failed to load dog data.');
    }
  };

  const calculateCompatibility = async () => {
    setError('');
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const values = data.values;
      const matchingRow = values.find(row => row[0] === mySign && row[1] === partnerSign);
      if (matchingRow) {
        setCompatibility(matchingRow[2]); // Chemistry値を設定
      } else {
        setCompatibility('??'); // マッチするデータがない場合
      }
    } catch (error) {
      console.error('Error fetching compatibility data:', error);
      setError('Failed to load compatibility data.');
    }
  };

  return (
    <div className="App">
      <h1>星座相性チェッカー</h1>
      <div>
        <label>あなたの星座：</label>
        <select value={mySign} onChange={(e) => handleSignChange(e, setMySign)}>
          <option value="">選択してください</option>
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>
        <br></br>
        <label>相手の星座：</label>
        <select value={partnerSign} onChange={(e) => handleSignChange(e, setPartnerSign)}>
          <option value="">選択してください</option>
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>
      </div>
      <br></br>
      {dogType && (
        <p><br></br><b>あなたの星座を犬に例えると:<br></br> {dogType}</b></p>
      )}
      {dogCharacter && (
        <>
        <p><b>性格を一言でいうと:<br></br> {dogCharacter}</b></p>
        <img src={dogImages[dogType]} alt={`画像：${dogType}`} />
        </>
      )}
      <br></br>
      <button onClick={calculateCompatibility}>相性をチェック</button>


      {compatibility !== null && (
        <p><br></br><b>あなたと相手の相性は {compatibility}% です！</b></p>
      )}
      {error && (
        <p className="error">エラー: {error}</p> // エラーメッセージを表示
      )}
    </div>
  );
}

export default App;
