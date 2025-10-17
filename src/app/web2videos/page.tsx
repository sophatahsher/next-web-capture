"use client";

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FaArrowDown } from "react-icons/fa";

export default function AnimatedScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  // const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const ffmpegRef = useRef(new FFmpeg());
  const [isReady, setIsReady] = useState(false);

  const [headerText, setHeaderText] = useState("រៀនភាសាចិនដោយខ្លួនឯង");
  const [chineseText, setChineseText] = useState("公司");
  const [pinyinText, setPinyinText] = useState("Gōngsī");
  const [khmerPinyinText, setKhmerPinyinText] = useState("កុងហ្សុឺ");
  const [khmerText, setKhmerText] = useState("ក្រុមហ៊ុន");
  const [englishText, setEnglishText] = useState("Company");

  const gradients = [
    {
      name: "Cinematic Brown",
      class: "bg-gradient-to-b from-[#1a0f00] via-[#2a1d00] to-[#000000]",
    },
    {
      name: "Starry Night",
      class: "bg-[#05070b] bg-[radial-gradient(circle_at_top,_rgba(25,48,92,0.8)_0%,_rgba(5,7,11,1)_100%)]",
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

  useEffect(() => {
    loadFFmpeg();
  }, []);


  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => console.log(message));
    ffmpeg.on("progress", ({ progress }) => setProgress(`Progress: ${Math.round(progress * 100)}%`));

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsReady(true);
      console.log("✅ FFmpeg loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load FFmpeg:", error);
      setProgress("Failed to load FFmpeg. Please refresh the page.");
    }
  };

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

  /** 🎥 Capture animated video */
  // const captureSceneAsVideo = async () => {
  //   if (!sceneRef.current || !isReady) {
  //     alert("FFmpeg is not ready yet. Please wait...");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setProgress("Starting video creation...");

  //   try {
  //     const ffmpeg = ffmpegRef.current;
  //     const duration = 7; // seconds
  //     const fps = 50;
  //     const totalFrames = duration * fps;
  //     const width = 1080;
  //     const height = 1920;

  //     setProgress("Capturing frames...");

  //     for (let i = 0; i < totalFrames; i++) {
  //       const time = i / fps;

  //       // Update animations
  //       if (iconRef.current) {
  //         const bounce = Math.abs(Math.sin(time * Math.PI * 2)) * 50;
  //         iconRef.current.style.transform = `translateY(-${bounce}px)`;
  //       }
  //       if (textRef.current) {
  //         const scale = 1 + Math.sin(time * Math.PI * 2) * 0.05;
  //         textRef.current.style.transform = `scale(${scale})`;
  //       }

  //       await new Promise<void>((resolve) => {
  //         requestAnimationFrame(() => setTimeout(resolve, 10));
  //       });

  //       const canvas = await html2canvas(sceneRef.current, {
  //         width,
  //         height,
  //         backgroundColor: "#000",
  //         scale: 1,
  //         useCORS: true,
  //         allowTaint: false,
  //       });

  //       const blob = await new Promise<Blob>((resolve) => {
  //         canvas.toBlob((b) => resolve(b!), "image/png");
  //       });

  //       const fileData = await fetchFile(blob);
  //       const fileName = `frame_${String(i).padStart(4, "0")}.png`;
  //       await ffmpeg.writeFile(fileName, fileData);

  //       // Simulate real-time capture delay
  //       await new Promise((resolve) => setTimeout(resolve, (1000 / fps) * 1.1));

  //       setProgress(`Captured frame ${i + 1}/${totalFrames}`);
  //     }

  //     setProgress("Encoding video...");

  //     await ffmpeg.exec([
  //       "-framerate", String(fps),
  //       "-pattern_type", "glob",
  //       "-i", "frame_*.png",
  //       "-vf", `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
  //       "-c:v", "libx264",
  //       "-pix_fmt", "yuv420p",
  //       "-movflags", "+faststart",
  //       "-aspect", "9:16",
  //       "output.mp4"
  //     ]);

  //     setProgress("Finalizing...");
  //     const data = await ffmpeg.readFile("output.mp4");
  //     const videoBlob = new Blob([data], { type: "video/mp4" });
  //     const url = URL.createObjectURL(videoBlob);
  //     setVideoUrl(url);

  //     const filename = `animated-scene-${new Date().toISOString().replace(/[:.]/g, "-")}.mp4`;
  //     downloadFile(url, filename);
  //     setProgress(`✅ Video created and downloaded as ${filename}`);
  //   } catch (error) {
  //     console.error("Error creating video:", error);
  //     setProgress(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">បង្កើតរូបភាព ឬ វីដេអូ</h1>

      {/* 🎬 Scene for capture */}
      <div
        ref={sceneRef}
        style={{ width: "1080px", height: "1920px" }}
        // className="relative bg-gradient-to-b from-[#1a0f00] via-[#2a1d00] to-[#000000] text-white flex flex-col justify-center items-center overflow-hidden"
        className={`relative ${selectedGradient} text-white flex flex-col rounded-3xl justify-start items-center overflow-hidden`}
      >
        <h1 ref={textRef} className="suwannaphum text-[5rem] font-bold text-[#fbfbfb] opacity-20 mt-5">
          {headerText}
        </h1>
        {/* <div
          ref={iconRef}
          className="w-96 h-96 rounded-full mb-8 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center"
        >
          <span style={{ fontSize: "240px" }}>🐱</span>
        </div> */}

        {/* Chinese Pinyin */}
        {/* <h5 ref={textRef} className="text-[4rem] font-semibold text-[#8b8b8a] mt-4">
          Gōngsī
        </h5> */}
        <div className="flex-1 flex items-center justify-center w-full -mt-40">
          <div className="content flex flex-col items-center">
            {/* Chinese Text */}
            <div className="text-[5rem]">🇨🇳</div>
            <h1 ref={textRef} className="text-[11rem] font-bold text-[#fbfbfb] -mt-8">
              {chineseText}
            </h1>
            {/* Chinese Pinyin */}
            <div ref={textRef} className="mt-4">
              {/* Chinese Pinyin */}
              <span className="text-[4rem] font-semibold text-[#8b8b8a]">{pinyinText}</span>
              <span className="text-[4rem] font-semibold text-white px-3">-</span>
              {/* Khmer Pinyin */}
              <span className="hanuman text-[4rem] font-semibold text-[#ff4600]">{khmerPinyinText}</span>
            </div>

            {/* CSS Arrow Down */}
            <div className="mt-3 flex flex-col items-center">
              <div className="w-2 h-32 text-[#039d34]"></div>
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
            <h2 ref={textRef} className="suwannaphum text-[7rem] font-bold mt-3 text-left">
              {/* <span className="text-[5rem]">🇰🇭</span>  */}
              <span className="suwannaphum text-[7rem] font-bold">{khmerText}</span>
            </h2>
            {/* English Text */}
            <h3 ref={textRef} className="text-[5rem] font-bold text-[#b9b9b9] mt-5 text-left">
              {/* <span className="text-[5rem]">🇺🇸</span>  */}
              <span className="text-[5rem] font-bold text-[#b9b9b9]">{englishText}</span>
            </h3>
            {/* <div className="content flex flex-col items-center justify-between">
            </div> */}
          </div>
        </div>
      </div>

      {/* 🎥 Control Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={captureImage}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95"
        >
          📸 Capture High-Quality Image
        </button>

        {/* <button
          onClick={captureSceneAsVideo}
          disabled={isLoading || !isReady}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
            isLoading || !isReady
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {isLoading ? "⏳ Creating..." : isReady ? "🎥 Create 9:16 Video" : "⏳ Loading FFmpeg..."}
        </button> */}
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

      {/* 🎬 Video preview */}
      {/* {videoUrl && (
        <div className="mt-6">
          <video
            src={videoUrl}
            controls
            className="w-[270px] h-[480px] rounded-2xl shadow-2xl"
          />
          <a
            href={videoUrl}
            download="animated-scene.mp4"
            className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📥 Download Again
          </a>
        </div>
      )} */}

      <div className="flex flex-col items-center text-black py-3">
        <h1 className="text-2xl font-bold">🎨ជ្រើសរើសពណ៌ផ្ទៃខាងក្រោយ</h1>
        {/* Gradient Selection Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {gradients.map((g, index) => (
            <div
              key={index}
              onClick={() => setSelectedGradient(g.class)}
              className={`cursor-pointer w-10 h-10 rounded-xl ring-4 ${
                selectedGradient === g.class ? "ring-green-400" : "ring-transparent"
              } ${g.class} focus:scale-110 transition-transform`}
              title={g.name}
            />
          ))}
        </div>
        {/* <p className="mt-4 text-sm opacity-70">
          Selected: <span className="font-semibold">{gradients.find(g => g.class === selectedGradient)?.name}</span>
        </p> */}
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