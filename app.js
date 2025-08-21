(function() {
  'use strict';

  const DENOMINATIONS = [20000, 10000, 5000, 2000, 1000, 500, 200, 100];

  const amountInput = document.getElementById('amount');
  const btnExample = document.getElementById('btn-example');
  const btnCalc = document.getElementById('btn-calc');
  const btnClear = document.getElementById('btn-clear');
  const useCustom = document.getElementById('use-custom');
  const customDenoms = document.getElementById('custom-denoms');
  const btnCheckAll = document.getElementById('btn-check-all');
  const btnUncheckAll = document.getElementById('btn-uncheck-all');
  const summary = document.getElementById('summary');
  const combinationsEl = document.getElementById('combinations');

  function formatAr(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
  }

  function validateAmount(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return { ok: false, error: 'Veuillez entrer un nombre positif.' };
    if (value % 100 !== 0) return { ok: false, error: 'Le montant doit être un multiple de 100 Ar.' };
    return { ok: true, value };
  }

  function getCustomDenominations() {
    const inputs = customDenoms.querySelectorAll('input[type="checkbox"][data-denom]');
    const values = [];
    inputs.forEach(input => {
      if (input.checked) values.push(Number(input.getAttribute('data-denom')));
    });
    values.sort((a, b) => b - a);
    return values;
  }

  function getActiveDenominations() {
    if (useCustom && useCustom.checked) {
      return getCustomDenominations();
    }
    return DENOMINATIONS.slice();
  }

  function countsToMap(counts, denominations) {
    const map = new Map();
    for (let i = 0; i < denominations.length; i++) {
      if (counts[i] > 0) map.set(denominations[i], counts[i]);
    }
    return map;
  }

  function sumNotes(map) {
    let n = 0;
    map.forEach(c => n += c);
    return n;
  }

  function renderCombination(map) {
    const wrapper = document.createElement('div');
    wrapper.className = 'combo';
    const entries = Array.from(map.entries());
    for (const [denom, count] of entries) {
      const line = document.createElement('div');
      line.className = 'line';
      line.innerHTML = `<span>${count} × ${new Intl.NumberFormat('fr-FR').format(denom)} Ar</span><span>${new Intl.NumberFormat('fr-FR').format(count * denom)} Ar</span>`;
      wrapper.appendChild(line);
    }
    const totalLine = document.createElement('div');
    totalLine.className = 'total';
    totalLine.textContent = `Total billets: ${sumNotes(map)}`;
    wrapper.appendChild(totalLine);
    return wrapper;
  }

  function renderResults(amount, combos, minimalOnly) {
    combinationsEl.innerHTML = '';
    if (combos.length === 0) {
      summary.innerHTML = '<span class="badge">Montant non atteignable avec les coupures sélectionnées.</span>';
      return;
    }

    if (minimalOnly) {
      const best = combos[0];
      summary.innerHTML = `${formatAr(amount)} — solution minimale: ${sumNotes(best)} billets.`;
      combinationsEl.appendChild(renderCombination(best));
      return;
    }

    const limited = combos;
    summary.innerHTML = `${formatAr(amount)} — ${new Intl.NumberFormat('fr-FR').format(limited.length)} combinaison(s) affichée(s).`;
    for (const combo of limited) {
      combinationsEl.appendChild(renderCombination(combo));
    }
  }

  // Algorithme optimal (programmation dynamique) pour minimiser le nombre de billets
  function findMinimalCombination(amount, denominations) {
    if (!denominations || denominations.length === 0) return null;
    const scale = 100; // toutes les coupures sont multiples de 100
    const target = Math.floor(amount / scale);
    const coins = denominations.map(d => Math.floor(d / scale));

    if (amount % scale !== 0 || coins.some(c => c <= 0)) return null;

    const dp = new Array(target + 1).fill(Infinity);
    const choice = new Array(target + 1).fill(-1);
    dp[0] = 0;

    for (let s = 1; s <= target; s++) {
      for (let i = 0; i < coins.length; i++) {
        const c = coins[i];
        if (c <= s && dp[s - c] + 1 < dp[s]) {
          dp[s] = dp[s - c] + 1;
          choice[s] = i;
        }
      }
    }

    if (!Number.isFinite(dp[target])) return null;

    const counts = new Array(denominations.length).fill(0);
    let s = target;
    while (s > 0) {
      const i = choice[s];
      if (i === -1) return null;
      counts[i] += 1;
      s -= coins[i];
    }

    return countsToMap(counts, denominations);
  }

  function onCalc() {
    const v = validateAmount(amountInput.value);
    if (!v.ok) {
      summary.innerHTML = `<span class=\"badge\">${v.error}</span>`;
      combinationsEl.innerHTML = '';
      return;
    }
    const amount = v.value;

    const denominations = getActiveDenominations();
    if (!denominations || denominations.length === 0) {
      summary.innerHTML = '<span class="badge">Sélectionnez au moins une coupure.</span>';
      combinationsEl.innerHTML = '';
      return;
    }

    const best = findMinimalCombination(amount, denominations);
    renderResults(amount, best ? [best] : [], true);
  }

  function onClear() {
    amountInput.value = '';
    combinationsEl.innerHTML = '';
    summary.textContent = '';
  }

  function onCheckAll() {
    const inputs = customDenoms.querySelectorAll('input[type="checkbox"][data-denom]');
    inputs.forEach(input => input.checked = true);
  }

  function onUncheckAll() {
    const inputs = customDenoms.querySelectorAll('input[type="checkbox"][data-denom]');
    inputs.forEach(input => input.checked = false);
  }

  function init() {
    btnCalc.addEventListener('click', onCalc);
    btnClear.addEventListener('click', onClear);
    btnExample.addEventListener('click', () => {
      amountInput.value = '45000';
    });

    if (btnCheckAll) {
      btnCheckAll.addEventListener('click', onCheckAll);
    }
    if (btnUncheckAll) {
      btnUncheckAll.addEventListener('click', onUncheckAll);
    }

    amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onCalc();
    });

    if (useCustom) {
      useCustom.addEventListener('change', () => {
        customDenoms.classList.toggle('hidden', !useCustom.checked);
      });
    }
  }

  init();
})(); 