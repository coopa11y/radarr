import { readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, '../src');
const findings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      return walk(path);
    }

    if (/\.(js|jsx|ts|tsx)$/.test(name)) {
      return [path];
    }

    return [];
  });
}

function addFinding(file, message) {
  findings.push(`${relative(root, file)}: ${message}`);
}

for (const file of walk(root)) {
  const source = readFileSync(file, 'utf8');
  const normalizedPath = relative(root, file).replace(/\\/g, '/');

  if (
    source.includes('currentTarget.click()') &&
    !normalizedPath.endsWith('Helpers/Hooks/useKeyboardActivation.ts')
  ) {
    addFinding(
      file,
      'use useKeyboardActivation() instead of a local currentTarget.click() key handler'
    );
  }

  if (
    /event\.key\s*===\s*['"] ['"]/.test(source) &&
    !normalizedPath.endsWith('Helpers/Hooks/useKeyboardActivation.ts') &&
    !normalizedPath.endsWith('Components/Form/Select/EnhancedSelectInput.tsx')
  ) {
    addFinding(
      file,
      'review local Space key handling; use a shared helper when this is button activation'
    );
  }

  if (
    /className=\{styles\.underlay\}/.test(source) &&
    normalizedPath.startsWith('Settings/') &&
    /\/Add[^/]*Item\.(js|jsx|ts|tsx)$/.test(normalizedPath) &&
    !source.includes('<ActionCard')
  ) {
    addFinding(
      file,
      'provider/add-item underlay should use ActionCard so the visible action is accessible'
    );
  }

  if (
    source.includes('<ReactSlider') &&
    !source.includes('ariaLabel') &&
    !source.includes('ariaLabelledby')
  ) {
    addFinding(file, 'ReactSlider controls must provide ariaLabel or ariaLabelledby');
  }
}

if (findings.length) {
  console.error('Accessibility guard found issues:\n');
  console.error(findings.map((finding) => `- ${finding}`).join('\n'));
  process.exit(1);
}

console.log('Accessibility guard passed.');
