import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { DetectedObject, ObjectDetection } from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { isDesktop } from "react-device-detect";

// function gcd(width?: number, height?: number): number {
//   return !height && height == 0 && width
//     ? width
//     : width && height
//     ? gcd(height, width % height)
//     : 0;
// }

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useWindowSize() {
  const [size, setSize] = useState<{ width?: number; height?: number }>({
    width: undefined,
    height: undefined,
  });

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

const drawRect = (
  detections: DetectedObject[],
  ctx: CanvasRenderingContext2D
) => {
  detections.forEach((detection) => {
    const [x, y, width, height] = detection.bbox;
    const text = detection.class;

    const color = "red";
    ctx.strokeStyle = color;
    ctx.font = "18 px Arial";
    ctx.fillStyle = color;

    //Draw rectangles and text

    ctx.beginPath();
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};

const App: FC = () => {
  const cameraRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Main function
  const runCoco = useCallback(async () => {
    // 3. TODO - Load network
    const [{ load }] = await Promise.all([
      import("@tensorflow-models/coco-ssd"),
      import("@tensorflow/tfjs-core"),
      import("@tensorflow/tfjs-backend-cpu"),
      import("@tensorflow/tfjs-backend-webgl"),
    ]);

    const net = await load();

    setLoading(false);

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 1);
  }, []);

  useEffect(() => {
    runCoco();
  }, [runCoco]);

  const detect = async (net: ObjectDetection) => {
    // Check data is available
    if (
      typeof cameraRef.current !== "undefined" &&
      cameraRef.current?.video &&
      cameraRef.current.video.readyState === 4 &&
      canvasRef.current
    ) {
      // Get Video Properties
      const video = cameraRef.current.video;
      const videoWidth = cameraRef.current.video.videoWidth;
      const videoHeight = cameraRef.current.video.videoHeight;

      // Set video width
      cameraRef.current.video.width = videoWidth;
      cameraRef.current.video.height = videoHeight;

      const ratio = 10;

      // Set canvas height and width
      canvasRef.current.width = videoWidth * ratio;
      canvasRef.current.height = videoHeight * ratio;

      // 4. TODO - Make Detections

      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      ctx?.scale(ratio, ratio);

      // 5. TODO - Update drawing utility
      if (ctx) drawRect(obj, ctx);
    }
  };

  const { height, width } = useWindowSize();

  //   const gcdval = gcd(width, height);

  //   const aspectRatio = width && height ? width / gcdval / (height / gcdval) : 0;

  const Loader: FC = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <span className="loader"></span>
      </div>
    );
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={cameraRef}
          muted={true}
          videoConstraints={{
            facingMode: isDesktop ? "user" : "environment",
            // aspectRatio: isDesktop ? aspectRatio : 1 / aspectRatio,
          }}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 8,
            width: width,
            height: height,
            // transform: "scaleX(-1)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            // transform: "scaleX(-1)",
            width: width ? width - 10 : 0,
            height: height ? height - 10 : 0,
          }}
        />
      </header>
    </div>
  );
};

export default App;
