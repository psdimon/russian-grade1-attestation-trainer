import "./style.css";
import { BANK, RULES, BANK_SCHEMA_VALIDATION } from "./bank/index.js";

const STORAGE_HISTORY_KEY = "tg_history_v2";
const STORAGE_PREFS_KEY = "tg_prefs_v2";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="toolbar">
    <button id="generate">Новый вариант</button>
    <label for="seedInput">Seed <input id="seedInput" type="text" placeholder="auto" style="width:120px"></label>
    <button id="applySeed">По seed</button>
    <button id="mode">Режим: бланк</button>
    <label for="fontSize">Размер шрифта
      <select id="fontSize">
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16" selected>16</option>
        <option value="17">17</option>
        <option value="18">18</option>
      </select>
    </label>
    <label for="historySize">История N
      <input id="historySize" type="number" min="1" max="200" value="${RULES.historySize}" style="width:70px">
    </label>
    <span id="bankStatus" class="status">Банк: проверка...</span>
    <span id="historyStatus" class="status">История: 0</span>
    <button id="print">Печать</button>
    <button id="reset">Сбросить</button>
  </div>
  <div class="pages" id="pages"></div>
`;

const state = {
  variant: null,
  showAnswers: false,
  historySize: RULES.historySize
};

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function takeRandom(arr, count, rng) {
  return shuffleWithRng(arr, rng).slice(0, count);
}

function pickMixed(pool, total, correctCount, rng) {
  const yes = pool.filter((x) => x.correct);
  const no = pool.filter((x) => !x.correct);
  if (yes.length < correctCount || no.length < total - correctCount) {
    throw new Error("Недостаточно данных в банке для сбалансированной выборки");
  }
  const mixed = [
    ...takeRandom(yes, correctCount, rng),
    ...takeRandom(no, total - correctCount, rng)
  ];
  return shuffleWithRng(mixed, rng);
}

function pickGroupedMixed(pool, total, correctCount, rng, groupField = "group") {
  const grouped = new Map();
  pool.forEach((item) => {
    const key = item && item[groupField];
    if (!key) {
      return;
    }
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });

  const neededIncorrect = total - correctCount;
  const eligibleGroups = [...grouped.values()].filter((items) => {
    const yes = items.filter((x) => x.correct).length;
    const no = items.filter((x) => !x.correct).length;
    return yes >= correctCount && no >= neededIncorrect;
  });

  if (eligibleGroups.length === 0) {
    throw new Error("Недостаточно данных в банке t8: нет корректной группы вариантов");
  }

  const group = oneOf(eligibleGroups, rng);
  const yes = group.filter((x) => x.correct);
  const no = group.filter((x) => !x.correct);
  const mixed = [
    ...takeRandom(yes, correctCount, rng),
    ...takeRandom(no, neededIncorrect, rng)
  ];
  return shuffleWithRng(mixed, rng);
}

function oneOf(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function setHistory(items) {
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(items));
}

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFS_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
}

function variantSignature(data) {
  return [
    data.t1.map((x) => x.id).join("|"),
    data.t2.map((x) => x.id).join("|"),
    data.t3.map((x) => x.id).join("|"),
    data.t4.map((x) => x.id).join("|"),
    data.t5.map((x) => x.id).join("|"),
    data.t6.map((x) => x.id).join("|"),
    data.t7.map((x) => x.id).join("|"),
    data.t8.map((x) => x.id).join("|"),
    data.t9.map((x) => x.id).join("|"),
    data.t10Pairs.map((x) => x.id).join("|"),
    data.t11.id,
    data.t12.id,
    data.t13.id,
    data.t14.map((x) => x.id).join("|")
  ].join("::");
}

function nowSeed() {
  return String(Date.now());
}

function createVariant(seedInput = "") {
  const history = getHistory();
  const recent = new Set(history.slice(-state.historySize).map((x) => x.signature));
  const baseSeed = seedInput.trim() || nowSeed();

  for (let i = 0; i < 300; i += 1) {
    const effectiveSeed = i === 0 ? baseSeed : `${baseSeed}:${i}`;
    const rng = mulberry32(hashString(effectiveSeed));

    const t10Pairs = takeRandom(BANK.t10Pairs, RULES.t10.total, rng);
    const t10Adj = shuffleWithRng(t10Pairs.map((x) => x.adj), rng);
    const t10Noun = shuffleWithRng(t10Pairs.map((x) => x.noun), rng);

    const data = {
      seed: effectiveSeed,
      t1: pickMixed(BANK.t1, RULES.t1.total, RULES.t1.correct, rng),
      t2: pickMixed(BANK.t2, RULES.t2.total, RULES.t2.correct, rng),
      t3: pickMixed(BANK.t3, RULES.t3.total, RULES.t3.correct, rng),
      t4: pickMixed(BANK.t4, RULES.t4.total, RULES.t4.correct, rng),
      t5: takeRandom(BANK.t5, RULES.t5.total, rng),
      t6: pickMixed(BANK.t6, RULES.t6.total, RULES.t6.correct, rng),
      t7: pickMixed(BANK.t7, RULES.t7.total, RULES.t7.correct, rng),
      t8: pickGroupedMixed(BANK.t8, RULES.t8.total, RULES.t8.correct, rng),
      t9: pickMixed(BANK.t9, RULES.t9.total, RULES.t9.correct, rng),
      t10Pairs,
      t10Adj,
      t10Noun,
      t11: { ...oneOf(BANK.t11, rng) },
      t12: oneOf(BANK.t12, rng),
      t13: oneOf(BANK.t13, rng),
      t14: takeRandom(BANK.t14, RULES.t14.total, rng)
    };

    data.t11.options = shuffleWithRng([...data.t11.options], rng);

    const signature = variantSignature(data);
    if (!recent.has(signature) || seedInput.trim()) {
      const nextHistory = [...history, { signature, seed: data.seed, at: Date.now() }].slice(-200);
      setHistory(nextHistory);
      return data;
    }
  }

  throw new Error("Не удалось подобрать уникальный вариант. Увеличьте банк или уменьшите N.");
}

function list(items, cols = 1, showAnswers = false) {
  const cls = cols === 3 ? "items cols-3" : cols === 2 ? "items cols-2" : "items";
  const lines = items
    .map((item) => {
      if (typeof item === "string") {
        return `<div class="item">☐ ${item}</div>`;
      }
      const marker = showAnswers && item.correct ? " correct" : "";
      return `<div class="item${marker}">☐ ${item.text}</div>`;
    })
    .join("");
  return `<div class="${cls}">${lines}</div>`;
}

function letters(words, showAnswers) {
  const cols = words
    .map((entry) => {
      const answers = new Set(entry.answerLetters || []);
      const chars = [...entry.word]
        .map((ch) => {
          const mark = showAnswers && answers.has(ch) ? " correct" : "";
          return `<div class="item${mark}">☐ ${ch}</div>`;
        })
        .join("");
      return `<div class="letters-col">${chars}</div>`;
    })
    .join("");
  return `<div class="letters-wrap">${cols}</div>`;
}

function answerBlock(show, text) {
  if (!show) {
    return "";
  }
  return `<div class="answers-inline"><b>Ответ:</b> ${text}</div>`;
}

function normalizeSegmentationPrompt(text) {
  return String(text)
    .replace(/[.?!,:;…]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function render(data, showAnswers) {
  document.body.classList.toggle("answer-on", showAnswers);

  const t1Answer = data.t1.filter((x) => x.correct).map((x) => x.text).join(", ");
  const t2Answer = data.t2.filter((x) => x.correct).map((x) => x.text).join(", ");
  const t3Answer = data.t3.filter((x) => x.correct).map((x) => x.text).join(", ");
  const t4Answer = data.t4.filter((x) => x.correct).map((x) => x.text).join(", ");
  const t5Answer = data.t5
    .map((x) => `${x.word}: ${x.answerLetters.length ? x.answerLetters.join("") : "нет"}`)
    .join("; ");
  const t6Answer = data.t6.filter((x) => x.correct).map((x) => x.answer).join(", ");
  const t7Answer = data.t7.filter((x) => x.correct).map((x) => x.answer).join(", ");
  const t8Answer = data.t8.find((x) => x.correct)?.text || "-";
  const t9Answer = data.t9.filter((x) => x.correct).map((x) => x.text.replace(/\((.)\/(.)\)/, "$2")).join(", ");
  const t10Answer = data.t10Pairs.map((x) => `${x.adj} - ${x.noun}`).join("; ");
  const t11Answer = data.t11.answer;
  const t12Answer = data.t12.text;
  const t13WordAnswer = data.t13.words.map((w) => `${w.text}: ${w.syllables}`).join("; ");
  const t14Answer = data.t14
    .map((x) => `${x.text} (${x.targetLetter}): ${x.letterPositions.join(",")}`)
    .join("; ");

  const page1 = `
    <div class="page">
      <div class="title">Тест по русскому языку (seed: ${data.seed})</div>
      <div class="grid-main">
        <div class="cell">
          <div class="task-title">1. Выбери ☒ все слова из трех слогов.</div>
          ${list(data.t1, 2, showAnswers)}
          ${answerBlock(showAnswers, t1Answer)}
        </div>
        <div class="cell">
          <div class="task-title">5. Прочитай слова и выбери ☒ буквы, которые обозначают согласные звуки, парные по твердости-мягкости, но непарные по глухости-звонкости.</div>
          ${letters(data.t5, showAnswers)}
          ${answerBlock(showAnswers, t5Answer)}
        </div>
        <div class="cell">
          <div class="task-title">2. Выбери ☒ все слова, в которых второй слог ударный.</div>
          ${list(data.t2, 1, showAnswers)}
          ${answerBlock(showAnswers, t2Answer)}
        </div>
        <div class="cell">
          <div class="task-title">6. Выбери ☒ все слова, в которых нужно вставить букву Ю.</div>
          ${list(data.t6, 2, showAnswers)}
          ${answerBlock(showAnswers, t6Answer)}
        </div>
        <div class="cell">
          <div class="task-title">3. Выбери ☒ все слова, в которых все согласные звуки глухие.</div>
          ${list(data.t3, 2, showAnswers)}
          ${answerBlock(showAnswers, t3Answer)}
        </div>
        <div class="cell">
          <div class="task-title">7. Выбери ☒ все слова, в которых нужно вставить букву Я.</div>
          ${list(data.t7, 2, showAnswers)}
          ${answerBlock(showAnswers, t7Answer)}
        </div>
        <div class="cell row-last-left">
          <div class="task-title">4. Выбери ☒ слова, которые правильно разделены для переноса.</div>
          ${list(data.t4, 2, showAnswers)}
          ${answerBlock(showAnswers, t4Answer)}
        </div>
        <div class="cell row-last-right"></div>
      </div>
    </div>
  `;

  const page2 = `
    <div class="page">
      <div class="section-grid">
        <div class="section">
          <div class="task-title">8. Расположи слова в алфавитном порядке.</div>
          <div>Слова:</div>
          ${list(data.t8, 1, showAnswers)}
          ${answerBlock(showAnswers, t8Answer)}
        </div>
        <div class="section">
          <div class="task-title">10. Соедини каждое слово, называющее предмет, с подходящим по смыслу словом, называющим его признак.</div>
          <div><b>Признаки:</b></div>
          ${list(data.t10Adj, 3, false)}
          <div style="margin-top:6px"><b>Предметы:</b></div>
          ${list(data.t10Noun, 3, false)}
          ${answerBlock(showAnswers, t10Answer)}
        </div>
        <div class="section bottom">
          <div class="task-title">9. Выбери ☒ все слова, в которых нужно написать заглавную букву, если слово употреблено в середине предложения.</div>
          ${list(data.t9, 2, showAnswers)}
          ${answerBlock(showAnswers, t9Answer)}
        </div>
        <div class="section bottom">
          <div class="task-title">11. Выбери ☒ слово, противоположное по значению слову</div>
          <div class="mono"><b>${data.t11.prompt}</b></div>
          ${list(data.t11.options.map((text) => ({ text, correct: text === data.t11.answer })), 1, showAnswers)}
          ${answerBlock(showAnswers, t11Answer)}
        </div>
      </div>
      <div class="section-grid" style="margin-top:2mm; grid-template-columns: 1fr;">
        <div class="section" style="border-right:0;border-bottom:0;">
          <div class="task-title">12. Прочитай и определи границы предложений так, чтобы получился текст.</div>
          <div class="mono">${normalizeSegmentationPrompt(data.t12.text)}</div>
          <div style="margin-top:4px;">Ответ: <span class="line" style="min-width:70px;"></span></div>
          ${answerBlock(showAnswers, t12Answer)}
        </div>
      </div>
      <div class="section-grid" style="margin-top:2mm; grid-template-columns: 1fr 1fr;">
        <div class="section">
          <div class="task-title">13. Расположи буквы, обозначающие гласные звуки, в правом квадрате, а буквы, обозначающие согласные звуки, в левом квадрате.</div>
          <div>Буквы: ${data.t13.letters}</div>
          <table class="small-table">
            <tr><td></td><td></td></tr>
            <tr><td></td><td></td></tr>
            <tr><td></td><td></td></tr>
          </table>
          <div style="margin-top:4px;"><b>Напишите количество слогов в словах:</b></div>
          ${data.t13.words.map((w) => `<div>${w.text} <span class="line"></span></div>`).join("")}
          ${answerBlock(showAnswers, `Гласные: ${data.t13.vowels.join(", ")}; Согласные: ${data.t13.consonants.join(", ")}; ${t13WordAnswer}`)}
        </div>
        <div class="section">
          <div class="task-title">14. Нарисуйте схему слова и отметьте в ней заданную согласную букву, указанную в скобках:</div>
          <div class="scheme-list">
            ${data.t14
              .map(
                (word) => `
                <div class="scheme-row">
                  <div class="scheme-word">${word.text} (${word.targetLetter})</div>
                  <div class="scheme-box"></div>
                </div>
              `
              )
              .join("")}
          </div>
          ${answerBlock(showAnswers, t14Answer)}
        </div>
      </div>
    </div>
  `;

  const pages = document.querySelector("#pages");
  pages.innerHTML = page1 + page2;
}

function validateBank() {
  const status = document.querySelector("#bankStatus");
  const checks = [];

  if (!BANK_SCHEMA_VALIDATION.ok) {
    const maxErrors = 4;
    const head = BANK_SCHEMA_VALIDATION.errors.slice(0, maxErrors);
    const tailCount = Math.max(0, BANK_SCHEMA_VALIDATION.errors.length - head.length);
    const summary = tailCount > 0 ? `${head.join("; ")}; ... (+${tailCount})` : head.join("; ");
    checks.push(`схема: ${summary}`);
  }

  const checkBalanced = (key, rule) => {
    const yes = BANK[key].filter((x) => x.correct).length;
    const no = BANK[key].filter((x) => !x.correct).length;
    if (yes < rule.correct || no < rule.total - rule.correct) {
      checks.push(`${key}: мало данных`);
    }
  };

  checkBalanced("t1", RULES.t1);
  checkBalanced("t2", RULES.t2);
  checkBalanced("t3", RULES.t3);
  checkBalanced("t4", RULES.t4);
  checkBalanced("t6", RULES.t6);
  checkBalanced("t7", RULES.t7);
  checkBalanced("t8", RULES.t8);
  checkBalanced("t9", RULES.t9);

  if (checks.length) {
    status.textContent = `Банк: ошибка (${checks.join("; ")})`;
    status.style.background = "#fff0f0";
    status.style.borderColor = "#b33";
    return false;
  }

  status.textContent = "Банк: OK";
  status.style.background = "#eef9ee";
  status.style.borderColor = "#2f7a2f";
  return true;
}

function applyFontSize(pt) {
  const base = Number(pt) || 16;
  const printBase = Math.max(10, base - 4);
  document.documentElement.style.setProperty("--fs", `${base}pt`);
  document.documentElement.style.setProperty("--print-fs", `${printBase}pt`);
}

function updateHistoryStatus() {
  const history = getHistory();
  const status = document.querySelector("#historyStatus");
  status.textContent = `История: ${history.length} (N=${state.historySize})`;
}

function generate(seedValue = "") {
  state.variant = createVariant(seedValue);
  document.querySelector("#seedInput").value = state.variant.seed;
  render(state.variant, state.showAnswers);
  updateHistoryStatus();
}

function syncModeButton() {
  document.querySelector("#mode").textContent = state.showAnswers ? "Режим: с ответами" : "Режим: бланк";
}

function printBlank() {
  const wasAnswers = state.showAnswers;
  if (wasAnswers) {
    state.showAnswers = false;
    syncModeButton();
    render(state.variant, false);
  }

  window.addEventListener(
    "afterprint",
    () => {
      if (wasAnswers) {
        state.showAnswers = true;
        syncModeButton();
        render(state.variant, true);
      }
    },
    { once: true }
  );

  window.print();
}

function init() {
  const prefs = loadPrefs();

  state.showAnswers = Boolean(prefs.showAnswers);
  state.historySize = Number(prefs.historySize) || RULES.historySize;

  syncModeButton();

  const fontSize = Number(prefs.fontSize) || 16;
  document.querySelector("#fontSize").value = String(fontSize);
  applyFontSize(fontSize);

  const historyInput = document.querySelector("#historySize");
  historyInput.value = String(state.historySize);

  if (!validateBank()) {
    return;
  }

  generate("");
  updateHistoryStatus();

  document.querySelector("#generate").addEventListener("click", () => generate(""));

  document.querySelector("#applySeed").addEventListener("click", () => {
    const seed = document.querySelector("#seedInput").value;
    generate(seed);
  });

  document.querySelector("#seedInput").addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
      generate(document.querySelector("#seedInput").value);
    }
  });

  document.querySelector("#mode").addEventListener("click", () => {
    state.showAnswers = !state.showAnswers;
    syncModeButton();
    render(state.variant, state.showAnswers);
    savePrefs({ ...loadPrefs(), showAnswers: state.showAnswers });
  });

  document.querySelector("#fontSize").addEventListener("change", (evt) => {
    applyFontSize(evt.target.value);
    savePrefs({ ...loadPrefs(), fontSize: Number(evt.target.value) });
  });

  historyInput.addEventListener("change", (evt) => {
    const value = Math.max(1, Math.min(200, Number(evt.target.value) || RULES.historySize));
    state.historySize = value;
    historyInput.value = String(value);
    updateHistoryStatus();
    savePrefs({ ...loadPrefs(), historySize: value });
  });

  document.querySelector("#print").addEventListener("click", printBlank);

  document.querySelector("#reset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_PREFS_KEY);
    state.showAnswers = false;
    state.historySize = RULES.historySize;
    syncModeButton();
    document.querySelector("#historySize").value = String(RULES.historySize);
    document.querySelector("#fontSize").value = "16";
    applyFontSize(16);
    generate("");
  });
}

init();
