import styled from "styled-components";
import { NewObjectInputColors } from "../constants";
import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import { NewObjectCreator } from "../app/classes";

export const NewObject = forwardRef(
  (
    { newObjectCreator }: { newObjectCreator: NewObjectCreator },
    ref: ForwardedRef<any>
  ) => {
    return (
      <>
        <NewObjectContainer>
          <NewObjectInput
            ref={ref}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              newObjectCreator.updateObjectName(e)
            }
          />
        </NewObjectContainer>
      </>
    );
  }
);

export const NewObjectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const NewObjectInput = styled.input`
  margin: 4px 8px;
  background-color: ${NewObjectInputColors.backgroundColor};
  color: ${NewObjectInputColors.color};
`;
