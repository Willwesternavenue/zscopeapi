// SocialShare.js
import React, { useState } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import './SocialShare.css'; // CSSファイルをインポート

function SocialShare() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("『わんこ星座占い』あなたの星座を犬に例えると？ 結果は⇒ https://zscopeapi-git-main-willwesternavenues-projects.vercel.app/").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, () => {
      console.error('Copy failed!');
    });
  };

  return (
    <div className="social-share-container">
      <TwitterShareButton
        url={"https://zscopeapi-git-main-willwesternavenues-projects.vercel.app/"}
        title={"Find your zScope here!"}
        hashtags={["Example", "React"]}
      >
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      <button onClick={copyToClipboard} className="copy-link-button">
        <b>{copied ? 'Copied!' : '共有リンク'}</b>
      </button>

      <a href="https://line.me/R/msg/text/?『わんこ星座占い』あなたの星座を犬に例えると？ 結果は⇒ https://zscopeapi-git-main-willwesternavenues-projects.vercel.app/"
         className="line-share-button">
        <img src="/line-512.webp" alt="LINEでシェア" className="line-icon" />
      </a>
    </div>
  );
}

export default SocialShare;
