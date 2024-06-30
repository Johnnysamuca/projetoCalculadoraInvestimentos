import { generateReturnsArray } from "./src/investmentGoals.js";

const form = document.querySelector("#investment-form");
// const calculateButton = document.querySelector("#calculate-results");

function renderProgression(e) {
  e.preventDefault();
  // const startingAmount = Number(form["starting-amount"].value);
  const startingAmount = Number(
    document.querySelector("#starting-amount").value
  );
  const additionalContribution = Number(
    document.querySelector("#additional-contribution").value
  );
  const timeAmount = Number(document.querySelector("#time-amount").value);
  const timeAmountPeriod = document.querySelector("#time-amount-period").value;
  const returnRate = Number(document.querySelector("#return-rate").value);
  const returnRatePeriod = document.querySelector("#evaluation-period").value;
  const taxRate = Number(document.querySelector("#tax-rate").value);

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

form.addEventListener("submit", renderProgression);
// calculateButton.addEventListener("click", renderProgression);
