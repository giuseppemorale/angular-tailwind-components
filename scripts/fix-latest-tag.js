const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = question =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });

function run(command, options = {}) {
  return execSync(command, { encoding: 'utf8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
}

function runQuiet(command) {
  return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function assertOnMasterBranch() {
  const branch = runQuiet('git branch --show-current');

  if (branch !== 'master') {
    const current = branch || 'detached HEAD';
    throw new Error(`Operazione consentita solo su master (branch attuale: "${current}").`);
  }
}

function getLatestVersionTag() {
  const tags = runQuiet('git tag -l "v*" --sort=-v:refname')
    .split('\n')
    .map(tag => tag.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error('Nessun tag v* trovato nel repository.');
  }

  return tags[0];
}

function isYes(answer) {
  const normalized = answer.trim().toLowerCase();
  return normalized === 'y' || normalized === 'yes' || normalized === 's' || normalized === 'si';
}

function deleteRemoteTag(tag) {
  try {
    run(`git push origin :refs/tags/${tag}`);
  } catch {
    console.log(`Tag remoto ${tag} assente o già rimosso — continuo.`);
  }
}

async function main() {
  assertOnMasterBranch();

  console.log('Fetching tags...');
  run('git fetch --tags');

  const tag = getLatestVersionTag();
  const taggedCommit = runQuiet(`git rev-parse ${tag}^{commit}`);
  const headCommit = runQuiet('git rev-parse HEAD');

  console.log(`\nUltimo tag: ${tag}`);
  console.log(`  commit del tag: ${taggedCommit}`);
  console.log(`  HEAD (master):  ${headCommit}`);

  if (taggedCommit === headCommit) {
    console.log('\nIl tag punta già a HEAD. Nessuna azione necessaria.');
    return;
  }

  const taggedSubject = runQuiet(`git log -1 --format=%s ${taggedCommit}`);
  const headSubject = runQuiet(`git log -1 --format=%s ${headCommit}`);

  console.log(`  messaggio tag:  ${taggedSubject}`);
  console.log(`  messaggio HEAD: ${headSubject}`);

  const confirm = await ask(
    `\nSpostare ${tag} su HEAD e ripushare (cancella il tag remoto precedente)? (y/n): `
  );

  if (!isYes(confirm)) {
    console.log('Operazione annullata.');
    return;
  }

  try {
    run(`git tag -d ${tag}`);
  } catch {
    console.log(`Tag locale ${tag} assente — continuo.`);
  }

  deleteRemoteTag(tag);

  console.log(`\nCreating tag ${tag} on HEAD...`);
  run(`git tag ${tag}`);

  console.log('Pushing tag...');
  run(`git push origin ${tag}`);

  console.log(`\n✅ Tag ${tag} aggiornato su HEAD. GitHub Actions dovrebbe ripartire.`);
}

main()
  .catch(error => {
    console.error('\n❌ Errore:');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
