import styled from "styled-components";
import { NewObjectInputColors } from "../colors";
import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import { CreatorInput } from "../app/creator-input";

export const NewObject = forwardRef(
  (
    { creatorInput }: { creatorInput: CreatorInput },
    ref: ForwardedRef<any>
  ) => {
    return (
      <>
        <NewObjectContainer>
          <NewObjectInput
            ref={ref}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              creatorInput.updateObjectName(e)
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
