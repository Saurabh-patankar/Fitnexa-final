import React, { useState } from "react";
import WebcamPose from "../components/PoseDetector/WebcamPose";
import UploadPose from "../components/PoseDetector/UploadPose";
import VideoPose from "../components/PoseDetector/VideoPose";
import PoseOutput from "../components/PoseDetector/PoseOutput";

const AIFormCorrector = () => {
  const [activeTab, setActiveTab] = useState("webcam");
  const [poseData, setPoseData] = useState(null);

  const tabs = [
    { label: "Webcam", value: "webcam" },
    { label: "Image Upload", value: "upload" },
    { label: "Video Upload", value: "video" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setPoseData(null);
              setActiveTab(tab.value);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border rounded-xl p-4 shadow-md">
        {activeTab === "webcam" && <WebcamPose onPoseDetected={setPoseData} />}
        {activeTab === "upload" && <UploadPose onPoseDetected={setPoseData} />}
        {activeTab === "video" && <VideoPose onPoseDetected={setPoseData} />}
      </div>

      <div className="mt-6">
        <PoseOutput pose={poseData} />
      </div>
    </div>
  );
};

export default AIFormCorrector;