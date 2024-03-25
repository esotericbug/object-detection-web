/// <reference types="vite/client" />

declare global {
  interface Navigator {
    getUserMedia(
      options: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error?: (error: unknown) => void
    ): void;
    webkitGetUserMedia(
      options: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error?: (error: unknown) => void
    ): void;
    mozGetUserMedia(
      options: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error?: (error: unknown) => void
    ): void;
    mozGetUserMedia(
      options: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error?: (error: unknown) => void
    ): void;
    msGetUserMedia(
      options: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error?: (error: unknown) => void
    ): void;
  }
}

export {};
