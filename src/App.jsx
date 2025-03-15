import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <h1>Yesss</h1>;
}
export default App;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
