import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const dogImages = {
    'ボーダー・コリー': '/Dogs/Collie.jpg',
    'イングリッシュ・ブルドッグ': '/Dogs/Ebulldog.jpg',
    'パピヨン': '/Dogs/Papillon.jpg',
    'ラブラドール・レトリバー': '/Dogs/Lretriever.jpg',
    'シベリアン・ハスキー': '/Dogs/Husky.jpg',
    'ジャーマン・シェパード': '/Dogs/Shepherd.jpg',
    'カヴァリア・キング・チャールズ・スパニエル': '/Dogs/Spaniel.jpg',
    'ドーベルマン': '/Dogs/Doberman.jpg',
    'オーストラリアン・シェパード': '/Dogs/Ashepherd.jpg',
    'セント・バーナード': '/Dogs/Bernard.jpg',
    'ダルメシアン': '/Dogs/Dalmatian.jpg',
    'ゴールデン・レトリバー': '/Dogs/Gretriever.jpg',
  };
  
  const [mySign, setMySign] = useState('');
  const [partnerSign, setPartnerSign] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [dogType1, setDogType1] = useState('');
  const [dogType2, setDogType2] = useState('');
  const [dogCharacter1, setDogCharacter1] = useState('');
  const [dogCharacter2, setDogCharacter2] = useState('');
  const [error, setError] = useState('');
  console.log('mySign:', mySign);
  console.log('partnerSign:', partnerSign);


  useEffect(() => {
    if (mySign) {
      fetchDogInfo(mySign, setDogType1, setDogCharacter1);
    }
    if (partnerSign) {
      fetchDogInfo(partnerSign, setDogType2, setDogCharacter2);
    }
  }, [mySign, partnerSign]); // mySign または partnerSign が変更されたときに実行
  

  const handleSignChange = (event, setter) => {
    setter(event.target.value);
    setError(''); // Reset error state when changing sign
    setCompatibility(null); // Reset compatibility when changing signs
  };

  const fetchDogInfo = async (sign, setDogType, setDogCharacter) => {
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A2:C13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === sign);
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

    if (!mySign || !partnerSign) {
      setError("Both signs need to be selected.");
      return;
    }
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C145?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data); // デバッグ情報を出力
      const values = data.values;
      const matchingRow = values.find(row => row[0] === mySign && row[1] === partnerSign);
      console.log('Matching row:', matchingRow); // デバッグ情報を出力
      if (matchingRow) {
        setCompatibility(matchingRow[2]); 
      } else {
        setCompatibility('??'); 
      }
    } catch (error) {
      console.error('Error fetching compatibility data:', error);
      setError('Failed to load compatibility data.');
    }
  };

  return (
    <div className="App">
      <h1>犬型星座占い</h1>
      <div>
        <label>あなたの星座：</label>
        <select value={mySign} onChange={(e) => handleSignChange(e, setMySign)}>
          <option value="">選択してください</option>
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>
      </div>      
      {dogType1 && (
        <p><br /><b>あなたの星座を犬に例えると:</b><br></br> {dogType1}</p>
      )}
      {dogCharacter1 && (
          <>
        <p><b>性格を一言でいうと:</b><br></br> {dogCharacter1}</p>
        <img src={dogImages[dogType1]} alt={`画像：${dogType1}`} className="dog-image" />
        </>
      )}
      {error && (
        <p className="error">エラー: {error}</p> 
      )}
      <br /> 
      <p>相性判断</p><br />

      <label>相手の星座：</label>
        <select value={partnerSign} onChange={(e) => handleSignChange(e, setPartnerSign)}>
          <option value="">選択してください</option>
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>
        {dogType2 && (
        <p><br /><b>相手の星座を犬に例えると</b>:<br></br> {dogType2}</p>
      )}
      {dogCharacter2 && (
          <>
        <p><b>性格を一言でいうと:</b><br></br> {dogCharacter2}</p>
        <img src={dogImages[dogType2]} alt={`画像：${dogType2}`} className="dog-image" />
        </>
      )}
      {error && (
        <p className="error">エラー: {error}</p> 
      )}
      <br /><br />
      <button onClick={calculateCompatibility}>相性をチェック</button>
      {compatibility && (
       <p><br /><b>あなたと相手の相性は {compatibility}% です！</b></p>
   )}
    </div>
  );
}

export default App;
