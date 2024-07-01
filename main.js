import { generateReturnsArray } from "./src/investmentGoals.js";

const form = document.querySelector("#investment-form");
// const calculateButton = document.querySelector("#calculate-results");
const clearFormButton = document.querySelector("#clear-form");

function renderProgression(e) {
  e.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  // const startingAmount = Number(form["starting-amount"].value);
  const startingAmount = Number(
    document.querySelector("#starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.querySelector("#additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.querySelector("#time-amount").value);
  const timeAmountPeriod = document.querySelector("#time-amount-period").value;
  const returnRate = Number(
    document.querySelector("#return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.querySelector("#evaluation-period").value;
  const taxRate = Number(
    document.querySelector("#tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  const errorInputContainers = document.querySelectorAll(".error");

  for (const errorInput of errorInputContainers) {
    errorInput.classList.remove("error");
    errorInput.parentElement.querySelector("p").remove();
  }
}

function validateInput(e) {
  if (e.target.value === "") {
    return;
  }

  const inputValue = e.target.value.replace(",", ".");

  const { parentElement } = e.target;
  const grandparentElement = e.target.parentElement.parentElement;

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    parentElement.classList.add("error");
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "Insira um valor numerico e maior do que 0";
    grandparentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandparentElement.querySelector("p").remove();
  }
}

for (const forElement of form) {
  if (forElement.tagName === "INPUT" && forElement.hasAttribute("name")) {
    forElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
// calculateButton.addEventListener("click", renderProgression);
clearFormButton.addEventListener("click", clearForm);
