let buhBalans = {};

const validate = () => {
  for (let key in buhBalans) {
    if (buhBalans[key].length == 0) {
      console.log(key);
      alert("Не все поля заполнены!");
      return false;
    }
  }
  return true;
};

const calcBuhBalanc = () => {
  const SK = document.getElementById("sobKap").value;
  VOA = document.getElementById("vneobrAkt").value;
  DA = document.getElementById("dolgAkt").value;
  KA = document.getElementById("kratAkt").value;
  Z = document.getElementById("zapas").value;
  OA = document.getElementById("obAkt").value;

  buhBalans = {
    sobKap: SK,
    vneObAkt: VOA,
    dolgAkt: DA,
    kratAkt: KA,
    zapas: Z,
    obAkt: OA,
  };
};

function countSOS(sobK, vneObAkt) {
  const sos = sobK - vneObAkt;
  buhBalans.SOS = sos;
}

function countSDI(sos, dolgAkt) {
  const sdi = sos + +dolgAkt;
  buhBalans.SDI = sdi;
}

function countOIZ(sdi, kratAkt) {
  const oiz = sdi + +kratAkt;
  buhBalans.OIZ = oiz;
}

function countAbsolut1(znac, zapas) {
  absolutPokaz = znac - zapas;
  return absolutPokaz;
}

function countKoef(data) {
  let { sobKap, vneObAkt, dolgAkt, kratAkt, zapas, obAkt } = data;

  const sumZaemKap = +dolgAkt + +kratAkt;
  const passiv = +sumZaemKap + +sobKap;
  const sos = +sobKap - vneObAkt;
  const koef1 = sos / sobKap;
  const koef2 = sos / zapas;
  const koef3 = sos / obAkt;
  const koef4 = +sumZaemKap / +passiv;
  console.log(sumZaemKap, passiv);
  const koef5 = (+sobKap + +dolgAkt) / +passiv;
  const koef6 = (+dolgAkt + +kratAkt) / +sobKap;

  let otherData = {
    k1: koef1.toFixed(2),
    k2: koef2.toFixed(2),
    k3: koef3.toFixed(2),
    k4: koef4.toFixed(2),
    k5: koef5.toFixed(2),
    k6: koef6.toFixed(2),
  };

  return otherData;
}

function showOrHide(table) {
  if (table.classList.contains("show")) {
    table.classList.remove("show");
    table.classList.add("hide");
  } else {
    table.classList.remove("hide");
    table.classList.add("show");
  }
}

function updateChart(data) {
  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["СОС", "СДИ", "ОИЗ"],
      datasets: [
        {
          label: "Absolut Values",
          data: [data.p1, data.p2, data.p3],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 255, 0, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 255, 0, 1)",
          ],
          borderWidth: 1,
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
  showOrHide(canvas);
}

const container = document.querySelector(".finance .container");
let countOtnosBtn = document.querySelector(".countOtnosBtn");
let countBtn = document.querySelector(".countBtn");
let table_abs = document.createElement("table");
let warning = document.createElement("p");
countBtn.addEventListener("click", () => {
  calcBuhBalanc();
  const isGood = validate();

  if (!isGood) {
    if (warning.innerHTML.length == 0) {
      warning.classList.add("warning");
      warning.innerHTML = "Сначала заполните данные для расчета";
      countOtnosBtn.insertAdjacentElement("afterend", warning);
    }
    return;
  }
  warning.remove();
  showOrHide(table_abs);
  countSOS(buhBalans.sobKap, buhBalans.vneObAkt);
  countSDI(buhBalans.SOS, buhBalans.dolgAkt);
  countOIZ(buhBalans.SDI, buhBalans.kratAkt);

  const p1 = countAbsolut1(buhBalans.SOS, buhBalans.zapas);
  p2 = countAbsolut1(buhBalans.SDI, buhBalans.zapas);
  p3 = countAbsolut1(buhBalans.OIZ, buhBalans.zapas);
  table_abs.innerHTML = `
<tr class = 'main_tr'>
<td>СОС</td>
<td>СДИ</td>
<td>ОИЗ</td>
</tr>
<tr class ='simple_tr' >
<td class=${p1 > 0 ? "green" : "red"}>${p1}</td>
<td class=${p2 > 0 ? "green" : "red"}>${p2}</td>
<td class=${p3 > 0 ? "green" : "red"}>${p3}</td>
</tr>
`;

  container.append(table_abs);

  updateChart({ p1, p2, p3 });
});

let table_otn = document.createElement("table");

countOtnosBtn.addEventListener("click", () => {
  calcBuhBalanc();
  const isGood = validate();

  if (!isGood) {
    if (warning.innerHTML.length == 0) {
      warning.classList.add("warning");
      warning.innerHTML = "Сначала заполните данные для расчета";
      countOtnosBtn.insertAdjacentElement("afterend", warning);
    }
    return;
  }
  warning.remove();

  const data = countKoef(buhBalans);
  const { k1, k2, k3, k4, k5, k6 } = data;

  showOrHide(table_otn);
  table_otn.innerHTML = `
<tr class = 'main_tr'>
<td></td>
<td>коэф маневренности</td>
<td>коэф обеспеченности запасов собствеными средствами</td>
<td>коэф обеспеченности оборот активов собственными средствами</td>
<td>коэф концентрации заемного капитала</td>
<td>коэф финансовой устойчивости</td>
<td>Коэффициент финансового левериджа</td>
</tr>
<tr class ='simple_tr' >
<td>Посчитанное значение</td>
<td class=${k1 >= 0.2 ? "green" : "red"}>${k1}</td>
<td class=${k2 >= 0.6 ? "green" : "red"}>${k2}</td>
<td class=${k3 >= 0.1 ? "green" : "red"}>${k3}</td>
<td class=${k4 <= 0.5 ? "green" : "red"}>${k4}</td>
<td class=${k5 >= 0.6 ? "green" : "red"}>${k5}</td>
<td class=${k6 > 0.5 && k6 < 0.7 ? "green" : "red"}>${k6}</td>
</tr>
<tr class ='simple_tr' >
<td>Норматив</td>
<td>≥0.2</td>
<td>≥0.6</td>
<td>≥0.1</td>
<td>≤0.5</td>
<td>≥0.6</td>
<td>0.5-0.7</td>
</tr>
`;

  const table_otn_small = document.createElement("table");
  table_otn_small.innerHTML = `
<tr>
<td class = "main_tr" >Коэффициент</td>
<td class = "main_tr" >Значение</td></td>
<td class = "main_tr" >Норматив</td>
</tr>
<tr class='simple_tr'>
      <td>коэф маневренности</td>
      <td class=${k1 >= 0.2 ? "green" : "red"}>${k1}</td>
      <td>≥0.2</td>
    </tr>
    <tr class='simple_tr'>
      <td>коэф обеспеченности запасов собствеными средствами</td>
      <td class=${k2 >= 0.6 ? "green" : "red"}>${k2}</td>
      <td>≥0.6</td>
    </tr>
    <tr class='simple_tr'>
      <td>коэф обеспеченности оборот активов собственными средствами</td>
      <td class=${k3 >= 0.1 ? "green" : "red"}>${k3}</td>
      <td>≥0.1</td>
    </tr>
    <tr class='simple_tr'>
      <td>коэф концентрации заемного капитала</td>
      <td class=${k4 <= 0.5 ? "green" : "red"}>${k4}</td>
      <td>≤0.5</td>
    </tr>
    <tr class='simple_tr'>
      <td>коэф финансовой устойчивости</td>
      <td class=${k5 >= 0.6 ? "green" : "red"}>${k5}</td>
      <td>≥0.6</td>
    </tr>
    <tr class='simple_tr'>
      <td>Коэффициент финансового левериджа</td>
      <td class=${k6 > 0.5 && k6 < 0.7 ? "green" : "red"}>${k6}</td>
      <td>0.5 - 0.7</td>
    </tr>
`;

  if (document.documentElement.clientWidth > 1000) {
    container.append(table_otn);
  } else {
    container.append(table_otn_small);
  }
});
