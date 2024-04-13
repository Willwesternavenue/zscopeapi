import React, { useState } from 'react';
import './App.css';

function App() {
  const [mySign, setMySign] = useState('');
  const [partnerSign, setPartnerSign] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [error, setError] = useState(''); // エラーメッセージの状態を追加

  const handleSignChange = (event, setter) => {
    setter(event.target.value);
  };

  const calculateCompatibility = async () => {
    setError(''); // エラー状態をリセット
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY_BASE64;
      const apiKeyDecoded = atob(apiKey); // Base64デコード
  
      const spreadsheetId = "1_ny_jpo6gXKmSTMTaQT1o6RdEKR7UzrLA82aFc_1HV8"; // 実際のスプレッドシートIDを設定
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C13?key=${apiKeyDecoded}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const values = data.values;
  
      // ここでデータを使用するコード
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error.message); // エラーメッセージを状態に保存
    }
  };

  return (
    <div className="App">
      <h1>星座の相性チェッカー</h1>
      <div>
        <label>あなたの星座：</label>
        <select value={mySign} onChange={(e) => handleSignChange(e, setMySign)}>
          <option value="">選択してください</option>
          {/* 12星座のリストをマッピングして選択肢を作成 */}
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
            '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>

        <label>相手の星座：</label>
        <select value={partnerSign} onChange={(e) => handleSignChange(e, setPartnerSign)}>
          <option value="">選択してください</option>
          {/* 同様に12星座のリストをマッピング */}
          {['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
            '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'].map((sign, index) => (
            <option key={index} value={sign}>{sign}</option>
          ))}
        </select>
      </div>
      <button onClick={calculateCompatibility}>相性をチェックする</button>
      {compatibility !== null && (
        <p>あなたと相手の相性は {compatibility}% です！</p>
      )}
      {error && (
        <p className="error">エラー: {error}</p> // エラーメッセージを表示
      )}
    </div>
  );
}

export default App;
