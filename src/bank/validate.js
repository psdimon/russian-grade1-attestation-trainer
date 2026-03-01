const KNOWN_TYPES = new Set([
  "single_pool_with_correct_flags",
  "single_pool_with_correct_flags_and_resolved_form",
  "single_choice_variant_group",
  "word_with_multiple_letter_answers",
  "paired_match_pool",
  "prompt_with_options_and_single_answer",
  "text_segmentation",
  "letters_classification_and_word_syllables",
  "word_scheme_with_letter_positions"
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

function validateCommon(taskKey, task, errors) {
  if (!isObject(task)) {
    errors.push(`${taskKey}: task must be an object`);
    return false;
  }
  if (!isObject(task.meta)) {
    errors.push(`${taskKey}: meta must be an object`);
    return false;
  }
  if (!hasNonEmptyString(task.meta.title)) {
    errors.push(`${taskKey}: meta.title must be non-empty string`);
  }
  if (!KNOWN_TYPES.has(task.meta.type)) {
    errors.push(`${taskKey}: unsupported meta.type "${task.meta.type}"`);
    return false;
  }
  if (!isObject(task.meta.constraints)) {
    errors.push(`${taskKey}: meta.constraints must be an object`);
  }
  return true;
}

function validateIds(taskKey, list, errors, globalIds) {
  const localIds = new Set();
  list.forEach((item, i) => {
    if (!isObject(item)) {
      errors.push(`${taskKey}[${i}]: item must be an object`);
      return;
    }
    if (!hasNonEmptyString(item.id)) {
      errors.push(`${taskKey}[${i}]: id must be non-empty string`);
      return;
    }
    if (localIds.has(item.id)) {
      errors.push(`${taskKey}: duplicate id inside task: ${item.id}`);
    }
    localIds.add(item.id);
    if (globalIds.has(item.id)) {
      errors.push(`${taskKey}: duplicate id across tasks: ${item.id}`);
    }
    globalIds.add(item.id);
  });
}

function validateTotalCorrectConstraints(taskKey, constraints, errors) {
  if (!isPositiveInt(constraints.total)) {
    errors.push(`${taskKey}: constraints.total must be positive integer`);
    return;
  }
  if (!isPositiveInt(constraints.correct)) {
    errors.push(`${taskKey}: constraints.correct must be positive integer`);
    return;
  }
  if (constraints.correct > constraints.total) {
    errors.push(`${taskKey}: constraints.correct cannot be greater than constraints.total`);
  }
  if (constraints.incorrect !== undefined) {
    if (!isPositiveInt(constraints.incorrect)) {
      errors.push(`${taskKey}: constraints.incorrect must be positive integer`);
    } else if (constraints.correct + constraints.incorrect !== constraints.total) {
      errors.push(`${taskKey}: constraints.correct + constraints.incorrect must equal constraints.total`);
    }
  }
}

function validatePoolWithCorrectFlags(taskKey, task, errors, extraChecks = null) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, extraChecks.globalIds);
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.text)) {
      errors.push(`${taskKey}[${i}]: text must be non-empty string`);
    }
    if (typeof item.correct !== "boolean") {
      errors.push(`${taskKey}[${i}]: correct must be boolean`);
    }
    if (extraChecks.requireAnswer && !hasNonEmptyString(item.answer)) {
      errors.push(`${taskKey}[${i}]: answer must be non-empty string`);
    }
  });
  validateTotalCorrectConstraints(taskKey, task.meta.constraints, errors);
  const yes = task.items.filter((x) => x && x.correct === true).length;
  const no = task.items.filter((x) => x && x.correct === false).length;
  const { total, correct } = task.meta.constraints;
  if (isPositiveInt(total) && isPositiveInt(correct)) {
    if (yes < correct || no < total - correct) {
      errors.push(`${taskKey}: not enough items for total/correct constraints`);
    }
  }
}

function validateSingleChoiceVariantGroup(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.text)) {
      errors.push(`${taskKey}[${i}]: text must be non-empty string`);
    }
    if (typeof item.correct !== "boolean") {
      errors.push(`${taskKey}[${i}]: correct must be boolean`);
    }
  });
  validateTotalCorrectConstraints(taskKey, task.meta.constraints, errors);
  const yes = task.items.filter((x) => x && x.correct === true).length;
  if (yes < 1) {
    errors.push(`${taskKey}: must contain at least one correct item`);
  }
}

function validateWordWithLetterAnswers(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  const { total } = task.meta.constraints;
  if (!isPositiveInt(total)) {
    errors.push(`${taskKey}: constraints.total must be positive integer`);
  }
  if (isPositiveInt(total) && task.items.length < total) {
    errors.push(`${taskKey}: items.length is less than constraints.total`);
  }
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.word)) {
      errors.push(`${taskKey}[${i}]: word must be non-empty string`);
    }
    if (!Array.isArray(item.answerLetters)) {
      errors.push(`${taskKey}[${i}]: answerLetters must be array`);
      return;
    }
    item.answerLetters.forEach((letter, j) => {
      if (!hasNonEmptyString(letter)) {
        errors.push(`${taskKey}[${i}].answerLetters[${j}]: must be non-empty string`);
      } else if (hasNonEmptyString(item.word) && !item.word.includes(letter)) {
        errors.push(`${taskKey}[${i}]: answer letter "${letter}" not found in word`);
      }
    });
  });
}

function validatePairedMatchPool(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.pairs)) {
    errors.push(`${taskKey}: pairs must be array`);
    return;
  }
  validateIds(taskKey, task.pairs, errors, globalIds);
  const { total } = task.meta.constraints;
  if (!isPositiveInt(total)) {
    errors.push(`${taskKey}: constraints.total must be positive integer`);
  }
  if (isPositiveInt(total) && task.pairs.length < total) {
    errors.push(`${taskKey}: pairs.length is less than constraints.total`);
  }
  task.pairs.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.adj)) {
      errors.push(`${taskKey}[${i}]: adj must be non-empty string`);
    }
    if (!hasNonEmptyString(item.noun)) {
      errors.push(`${taskKey}[${i}]: noun must be non-empty string`);
    }
  });
}

function validatePromptWithOptions(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  const expectedOptions = task.meta.constraints.optionsPerPrompt;
  if (!isPositiveInt(expectedOptions)) {
    errors.push(`${taskKey}: constraints.optionsPerPrompt must be positive integer`);
  }
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.prompt)) {
      errors.push(`${taskKey}[${i}]: prompt must be non-empty string`);
    }
    if (!Array.isArray(item.options)) {
      errors.push(`${taskKey}[${i}]: options must be array`);
      return;
    }
    if (isPositiveInt(expectedOptions) && item.options.length !== expectedOptions) {
      errors.push(`${taskKey}[${i}]: options.length must be ${expectedOptions}`);
    }
    item.options.forEach((opt, j) => {
      if (!hasNonEmptyString(opt)) {
        errors.push(`${taskKey}[${i}].options[${j}] must be non-empty string`);
      }
    });
    if (!hasNonEmptyString(item.answer)) {
      errors.push(`${taskKey}[${i}]: answer must be non-empty string`);
    } else if (!item.options.includes(item.answer)) {
      errors.push(`${taskKey}[${i}]: answer is not present in options`);
    }
  });
}

function validateTextSegmentation(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.text)) {
      errors.push(`${taskKey}[${i}]: text must be non-empty string`);
    }
  });
}

function validateLettersClassification(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  const wordsPerSet = task.meta.constraints.wordsPerSet;
  if (!isPositiveInt(wordsPerSet)) {
    errors.push(`${taskKey}: constraints.wordsPerSet must be positive integer`);
  }
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.letters)) {
      errors.push(`${taskKey}[${i}]: letters must be non-empty string`);
    }
    if (!Array.isArray(item.vowels) || item.vowels.some((x) => !hasNonEmptyString(x))) {
      errors.push(`${taskKey}[${i}]: vowels must be array of non-empty strings`);
    }
    if (!Array.isArray(item.consonants) || item.consonants.some((x) => !hasNonEmptyString(x))) {
      errors.push(`${taskKey}[${i}]: consonants must be array of non-empty strings`);
    }
    if (!Array.isArray(item.words)) {
      errors.push(`${taskKey}[${i}]: words must be array`);
      return;
    }
    if (isPositiveInt(wordsPerSet) && item.words.length !== wordsPerSet) {
      errors.push(`${taskKey}[${i}]: words.length must be ${wordsPerSet}`);
    }
    item.words.forEach((word, j) => {
      if (!isObject(word)) {
        errors.push(`${taskKey}[${i}].words[${j}] must be object`);
        return;
      }
      if (!hasNonEmptyString(word.text)) {
        errors.push(`${taskKey}[${i}].words[${j}].text must be non-empty string`);
      }
      if (!isPositiveInt(word.syllables)) {
        errors.push(`${taskKey}[${i}].words[${j}].syllables must be positive integer`);
      }
    });
  });
}

function validateWordScheme(taskKey, task, errors, globalIds) {
  if (!Array.isArray(task.items)) {
    errors.push(`${taskKey}: items must be array`);
    return;
  }
  validateIds(taskKey, task.items, errors, globalIds);
  const { total } = task.meta.constraints;
  if (!isPositiveInt(total)) {
    errors.push(`${taskKey}: constraints.total must be positive integer`);
  }
  if (isPositiveInt(total) && task.items.length < total) {
    errors.push(`${taskKey}: items.length is less than constraints.total`);
  }
  task.items.forEach((item, i) => {
    if (!isObject(item)) {
      return;
    }
    if (!hasNonEmptyString(item.text)) {
      errors.push(`${taskKey}[${i}]: text must be non-empty string`);
    }
    if (!hasNonEmptyString(item.targetLetter) || item.targetLetter.length !== 1) {
      errors.push(`${taskKey}[${i}]: targetLetter must be single non-empty character`);
    }
    if (!Array.isArray(item.letterPositions) || item.letterPositions.length === 0) {
      errors.push(`${taskKey}[${i}]: letterPositions must be non-empty array`);
      return;
    }
    item.letterPositions.forEach((pos, j) => {
      if (!isPositiveInt(pos)) {
        errors.push(`${taskKey}[${i}].letterPositions[${j}] must be positive integer`);
      } else if (hasNonEmptyString(item.text) && pos > item.text.length) {
        errors.push(`${taskKey}[${i}].letterPositions[${j}] exceeds word length`);
      } else if (
        hasNonEmptyString(item.text) &&
        hasNonEmptyString(item.targetLetter) &&
        item.text[pos - 1]?.toLowerCase() !== item.targetLetter.toLowerCase()
      ) {
        errors.push(`${taskKey}[${i}].letterPositions[${j}] does not match targetLetter`);
      }
    });
  });
}

export function validateTasksSchema(tasks) {
  const errors = [];
  const globalIds = new Set();
  const keys = Object.keys(tasks || {});

  keys.forEach((taskKey) => {
    const task = tasks[taskKey];
    if (!validateCommon(taskKey, task, errors)) {
      return;
    }
    switch (task.meta.type) {
      case "single_pool_with_correct_flags":
        validatePoolWithCorrectFlags(taskKey, task, errors, { globalIds, requireAnswer: false });
        break;
      case "single_pool_with_correct_flags_and_resolved_form":
        validatePoolWithCorrectFlags(taskKey, task, errors, { globalIds, requireAnswer: true });
        break;
      case "single_choice_variant_group":
        validateSingleChoiceVariantGroup(taskKey, task, errors, globalIds);
        break;
      case "word_with_multiple_letter_answers":
        validateWordWithLetterAnswers(taskKey, task, errors, globalIds);
        break;
      case "paired_match_pool":
        validatePairedMatchPool(taskKey, task, errors, globalIds);
        break;
      case "prompt_with_options_and_single_answer":
        validatePromptWithOptions(taskKey, task, errors, globalIds);
        break;
      case "text_segmentation":
        validateTextSegmentation(taskKey, task, errors, globalIds);
        break;
      case "letters_classification_and_word_syllables":
        validateLettersClassification(taskKey, task, errors, globalIds);
        break;
      case "word_scheme_with_letter_positions":
        validateWordScheme(taskKey, task, errors, globalIds);
        break;
      default:
        errors.push(`${taskKey}: unsupported type "${task.meta.type}"`);
    }
  });

  return {
    ok: errors.length === 0,
    errors
  };
}
