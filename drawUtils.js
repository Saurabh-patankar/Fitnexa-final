// utils/drawUtils.js

export const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach(kp => {
      if (kp.score > 0.4) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  };
  
  export const drawSkeleton = (keypoints, ctx) => {
    const adjacentPairs = [
      ["left_shoulder", "right_shoulder"],
      ["left_hip", "right_hip"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];
  
    const keypointMap = {};
    keypoints.forEach(kp => (keypointMap[kp.name] = kp));
  
    adjacentPairs.forEach(([p1, p2]) => {
      if (keypointMap[p1]?.score > 0.4 && keypointMap[p2]?.score > 0.4) {
        ctx.beginPath();
        ctx.moveTo(keypointMap[p1].x, keypointMap[p1].y);
        ctx.lineTo(keypointMap[p2].x, keypointMap[p2].y);
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };