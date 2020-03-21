"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const choiceForm = document.getElementById("choiceForm");

  choiceForm.addEventListener("submit", e => e.preventDefault());

  const options = [
    ["instant", 2],
    ["destroy", 2],
    ["counter", 0, "u"],
    ["exile", 2, "w"],
    ["two", 2],
    ["target", 0],
    ["each", 2, "w"],
    ["all", 1, "w",],
    ["artifact", 0, "r"],
    ["planeswalker", 0, "b"],
    ["and target", 1],
    ["enchantment", 0, "w"],
    ["creature", 1, "b"],
    ["land", 0, "rw"],
    ["spell", 0, "u"],
    ["with", -2],
    ["converted mana cost", 0],
    ["power", 0],
    ["toughness", 0],
    ["then", 1],
    ["scry", 0, "u"],
    ["gain life", 0, "w"],
    ["add <span class='mana r'></span>", 0, "rrr"],
    ["draw cards", 2, "uu"],
    ["create a number of 1/1 white Human creature tokens", 2, "w"],
    ["equal to", 0],
    ["your life total", 6, "ww"],
    ["target creature's power", 3, "gg"],
    ["plus", 1],
    ["the number of", 0],
    ["cards in your hand", 1, "uu"],
    ["creatures you control", 4, "ww"],
    ["creature cards in your graveyard", 1, "bb"],
    ["cards in all graveyards", 4, "bg"],
    ["one", 0],
    ["minus one", -1],
    ["storm", 0, "wubrg"]
  ];

  function formatCost(cost){
    const result = [];

    function subformat(cls, n){
      for (let i = 0; i < n; i++){
        result.push(`<span class="mana ${cls}">&nbsp;</span>`);
      }
    }

    subformat('w', cost.w);
    subformat('u', cost.u);
    subformat('b', cost.b);
    subformat('r', cost.r);
    subformat('g', cost.g);

    if (cost.c !== 0 || result.length === 0){
      result.unshift(`<span class="mana">${cost.c}</span>`);
    }

    return result.join('');
  }

  function update(){
    const totalCost = { c: 0, w: 0, u: 0, b: 0, r: 0, g: 0 };
    const text = [];
    let type = 'Sorcery';
    let storm = false;
    let plural = false;

    for (let checkbox of document.querySelectorAll(".optionBox")){
      if (checkbox.checked){
        const data = JSON.parse(checkbox.value);

        if (data.text === 'instant'){
          type = 'Instant';
        } else if (data.text === 'storm'){
          storm = true;
        } else {
          text.push(data.text);
        }

        totalCost.c += data.c || 0;
        totalCost.w += data.w || 0;
        totalCost.u += data.u || 0;
        totalCost.b += data.b || 0;
        totalCost.r += data.r || 0;
        totalCost.g += data.g || 0;
      }
    }

    document.getElementById('outMana').innerHTML = formatCost(totalCost);
    document.getElementById('outType').innerHTML = type;

    let outHtml = text.join(' ');
    if (outHtml.length > 0){
      outHtml = '<p>' + outHtml.substr(0, 1).toUpperCase() + outHtml.substr(1) + '.</p>';
    }

    if (storm) outHtml += '<p>Storm</p>';

    document.getElementById('outText').innerHTML = outHtml;
  }

  function createCheckboxes(){
    for (let n of options){
      let data = {
        "text": n[0],
        "c": n[1]
      };

      if (n[2]){
        for (let i = 0; i < n[2].length; i++){
          data[n[2][i]] = (data[n[2][i]] || 0) + 1;
        }
      }

      if (n[3]){
        data["plural"] = n[3];
      }

      let p = document.createElement("p");
      p.innerHTML = `<label><input class="optionBox" type="checkbox">${formatCost(data)} ${n[0]}</label>`;

      let cb = p.querySelector("input");
      cb.value = JSON.stringify(data);
      cb.addEventListener('change', update);

      choiceForm.appendChild(p);
    }
  }

  createCheckboxes();
  update();
});
