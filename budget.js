document.addEventListener("DOMContentLoaded", () => {
    const budgetListPage = document.getElementById("budget-list-page");
    const budgetForm = document.getElementById("budget-form");
    const mainPage = document.getElementById("main-page");
    const expensePage = document.getElementById("expense-page");

    const menuBtn = document.getElementById("menu-btn");
    const menuOptions = document.getElementById("menu-options");
    const homeBtn = document.getElementById("home-btn");
    const viewExpensesBtn = document.getElementById("view-expenses-btn");

    const createBudgetBtn = document.getElementById("create-budget-btn");
    const submitBudgetBtn = document.getElementById("submit-budget");
    const addExpenseBtn = document.getElementById("add-expense-btn");
    const submitExpenseBtn = document.getElementById("submit-expense");

    const budgetNameInput = document.getElementById("budget-name");
    const salaryAmountInput = document.getElementById("salary-amount");
    const currentSalaryDisplay = document.getElementById("current-salary");
    const displaySalary = document.getElementById("display-salary");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const budgetList = document.getElementById("budget-list");

    let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
    let selectedBudget = null;

    // Populate budget list on load
    function displayBudgetList() {
        budgetList.innerHTML = "";
        for (const budgetName in budgets) {
            const budgetItem = document.createElement("p");
            budgetItem.innerText = budgetName;
            budgetItem.addEventListener("click", () => openBudget(budgetName));
            budgetList.appendChild(budgetItem);
        }
    }
    displayBudgetList();

    // Menu toggle
    menuBtn.addEventListener("click", () => {
        menuOptions.style.display = menuOptions.style.display === "none" ? "block" : "none";
    });

    // Home button to return to the budget list page
    homeBtn.addEventListener("click", () => {
        clearPages();
        budgetListPage.style.display = "flex";
    });

    // "+" button to create a new budget
    createBudgetBtn.addEventListener("click", () => {
        clearPages();
        budgetForm.style.display = "flex";
        budgetNameInput.value = "";
        salaryAmountInput.value = "";
    });

    // Submit budget and return to list
    submitBudgetBtn.addEventListener("click", () => {
        const budgetName = budgetNameInput.value;
        const salaryAmount = parseFloat(salaryAmountInput.value.replace("$", ""));
        
        if (budgetName && salaryAmount) {
            budgets[budgetName] = { totalSalary: salaryAmount, currentSalary: salaryAmount, expenses: [] };
            localStorage.setItem("budgets", JSON.stringify(budgets));
            clearPages();
            budgetListPage.style.display = "flex";
            displayBudgetList();
        } else {
            alert("Please enter both a budget name and salary amount.");
        }
    });

    // Open selected budget page
    function openBudget(budgetName) {
        selectedBudget = budgetName;
        const budget = budgets[budgetName];
        currentSalaryDisplay.innerText = `$${budget.currentSalary}`;
        clearPages();
        mainPage.style.display = "flex";
    }

    // "-" button to add an expense
    addExpenseBtn.addEventListener("click", () => {
        clearPages();
        expensePage.style.display = "flex";
        displaySalary.innerText = `$${budgets[selectedBudget].currentSalary}`;
    });

    // Submit expense and update current salary
    submitExpenseBtn.addEventListener("click", () => {
        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value.replace("$", ""));

        if (expenseName && expenseAmount) {
            const budget = budgets[selectedBudget];
            budget.currentSalary -= expenseAmount;
            budget.expenses.push({ name: expenseName, amount: expenseAmount });
            localStorage.setItem("budgets", JSON.stringify(budgets));

            clearPages();
            mainPage.style.display = "flex";
            currentSalaryDisplay.innerText = `$${budget.currentSalary}`;

            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        } else {
            alert("Please enter both an expense name and amount.");
        }
    });

    // View expenses for the current budget
    viewExpensesBtn.addEventListener("click", () => {
        clearPages();
        expensePage.style.display = "flex";
        expenseList.style.display = "block"; // Display expenses list
        expenseList.innerHTML = ""; // Clear previous list
        const expenses = budgets[selectedBudget]?.expenses || [];
        expenses.forEach(expense => {
            const expenseItem = document.createElement("p");
            expenseItem.innerText = `${expense.name}: $${expense.amount}`;
            expenseList.appendChild(expenseItem);
        });
    });

    // Clear all pages
    function clearPages() {
        budgetListPage.style.display = "none";
        budgetForm.style.display = "none";
        mainPage.style.display = "none";
        expensePage.style.display = "none";
        menuOptions.style.display = "none";
    }
});
