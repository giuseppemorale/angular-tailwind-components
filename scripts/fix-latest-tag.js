const readline = require('readline');
const { execFileSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = question =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });

function git(args, options = {}) {
  const stdio = options.inherit ? 'inherit' : 'pipe';
  const result = execFileSync('git', args, {
    encoding: options.encoding ?? 'utf8',
    stdio
  });
  return typeof result === 'string' ? result.trim() : result;
}

function assertOnMasterBranch() {
  const branch = git(['branch', '--show-current']);

  if (branch !== 'master') {
    const current = branch || 'detached HEAD';
    throw new Error(`Operazione consentita solo su master (branch attuale: "${current}").`);
  }
}

function getLatestVersionTag() {
  const tags = git(['tag', '-l', 'v*', '--sort=-v:refname'])
    .split('\n')
    .map(tag => tag.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error('Nessun tag v* trovato nel repository.');
  }

  return tags[0];
}

function resolveTagCommit(tag) {
  try {
    return git(['rev-list', '-n', '1', tag]);
  } catch {
    throw new Error(`Tag ${tag} non trovato. Esegui "git fetch --tags" o verifica che il tag esista.`);
  }
}

function isYes(answer) {
  const normalized = answer.trim().toLowerCase();
  return normalized === 'y' || normalized === 'yes' || normalized === 's' || normalized === 'si';
}

function deleteRemoteTag(tag) {
  try {
    git(['push', 'origin', `:refs/tags/${tag}`], { inherit: true });
  } catch {
    console.log(`Tag remoto ${tag} assente o già rimosso — continuo.`);
  }
}

async function main() {
  assertOnMasterBranch();

  console.log('Fetching tags...');
  git(['fetch', '--tags'], { inherit: true });

  const tag = getLatestVersionTag();
  const taggedCommit = resolveTagCommit(tag);
  const headCommit = git(['rev-parse', 'HEAD']);

  console.log(`\nUltimo tag: ${tag}`);
  console.log(`  commit del tag: ${taggedCommit}`);
  console.log(`  HEAD (master):  ${headCommit}`);

  if (taggedCommit === headCommit) {
    console.log('\nIl tag punta già a HEAD. Nessuna azione necessaria.');
    return;
  }

  const taggedSubject = git(['log', '-1', '--format=%s', taggedCommit]);
  const headSubject = git(['log', '-1', '--format=%s', headCommit]);

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
    git(['tag', '-d', tag], { inherit: true });
  } catch {
    console.log(`Tag locale ${tag} assente — continuo.`);
  }

  deleteRemoteTag(tag);

  console.log(`\nCreating tag ${tag} on HEAD...`);
  git(['tag', tag], { inherit: true });

  console.log('Pushing tag...');
  git(['push', 'origin', tag], { inherit: true });

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
