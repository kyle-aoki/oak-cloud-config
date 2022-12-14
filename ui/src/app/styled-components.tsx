import styled from "styled-components";
import {
  BorderColor,
  CancelButtonBg,
  ChipBg,
  CommitButtonColor,
  GrayBackground,
  LightGrayBackground,
  MenuButtonBg,
  NewVersionChipBg,
  WritingChipBg,
} from "../colors";

export const Root = styled.div`
    /* border: 1px solid ${BorderColor}; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const AppPane = styled(Root)`
  background-color: ${GrayBackground};
  height: 100%;
  width: 100%;
`;
export const Navbar = styled(Root)`
  flex-direction: row;
  padding-left: 15px;
  width: 100%;
  height: 40px;
  border-bottom: 2px solid ${BorderColor};
`;
export const PathBar = styled(Root)`
  width: 100%;
  height: 20px;
  border-bottom: 2px solid ${BorderColor};
  font-size: 12px;
  flex-direction: row;
  padding-left: 12px;
  color: #c2c2c2;
`;
export const AppBodyPane = styled(Root)`
  height: 100%;
  width: 100%;
  flex-direction: row;
`;
export const WorkbenchPane = styled(Root)`
  height: 100%;
  width: 400px;
  align-items: flex-start;
  border-right: 2px solid ${BorderColor};
`;
export const WorkBenchControl = styled(Root)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  height: 34px;
  border-bottom: 2px solid ${BorderColor};
  width: 100%;
  padding-left: 8px;
`;
export const TextEditorPane = styled(Root)`
  height: 100%;
  width: calc(100vw - 402px);
`;
export const TextEditorBar = styled(Root)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${LightGrayBackground};
  border-bottom: 2px solid ${BorderColor};
  width: 100%;
  height: 35.5px;
  margin-bottom: 4px;
  padding-left: 12px;
  padding-right: 12px;
`;
export const TextEditorLeftSide = styled(Root)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 10px;
`;
export const TextEditorCenter = styled(Root)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 12px;
`;
export const TextEditorRightSide = styled(Root)`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  gap: 10px;
`;
export const Outer = styled.div`
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
`;
export const Inner = styled.div`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  position: absolute;
`;

export const MenuButton = styled.div<{ width?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  height: 20px;
  min-width: 32px;
  background-color: #393ed7;
  border-radius: 3px;
  padding: 0 8px;

  &:hover {
    background-color: #565ad5;
  }

  &:active {
    background-color: #1f25e1;
  }
`;
export const NewVersionButton = styled(MenuButton)`
  width: 150px;
  background-color: ${MenuButtonBg};
`;
export const CancelButton = styled(MenuButton)`
  width: 100px;
  background-color: ${CancelButtonBg};
`;
export const CommitButton = styled(MenuButton)<{ $committed: boolean }>`
  width: 100px;
  background-color: ${({ $committed }) => $committed ? CommitButtonColor.CommitButtonActiveBg : CommitButtonColor.CommitButtonBg};

  &:hover {
    background-color: ${({ $committed }) => $committed ? CommitButtonColor.CommitButtonActiveBg : CommitButtonColor.CommitButtonHoverBg};
  }

  &:active {
    background-color: ${CommitButtonColor.CommitButtonActiveBg};
  }
`;
export const Chip = styled.div`
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 10px;
  background-color: ${ChipBg};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ReadOnlyChip = styled(Chip)`
  width: 80px;
`;
export const WritingChip = styled(Chip)`
  width: 80px;
  background-color: ${WritingChipBg};
`;
export const NewVersionChip = styled(Chip)`
  background-color: ${NewVersionChipBg};
`;

export const EmptyWorkbench = styled.div`
  user-select: none;
  padding-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
`;

