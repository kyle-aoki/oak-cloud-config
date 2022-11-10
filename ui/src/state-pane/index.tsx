import { MainState } from "../app/types";
import styled from "styled-components";

export default function StatePane({ state }: { state: MainState }) {
  return <StatePaneContainer>
    <pre>
      {JSON.stringify(state, null, 2)}
    </pre>
  </StatePaneContainer>;
}

export const StatePaneContainer = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50px;
  background-color: black;
  border-radius: 8px;
  padding: 10px;
  z-index: 999;
  width: 400px;
  overflow: hidden;
`;
