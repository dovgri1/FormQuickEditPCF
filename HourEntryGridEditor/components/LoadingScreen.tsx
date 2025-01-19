import * as React from "react";
import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import { componentStyling } from "../configuration/configuration";

interface Props {
  message?: string; // Optional message to display while loading
}

export const LoadingScreen: React.FC<Props> = ({ message }) => {
    return (
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        styles={{
          root: {
            height: "100vh",
            width: "100vw",
            backgroundColor: componentStyling.loadingScreenbackgroundColor, // Semi-transparent light background
          },
        }}
      >
        <Spinner
          size={SpinnerSize.large}
          label={message || "Loading..."}
          ariaLive="assertive"
        />
      </Stack>
    );
  };