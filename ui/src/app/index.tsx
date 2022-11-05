import Editor from "@monaco-editor/react";
import { MouseEventHandler, ReactElement, useEffect } from "react";
import styled from "styled-components";
import {
  BorderColor,
  GrayBackground,
  LightGrayBackground,
  ObjectActive,
  ObjectHover,
  ObjectSelectedBg
} from "../constants";
import { OakObject } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { changeDirectoryDown, getObjects, useMainState } from "./redux";

export function useLoadRootDir() {
  const mainState = useMainState();
  const d = useDispatch();
  useEffect(() => {
    d(getObjects([]));
  }, []);
}

export default function App() {

  const mainState = useSelector((state: RootState) => state.main);
  const d = useDispatch();

  useLoadRootDir();


  return (
    <AppPane>
      <TopLoadingBar />
      <Navbar>oak</Navbar>
      <PathBar>{`/${mainState.path.join('/')}`}</PathBar>
      <AppBodyPane>
        <WorkbenchPane>
          <WorkBenchControl>
            <MenuButton>/</MenuButton>
            <MenuButton onClick={() => d(changeDirectoryDown())}>..</MenuButton>
          </WorkBenchControl>
          {
            mainState.objects.map(
              (obj, idx) => {
                return <ObjectContainer key={idx} object={obj} />;
              })
          }
        </WorkbenchPane>
        <TextEditorPane>
          <TextEditorBar>
            <TextEditorLeftSide><MenuButton>copy</MenuButton></TextEditorLeftSide>
            <TextEditorCenter>{mainState.OakObject?.name}</TextEditorCenter>
            <TextEditorRightSide><MenuButton>new version</MenuButton></TextEditorRightSide>
          </TextEditorBar>
          <Outer>
            <Inner>
              <Editor
                theme="vs-dark"
                defaultLanguage="json"
                defaultValue=""
                value={mainState.OakFile?.content}
                options={{ readOnly: false }}
              />
            </Inner>
          </Outer>
        </TextEditorPane>
      </AppBodyPane>
    </AppPane>
  );
}

export const ObjectContainer = ({ object }: { object: OakObject }): ReactElement => {
  const mainState = useSelector((state: RootState) => state.main);
  const d = useDispatch();
  const onClick = () => d(getObjects([...mainState.path, object.name]));
  return <>
    {object.id === mainState.OakObject?.id ?
      <ObjectSelected onClick={onClick}>{object.name}</ObjectSelected>
      :
      <ObjectPane onClick={onClick}>{object.name}</ObjectPane>}
  </>;
};

export const BaseObjectPane = styled.div`
  padding-left: 10px;
  background-color: ${GrayBackground};
  color: white;
  display: flex;
  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  user-select: none;
`;
export const ObjectPane = styled(BaseObjectPane)`
  &:hover {
    background-color: ${ObjectHover};
  }

  &:active {
    background-color: ${ObjectActive};
  }
`;
export const ObjectSelected = styled(BaseObjectPane)`
  background-color: ${ObjectSelectedBg};
`;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const TopLoadingBar = styled.div`
  width: 100%;
  height: 1px;
  background-color: transparent;
`;
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
  //border-bottom: 2px solid ${BorderColor};
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
  width: 100%;
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
`;
export const TextEditorCenter = styled(Root)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
export const TextEditorRightSide = styled(Root)`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
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

export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  height: 20px;
  min-width: 32px;
  background-color: #393ed7;
  border-radius: 5px;
  padding: 0 8px;

  &:hover {
    background-color: #565ad5;
  }

  &:active {
    background-color: #1f25e1;
  }
`;
