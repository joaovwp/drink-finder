const resultDiv = document.getElementById("results");

async function fetchData(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching data");
    resultDiv.innerHTML = "";
    return await response.json();
  } catch (error) {
    console.error("Error fetching the data:", error);
    resultDiv.innerHTML = "<p>Error fetching the data</p>";
    return null;
  }
}

function createDrinkCards(drinks) {
  resultDiv.innerHTML = "";
  let singleDrink = drinks.length === 1;

  drinks.forEach((drink) => {
    let drinkContainer = document.createElement("div");
    drinkContainer.classList.add("drink-container");
    drinkContainer.addEventListener("click", function () {
      searchByID(drink.idDrink);
    });

    let drinkName = document.createElement("h2");
    drinkName.textContent = drink.strDrink;

    let drinkImage = document.createElement("img");
    drinkImage.src = drink.strDrinkThumb;
    drinkImage.alt = drink.strDrink;

    drinkContainer.append(drinkName, drinkImage);

    if (singleDrink) {
      let instructions = document.createElement("p");
      instructions.classList.add("instructions");
      instructions.textContent = drink.strInstructions;
      drinkContainer.appendChild(instructions);

      let ingredientsList = document.createElement("ul");
      for (let i = 1; i <= 15; i++) {
        let ingredient = drink[`strIngredient${i}`];
        let measure = drink[`strMeasure${i}`];
        if (ingredient) {
          let listItem = document.createElement("li");
          listItem.textContent = `${
            measure ? measure + " of " : ""
          } ${ingredient}`;
          ingredientsList.appendChild(listItem);
        }
      }
      drinkContainer.appendChild(ingredientsList);
    }

    resultDiv.appendChild(drinkContainer);
  });
}

async function searchByID(drinkID) {
  let url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`;
  let data = await fetchData(url);
  if (!data || data.drinks == "no data found") {
    resultDiv.innerHTML = "<p>No drink found.</p>";
    return;
  }
  createDrinkCards(data.drinks);
}

async function searchDrink(drinkName) {
  let url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`;
  let data = await fetchData(url);
  if (!data || data.drinks == "no data found") {
    resultDiv.innerHTML = "<p>No drink found.</p>";
    return;
  }
  createDrinkCards(data.drinks);
}

async function getRandomDrink() {
  let url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  let data = await fetchData(url);
  if (!data || data.drinks == "no data found") {
    resultDiv.innerHTML = "<p>No drink found.</p>";
    return;
  }
  createDrinkCards(data.drinks);
}

async function searchByIngredient(ingredientName) {
  let url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientName}`;
  let data = await fetchData(url);
  if (!data || data.drinks == "no data found") {
    resultDiv.innerHTML = "<p>No drink found.</p>";
    return;
  }
  createDrinkCards(data.drinks);
}

async function listIngredients() {
  let url = `https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list`;
  let data = await fetchData(url);
  if (!data || data.drinks == "no data found") {
    resultDiv.innerHTML = "<p>No Ingredient found.</p>";
    return;
  }
  data.drinks.forEach((ingredient) => {
    let i = document.createElement("p");
    i.classList.add("ingredient-tag");
    i.addEventListener("click", function () {
      searchByIngredient(ingredient.strIngredient1);
    });
    i.textContent = ingredient.strIngredient1;
    resultDiv.appendChild(i);
  });
}
