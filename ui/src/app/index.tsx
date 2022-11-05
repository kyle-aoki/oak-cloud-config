import Editor from "@monaco-editor/react";
import { MouseEventHandler, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { BorderColor, GrayBackground, LightGrayBackground, ObjectHover } from "../constants";
import { OakObject } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getContent, objectClick, popPath, updateObjects } from "./redux";

async function JsonFetcher(path: string) {
  const resp = await fetch(path);
  return await resp.json();
}

async function fetchAndSet(fetcher: Function, setter: Function): Promise<void> {
  setter(await fetcher());
}

const OakHost = "http://localhost:8080";
const ObjectsEndpoint = `${OakHost}/objects`;
const ContentEndpoint = `${OakHost}/content`;

function FormContentEndpoint(objectId: number): string {
  return `${ContentEndpoint}?object=${objectId}`;
}

function FormObjectsEndpoint(currentPath: string) {
  return `${ObjectsEndpoint}?path=${currentPath}`;
}

export default function App() {

  const mainState = useSelector((state: RootState) => state.main);
  const d = useDispatch();

  useEffect(() => {
    d(updateObjects(mainState.path))
  }, [])

  useEffect(() => {
    d(updateObjects(mainState.path))
  }, [mainState.path])

  const objectOnClick = (obj: OakObject) => {
    if (obj.isJson) {
      d(getContent(obj.id));
    } else {
      d(objectClick(obj.name));
    }
  };

  const onBackButtonClick = () => d(popPath());

  return (
    <AppPane>
      <Navbar></Navbar>
      <PathBar>{mainState.path}</PathBar>
      <AppBodyPane>
        <WorkbenchPane>
          <WorkBenchControl>
            <Icon>/</Icon>
            <Icon onClick={() => onBackButtonClick()}>..</Icon>
          </WorkBenchControl>
          {
            mainState.workbench.map(
              (obj, idx) => {
                return <ObjectContainer
                  key={idx}
                  onClick={() => objectOnClick(obj)}
                  object={obj}
                />;
              })
          }
        </WorkbenchPane>
        <TextEditorPane>
          <TextEditorBar>text editor bar</TextEditorBar>
          <Outer>
            <Inner>
              <Editor
                theme="vs-dark"
                defaultLanguage="json"
                defaultValue=""
                value={mainState.Json.content}
                options={{ readOnly: true }}
              />
            </Inner>
          </Outer>
        </TextEditorPane>
      </AppBodyPane>
    </AppPane>
  );
}

export const ObjectContainer = (
  {
    object,
    onClick
  }: {
    object: OakObject,
    onClick: MouseEventHandler<HTMLElement>
  }): ReactElement => {
  return <ObjectPane onClick={onClick}>{object.name}</ObjectPane>;
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
`;
// styled(BaseObjectPane)`
//   background-color: ${ObjectSelectedBg};
//   border: 1px solid ${ObjectSelectedBorder};
// `;
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
  width: 100%;
`;
export const TextEditorBar = styled(Root)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${LightGrayBackground};
  border-bottom: 2px solid ${BorderColor};
  width: 100%;
  height: 35.5px;
  margin-bottom: 4px;
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

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  height: 20px;
  width: 25px;
  background-color: #e15454;
  border-radius: 5px;

  &:hover {
    background-color: #e68383;
  }

  &:active {
    background-color: #ef5f5f;
  }
`;
