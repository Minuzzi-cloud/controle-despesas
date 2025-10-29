document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-lancamento");
  const lista = document.getElementById("lista-lancamentos");
  const saldoEl = document.getElementById("saldo");
  const graficoEl = document.getElementById("grafico");

  // Simula dados locais
  let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

  // Adicionar lançamento
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const tipo = document.getElementById("tipo").value;
      const descricao = document.getElementById("descricao").value;
      const valor = parseFloat(document.getElementById("valor").value);
      const data = document.getElementById("data").value;

      const novo = { id: Date.now(), tipo, descricao, valor, data };
      lancamentos.push(novo);
      localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
      form.reset();
      atualizarLista();
    });
  }

  // Atualiza lista e saldo
  function atualizarLista() {
    if (!lista) return;
    lista.innerHTML = "";
    lancamentos.forEach((l) => {
      const li = document.createElement("li");
      li.textContent = `${l.data} - ${l.tipo}: ${l.descricao} (R$ ${l.valor.toFixed(2)})`;
      lista.appendChild(li);
    });
  }

  // Atualiza saldo e gráfico
  function atualizarResumo() {
    if (!saldoEl || !graficoEl) return;
    const receitas = lancamentos
      .filter((l) => l.tipo === "Receita")
      .reduce((acc, l) => acc + l.valor, 0);
    const despesas = lancamentos
      .filter((l) => l.tipo === "Despesa")
      .reduce((acc, l) => acc + l.valor, 0);
    const saldo = receitas - despesas;
    saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;

    new Chart(graficoEl, {
      type: "pie",
      data: {
        labels: ["Receitas", "Despesas"],
        datasets: [{
          data: [receitas, despesas],
          backgroundColor: ["#2e7d32", "#c62828"]
        }]
      }
    });
  }

  atualizarLista();
  atualizarResumo();
});
