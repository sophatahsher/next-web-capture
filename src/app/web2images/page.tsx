"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function AnimatedScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const [headerText, setHeaderText] = useState("រៀនភាសាចិនដោយខ្លួនឯង");
  const [chineseText, setChineseText] = useState("公司");
  const [pinyinText, setPinyinText] = useState("Gōngsī");
  const [khmerPinyinText, setKhmerPinyinText] = useState("កុងហ្សុឺ");
  const [khmerText, setKhmerText] = useState("ក្រុមហ៊ុន");
  const [englishText, setEnglishText] = useState("Company");

  const gradients = [
    {
      name: "Cinematic Brown",
      // class: "bg-gradient-to-b from-[#1a0f00] via-[#2a1d00] to-[#000000]",
      // class:"bg-[#1a0f00] bg-[radial-gradient(circle_at_top,_#1a0f00_0%,_#2a1d00_0%,_#000000_90%)]"
      class:"bg-[#1a0f00] bg-[radial-gradient(circle_at_50%_45%,_#1a0f00_0%,_#2a1d00_10%,_#000000_95%)]"
    },
    {
      name: "Starry Night",
      class: "bg-[#05070b] bg-[radial-gradient(circle_at_top,_rgba(25,48,92,0.8)_0%,_rgba(5,7,11,1)_90%)]",
    },
    {
      name: "Ocean Blue",
      class: "bg-gradient-to-b from-[#004e92] via-[#000428] to-[#000000]",
    },
    {
      name: "Purple Dream",
      class: "bg-gradient-to-b from-[#41295a] via-[#2F0743] to-[#000000]",
    },
    {
      name: "Neon Pink",
      class: "bg-[#04070d] bg-[radial-gradient(circle_at_50%_35%,_rgba(30,70,130,0.55)_0%,_rgba(4,7,13,1)_75%)]",
    },
  ];

  const [selectedGradient, setSelectedGradient] = useState(gradients[0].class);

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /** 📸 Capture one high-quality screenshot */
  const captureImage = async () => {
    if (!sceneRef.current) return alert("Scene not ready!");

    setProgress("Capturing high-quality image...");
    const width = 1080;
    const height = 1920;

    // Capture with high scale for quality (4x resolution)
    const canvas = await html2canvas(sceneRef.current, {
      width,
      height,
      backgroundColor: "#000",
      scale: 4,
      useCORS: true,
      allowTaint: false,
    });

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png", 1.0);
    });

    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    const filename = `screenshot-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    downloadFile(url, filename);
    setProgress(`✅ Screenshot saved as ${filename}`);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">បង្កើតរូបភាព ឬ វីដេអូ</h1>

      {/* 🎬 Scene for capture */}
      <div
        ref={sceneRef}
        style={{ width: "1080px", height: "1920px" }}
        className={`relative ${selectedGradient} text-white flex flex-col rounded-3xl justify-start items-center overflow-hidden`}
      >
        <h1 ref={textRef} className="suwannaphum text-[5rem] font-bold text-[#fbfbfb] opacity-20 mt-5">
          {headerText}
        </h1>

        <div className="flex-1 flex items-center justify-center w-full -mt-40">
          <div className="content flex flex-col items-center">
            {/* Chinese Text */}
            <div className="text-[8rem]">🇨🇳</div>
            <h1 ref={textRef} className="text-[11rem] font-bold text-[#fbfbfb] -mt-8">
              {chineseText}
            </h1>

            {/* Chinese Pinyin */}
            <div ref={textRef} className="mt-4 mb-16">
              <span className="text-[4rem] font-semibold text-[#8b8b8a]">{pinyinText}</span>
              <span className="text-[4rem] font-semibold text-white px-3">-</span>
              <span className="hanuman text-[4rem] font-semibold text-[#ff4600]">{khmerPinyinText}</span>
            </div>

            {/* CSS Arrow Down */}
            <div className="mt-5 flex flex-col items-center">
              {/* <div className="w-2 h-28 bg-[#039d34]"></div> */}
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '40px solid transparent',
                  borderRight: '40px solid transparent',
                  borderTop: '60px solid #039d34'
                }}
              ></div>
            </div>

            {/* Khmer Translation */}
            <h2 ref={textRef} className="suwannaphum text-[7rem] font-bold mt-3 flex items-center">
              <span className="text-[5rem]">🇰🇭</span>
              <span className="suwannaphum text-[7rem] font-bold ml-3">{khmerText}</span>
            </h2>

            {/* English Text */}
            <h3 ref={textRef} className="text-[5rem] font-bold text-[#b9b9b9] mt-5 flex items-center">
              <span className="text-[5rem]">🇺🇸</span>
              <span className="text-[5rem] font-bold text-[#b9b9b9] ml-3">{englishText}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* 🎥 Control Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={captureImage}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95"
        >
          📸 Capture Now
        </button>
      </div>

      {progress && <p className="mt-4 text-sm text-gray-700 font-medium">{progress}</p>}

      {/* 🖼️ Image preview */}
      {imageUrl && (
        <div className="mt-6">
          <h3 className="text-center text-sm text-gray-600 mb-2">Screenshot Preview</h3>
          <img
            src={imageUrl}
            className="w-[270px] h-[480px] rounded-2xl shadow-xl border"
            alt="Captured Scene"
          />
        </div>
      )}

      {/* 🎨 Gradient Selection */}
      <div className="flex flex-col items-center text-black py-3">
        <h1 className="text-2xl font-bold">🎨ជ្រើសរើសពណ៌ផ្ទៃខាងក្រោយ</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {gradients.map((g, index) => (
            <div
              key={index}
              onClick={() => setSelectedGradient(g.class)}
              className={`cursor-pointer w-20 h-20 rounded-xl ring-4 ${
                selectedGradient === g.class ? "ring-green-400" : "ring-transparent"
              } ${g.class} hover:scale-110 transition-transform`}
              title={g.name}
            />
          ))}
        </div>
      </div>

      {/* ✍️ Text Input Section */}
      <div className="flex flex-col items-center text-black py-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">✍️ កែប្រែអត្ថបទ</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Header Text */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ចំណងជើង (Header)</label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none suwannaphum"
              placeholder="រៀនភាសាចិនដោយខ្លួនឯង"
            />
          </div>

          {/* Chinese Text */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ភាសាចិន (Chinese)</label>
            <input
              type="text"
              value={chineseText}
              onChange={(e) => setChineseText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-2xl"
              placeholder="公司"
            />
          </div>

          {/* Pinyin */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ភីនយីន (Pinyin)</label>
            <input
              type="text"
              value={pinyinText}
              onChange={(e) => setPinyinText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Gōngsī"
            />
          </div>

          {/* Khmer Pinyin */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ភីនយីនខ្មែរ (Khmer Pinyin)</label>
            <input
              type="text"
              value={khmerPinyinText}
              onChange={(e) => setKhmerPinyinText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none hanuman"
              placeholder="កុងហ្សុឺ"
            />
          </div>

          {/* Khmer Translation */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ភាសាខ្មែរ (Khmer)</label>
            <input
              type="text"
              value={khmerText}
              onChange={(e) => setKhmerText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none suwannaphum text-xl"
              placeholder="ក្រុមហ៊ុន"
            />
          </div>

          {/* English Translation */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 text-gray-700">ភាសាអង់គ្លេស (English)</label>
            <input
              type="text"
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Company"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setHeaderText("រៀនភាសាចិនដោយខ្លួនឯង");
            setChineseText("公司");
            setPinyinText("Gōngsī");
            setKhmerPinyinText("កុងហ្សុឺ");
            setKhmerText("ក្រុមហ៊ុន");
            setEnglishText("Company");
          }}
          className="mt-6 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 active:scale-95"
        >
          🔄 រៀបចំឡើងវិញ (Reset)
        </button>
      </div>
    </div>
  );
}