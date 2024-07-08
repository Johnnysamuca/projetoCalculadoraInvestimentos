import { generateReturnsArray } from "./src/investmentGoals.js";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table.js";

const chartMoneyChart = document.querySelector("#final-money-distribution");
const progressionChart = document.querySelector("#progression");
const form = document.querySelector("#investment-form");
// const calculateButton = document.querySelector("#calculate-results");
const clearFormButton = document.querySelector("#clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  {
    columnLabel: "Mês",
    accessor: "month",
  },
  {
    columnLabel: "Total investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(e) {
  e.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();
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

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(chartMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Valor Investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.interestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.interestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno de investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, "results-table");
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  const errorInputContainers = document.querySelectorAll(".error");

  for (const errorInput of errorInputContainers) {
    errorInput.classList.remove("error");
    errorInput.parentElement.querySelector("p").remove();
  }
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
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

const mainEl = document.querySelector("main");
const carouselEl = document.querySelector("#carousel");
const nextButton = document.querySelector("#slide-arrow-next");
const previousButton = document.querySelector("#slide-arrow-previous");

nextButton.addEventListener("click", () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener("click", () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener("submit", renderProgression);
// calculateButton.addEventListener("click", renderProgression);
clearFormButton.addEventListener("click", clearForm);
