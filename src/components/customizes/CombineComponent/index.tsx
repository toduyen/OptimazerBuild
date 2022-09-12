import React, { ComponentProps, FC } from "react";

export const combineComponents = (...components: FC[]): FC =>
  components.reduce(
    // eslint-disable-next-line no-undef
    (AccumulatedComponents, CurrentComponent) =>
      function ({ children }: ComponentProps<FC>): React.ReactElement {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      },
    // eslint-disable-next-line react/jsx-no-useless-fragment
    ({ children }) => <>{children}</>
  );
