import React, { useState, useEffect } from 'react';
import SocialShare from './SocialShare'; 
import './App.css';


function App() {
  
  const dogImages = {
    'ボーダー・コリー': '/Dogs/Collie.jpg',
    'イングリッシュ・ブルドッグ': '/Dogs/Ebulldog.jpg',
    'パピヨン': '/Dogs/Papillon.jpg',
    'ラブラドール・レトリバー': '/Dogs/Lretriever.jpg',
    'シベリアン・ハスキー': '/Dogs/Husky.jpg',
    'ジャーマン・シェパード': '/Dogs/Shepherd.jpg',
    'キャバリア・スパニエル': '/Dogs/Spaniel.jpg',
    'ドーベルマン': '/Dogs/Doberman.jpg',
    'オーストラリアン・シェパード': '/Dogs/Ashepherd.jpg',
    'セント・バーナード': '/Dogs/Bernard.jpg',
    'ダルメシアン': '/Dogs/Dalmatian.jpg',
    'ゴールデン・レトリバー': '/Dogs/Gretriever.jpg',
  };
  
  const zodiacSigns = [
    { label: "牡羊座 (3/21-4/19)", value: "牡羊座" },
    { label: "牡牛座 (4/20-5/20)", value: "牡牛座" },
    { label: "双子座 (5/21-6/21)", value: "双子座" },
    { label: "蟹座 (6/22-7/22)", value: "蟹座" },
    { label: "獅子座 (7/23-8/22)", value: "獅子座" },
    { label: "乙女座 (8/23-9/22)", value: "乙女座" },
    { label: "天秤座 (9/23-10/23)", value: "天秤座" },
    { label: "蠍座 (10/24-11/22)", value: "蠍座" },
    { label: "射手座 (11/23-12/21)", value: "射手座" },
    { label: "山羊座 (12/22-1/19)", value: "山羊座" },
    { label: "水瓶座 (1/20-2/18)", value: "水瓶座" },
    { label: "魚座 (2/19-3/20)", value: "魚座" }
  ];
  


  const [mySign, setMySign] = useState('');
  const [partnerSign, setPartnerSign] = useState('');
  const [childSign, setChildSign] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [advisory, setAdvisory] = useState('');
  const [dogType1, setDogType1] = useState('');
  const [dogType2, setDogType2] = useState('');
  const [dogType3, setDogType3] = useState('');
  const [dogCharacter1, setDogCharacter1] = useState('');
  const [dogCharacter2, setDogCharacter2] = useState('');
  const [dogCharacter3, setDogCharacter3] = useState('');
  const [weakness, setWeakness] = useState(''); 
  const [traits, setTraits] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mySign) {
      fetchDogInfo(mySign, setDogType1, setDogCharacter1);
    }
    if (partnerSign) {
      fetchDogInfo(partnerSign, setDogType2, setDogCharacter2);
    }
    if (childSign) {
      fetchDogInfo(childSign, setDogType3, setDogCharacter3);
    }
  }, [mySign, partnerSign, childSign]); // mySign または partnerSign が変更されたときに実行
  

  const handleSignChange = (event, setter) => {
    setter(event.target.value);
    setError(''); // Reset error state when changing sign
    setCompatibility(null); // Reset compatibility when changing signs
  };

  const fetchDogInfo = async (sign, setDogType, setDogCharacter) => {
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A2:E13?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === sign);
      if (matchingRow) {
        setDogType(matchingRow[1]);
        setDogCharacter(matchingRow[2]);
        setWeakness(matchingRow[3]);
        setDogCharacter3(matchingRow[4]);
      } else {
        setDogType('');
        setDogCharacter('');
        setWeakness('');
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
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:H145?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const values = data.values;
      const matchingRow = values.find(row => row[0] === mySign && row[1] === partnerSign);
      if (matchingRow) {
        setTraits(matchingRow[7]);
        const percentage = parseInt(matchingRow[2], 10); // Make sure to parse the string as an integer
        setCompatibility(percentage);
        setAdvisory(getCompatibilityAdvisory(percentage)); // Set the advisory message
      } else {
        setCompatibility('??');
        setAdvisory('Compatibility could not be determined.');
        console.log('Received data:', data);
        console.log('Matching row:', matchingRow);
        console.log('Traits value:', matchingRow[7]);
      }
    } catch (error) {
      console.error('Error fetching compatibility data:', error);
      setError('Failed to load compatibility data.');
    }
  };

  const [thirdImage, setThirdImage] = useState('');

  useEffect(() => {
    if (mySign && partnerSign) {
        calculateCompatibility();
      fetchAdditionalDogImage();
    }
  }, [mySign, partnerSign]); // mySign と partnerSign が更新されたときに実行

  const fetchAdditionalDogImage = async () => {
    try {
      const apiKey = 'AIzaSyBdSdUJ2SnudvSs0FTYe2aLugIYToCvLOU';
      const spreadsheetId = '1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:E145?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const matchingRow = data.values.find(row => row[0] === mySign && row[1] === partnerSign);
      if (matchingRow) {
        const imageName = matchingRow[4]; // E列から画像名を取得
        setThirdImage(`/Dogs/Hybrid/${imageName}.jpg`);
      } else {
        setThirdImage(''); // 該当する画像がない場合はクリア
      }
    } catch (error) {
      console.error('Error fetching third image:', error);
      setError('Failed to load third image.');
    }
  };

  const getCompatibilityAdvisory = (percentage) => {
    if (percentage >= 90) {
      return "二人の相性は最高です！";
    } else if (percentage >= 80) {
      return "二人の相性は抜群です！";
    } else if (percentage >= 70) {
      return "二人の相性はまずまずです";
    } else if (percentage >= 60) {
      return "二人の相性は平均以上";
    } else if (percentage >= 50) {
      return "相性はそれほどですが、努力次第！";

    } else {
      return "相性はあまり良くないかもしれません";
    }
  };
  
  return ( 
    <div className="App">
      <div className="banner">わんこ星座占い</div>  {/* バナーの追加 */}
      <p>Welcome! 最初にご両親の星座を教えてください</p>
      
      <div className="signs-section">
      <div className="sign-section">
        <label>お父さんの星座：</label>
        <select value={mySign} onChange={(e) => handleSignChange(e, setMySign)}>
          <option value="">星座を選択</option>
          {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>

      {dogType1 && (
        <p><br /><b>お父さんの星座を<br></br>犬に例えると:</b><br></br> {dogType1}</p>
      )}
      {dogCharacter1 && (
          <>
        <p><b>こんな性格:</b><br></br> {dogCharacter1}</p>
        <img src={dogImages[dogType1]} alt={`画像：${dogType1}`} className="dog-image" />
        </>
      )}
      {error && (<p className="error">エラー: {error}</p> )}
      </div>      
      <div className="sign-section">
      <label>お母さんの星座：</label>
        <select value={partnerSign} onChange={(e) => handleSignChange(e, setPartnerSign)}>
          <option value="">星座を選択</option>
          {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>
        {dogType2 && (<p><br /><b>お母さんの星座を<br></br>犬に例えると</b>:<br></br> {dogType2}</p>)}
      {dogCharacter2 && (
          <>
        <p><b>こんな性格:</b><br></br> {dogCharacter2}</p>
        <img src={dogImages[dogType2]} alt={`画像：${dogType2}`} className="dog-image" />
        </>
      )}
      {error && (<p className="error">エラー: {error}</p> )}
  </div>
</div>
      {/*<button onClick={calculateCompatibility}>両親の相性をチェック</button> */}
      {
      compatibility && (
      <>
       <p><b>二人の相性は {compatibility}% です</b></p>
        {/* <p>{advisory}</p> This line displays the advisory message */}
      </>
      )} 
<div className="child-section">
      {thirdImage && (
        <div>
          <img src={thirdImage} alt="本人画像" className="child-image" />
          <p style={{ color: 'red' }}><b>あなたのイメージ像</b></p>
          <p>次にあなたの星座を選ぶと詳しいプロフィールが表示されます</p>
          <label>あなたの星座は </label>
              <select value={childSign} onChange={(e) => handleSignChange(e, setChildSign)}>
              <option value="">星座を選択</option>
              {zodiacSigns.map((sign, index) => (
            <option key={index} value={sign.value}>{sign.label}</option>
          ))}
        </select>
              <br />
      {childSign && dogCharacter3 && (
        <>
        <p><b>Z-タイプ分類名: </b><br></br>{traits || '特徴なし'}<b>{dogType3}</b></p>
        <p><b>あなたの性格は: </b><br></br> {dogCharacter3}</p>
        <p><b>あなたの弱点は: </b><br></br> {weakness}</p>
        </>
      )}
      {childSign && error && <p className="error">エラー: {error}</p>} 
        </div>
      )}
    </div>

      <SocialShare />
      <p>zScope 2024. All Rights Reserved.</p>

  </div>
  );
}
export default App;
