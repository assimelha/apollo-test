import { MockedProvider } from "@apollo/react-testing";
import { act, render } from "@testing-library/react";
import React from "react";
import wait from "waait";
import { FailedDog, GET_DOG_QUERY, SuccessDog } from "./Dog.js";

// Change it to SuccessDog to see result! SucessDog component is same as apollo official docs.
const Dog = FailedDog;

let component;

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: "Buck"
      }
    },
    result: {
      data: {
        dog: { id: "1", name: "Buck", breed: "bulldog" }
      }
    }
  }
];

// it("renders without error", () => {
//   act(() => {
//     render(
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <Dog name="Buck" />
//       </MockedProvider>
//     );
//   });
// });

it("should render loading state initially", () => {
  act(() => {
    component = render(
      <MockedProvider mocks={[]}>
        <SuccessDog />
      </MockedProvider>
    );
  });
  const { getByText } = component;
  expect(getByText("Loading...").textContent).toBe("Loading...");
});

it("should show error UI", async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" }
    },
    error: new Error("aw shucks")
  };
  act(() => {
    component = render(
      <MockedProvider mocks={[dogMock]} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>
    );
  });
  await wait(0); // wait for response
  const { getByText } = component;

  expect(getByText("Error!").textContent).toBe("Error!");
});

it("should render dog", async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" }
    },
    result: {
      data: { dog: { id: 1, name: "Buck", breed: "poodle" } }
    }
  };

  act(() => {
    component = render(
      <MockedProvider mocks={[dogMock]} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>
    );
  });

  await wait(0); // wait for response
  const { getByText } = component;
  expect(getByText("Buck is a poodle").textContent).toBe("Buck is a poodle");
});
