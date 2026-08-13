import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("react-native-safe-area-context", async () => {
  const React = await import("react");
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => React.createElement("div", props, children),
  };
});

vi.mock("expo-status-bar", () => ({ StatusBar: () => null }));
vi.mock("@react-native-community/datetimepicker", () => ({ default: () => null }));
vi.mock("react-native-view-shot", async () => {
  const React = await import("react");
  return { default: React.forwardRef(({ children }: { children: React.ReactNode }) => React.createElement("div", null, children)) };
});
