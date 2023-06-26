/**
 * @jest-environment jsdom
 */
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES_PATH } from "../constants/routes.js";

import NewBill from "../containers/NewBill";
import Router from "../app/Router";
import formatPicture from "../containers/NewBill";

import { fireEvent, screen, waitFor } from "@testing-library/dom";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the mail icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      Object.defineProperty(window, "location", {
        value: { hash: ROUTES_PATH["NewBill"] },
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = `<div id="root"></div>`;
      Router();

      const icon = screen.getByTestId("icon-mail");
      expect(icon.className).toBe("active-icon");
    });
  });

  describe("When I am on NewBill Page and i click on button chose a file", () => {
    test("Then i can choose to upload a file with correct extension (jpg|jpeg|png)", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      Object.defineProperty(window, "location", {
        value: { hash: ROUTES_PATH["NewBill"] },
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = `<div id="root"></div>`;
      Router();

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const inputFile = screen.getByTestId("file");
      const img = new File(["img"], "image.png", { type: "image/png" });

      inputFile.addEventListener("change", handleChangeFile);
      await waitFor(() => {
        userEvent.upload(inputFile, img);
      });

      expect(handleChangeFile).toBeCalled();
      expect(screen.getAllByText("Billed")).toBeTruthy();

      expect(formatPicture).not.toBe(0);
    });
    test("Then i can choose to upload a file with incorrect extension", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      Object.defineProperty(window, "location", {
        value: { hash: ROUTES_PATH["NewBill"] },
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = `<div id="root"></div>`;
      Router();

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const inputFile = screen.getByTestId("file");
      const img = new File(["img"], "image.pdf", { type: "image/pdf" });

      inputFile.addEventListener("change", handleChangeFile);
      await waitFor(() => {
        userEvent.upload(inputFile, img);
      });

      expect(formatPicture).not.toBe(1);
    });
  });

  describe("Given i am connected as an employee", () => {
    describe("When I am on NewBills Page", () => {
      test("send bills to API, POST method", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        Object.defineProperty(window, "location", {
          value: { hash: ROUTES_PATH["NewBill"] },
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee" })
        );
        document.body.innerHTML = `<div id="root"></div>`;
        Router();

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const inputType = screen.getByTestId("expense-type");
        const inputName = screen.getByTestId("expense-name");
        const inputDate = screen.getByTestId("datepicker");
        const inputAmount = screen.getByTestId("amount");
        const inputVat = screen.getByTestId("vat");
        const inputPct = screen.getByTestId("pct");
        const inputComment = screen.getByTestId("commentary");
        const inputFile = screen.getByTestId("file");
        const img = new File(["img"], "facturefreemobile.jpg", {
          type: "image/jpg",
        });

        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

        inputType.value = "Transports";
        inputName.value = "Test";
        inputDate.value = "2023-06-26";
        inputAmount.value = "100";
        inputVat.value = "50";
        inputPct.value = "20";
        inputComment.value = "Ceci est un commentaire";

        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        inputFile.addEventListener("change", handleChangeFile);
        await waitFor(() => {
          userEvent.upload(inputFile, [img]);
        });

        expect(inputFile.files[0]).toBeDefined();
        const formulaire = screen.getByTestId("form-new-bill");
        expect(formulaire).toBeTruthy();
        formulaire.addEventListener("submit", handleSubmit);

        fireEvent.submit(formulaire);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
