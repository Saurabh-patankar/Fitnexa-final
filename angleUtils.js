export const classifyPose = (pose) => {
    if (!pose || !pose.keypoints) return "Unknown";
    const map = pose.keypoints.reduce((acc, kp) => {
      acc[kp.name] = kp;
      return acc;
    }, {});
  
    const { left_knee, left_hip, left_shoulder, right_knee, right_hip, right_shoulder } = map;
  
    if (left_knee && left_hip && left_shoulder) {
      const hipKnee = Math.abs(left_hip.y - left_knee.y);
      const shoulderHip = Math.abs(left_shoulder.y - left_hip.y);
      if (hipKnee < shoulderHip * 0.8) return "Squat";
    }
  
    if (right_shoulder && right_hip && right_knee) {
      const aligned = Math.abs(right_shoulder.y - right_hip.y) < 40 && Math.abs(right_hip.y - right_knee.y) < 40;
      if (aligned) return "Pushup";
    }
  
    return "Unknown";
  };
  // ✅ src/utils/angleUtils.js
export function getAngle(a, b, c) {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
  
    const dot = ab.x * cb.x + ab.y * cb.y;
    const abMag = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    const cbMag = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  
    const angleRad = Math.acos(dot / (abMag * cbMag));
    const angleDeg = (angleRad * 180) / Math.PI;
    return angleDeg;
  }
  
  export const isRep = (label, pose, prevState) => {
    const map = pose.keypoints.reduce((acc, kp) => {
      acc[kp.name] = kp;
      return acc;
    }, {});
  
    if (label === "Squat") {
      if (map.left_knee && map.left_hip) {
        const diff = map.left_hip.y - map.left_knee.y;
        if (diff > 40) return "down";
        else return "up";
      }
    }
  
    if (label === "Pushup") {
      if (map.right_shoulder && map.right_hip) {
        const diff = map.right_shoulder.y - map.right_hip.y;
        if (diff > 20) return "down";
        else return "up";
      }
    }
    return prevState;
  };