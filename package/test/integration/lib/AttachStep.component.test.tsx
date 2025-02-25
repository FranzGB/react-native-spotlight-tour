import { expect } from "@assertive-ts/core";
import { render, waitFor, within } from "@testing-library/react-native";
import React, { forwardRef, ReactElement } from "react";
import { Text } from "react-native";

import { AttachStep, SpotlightTourProvider } from "../../../src";

/**
 * Native components are mocked by Jest and transformed to functional
 * components on runtime. To simulate the native component behavior we forward
 * a reference to it so native methods like `measureInWindow(..)` are available.
 */
const NativeText = forwardRef<Text>((_props, ref) => {
  return (
    <Text ref={ref}>{"Native Text"}</Text>
  );
});

function CustomText(): ReactElement {
  return (
    <Text>{"Custom Text"}</Text>
  );
}

describe("[Integration] AttachStep.component.test.tsx", () => {
  context("when a native component is passed as child", () => {
    it("renders the child without wrapping it on a native View", async () => {
      const { getByText, queryByTestId } = render(
        <SpotlightTourProvider steps={[]}>
          <AttachStep index={0}>
            <NativeText />
          </AttachStep>
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Native Text"));

      expect(queryByTestId("attach-wrapper-view")).toBeNull();
    });
  });

  context("when a function component is passed as child", () => {
    it("renders the child wrapped on a native View", async () => {
      const { getByTestId } = render(
        <SpotlightTourProvider steps={[]}>
          <AttachStep index={0}>
            <CustomText />
          </AttachStep>
        </SpotlightTourProvider>,
      );

      await waitFor(() =>
        within(getByTestId("attach-wrapper-view"))
          .getByText("Custom Text"),
      );
    });
  });
});
