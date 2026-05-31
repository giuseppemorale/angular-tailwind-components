/**
 * Release v2 — flusso su branch develop
 *
 * Prerequisiti: branch develop, working tree pulito consigliato.
 *
 * SNAPSHOT (es. 2.1.0-SNAPSHOT):
 *   → stacca la prima RC (2.1.0-RC1), build, commit, push, tag, publish @rc
 *
 * RC (es. 2.1.0-RC2):
 *   1 = avanza RC
 *   2 = chiude in stabile 2.1.0:
 *       commit su develop → branch release/2.1.0 → tag v2.1.0 → npm latest
 *       → merge release/2.1.0 in master → merge master in develop
 *       → develop torna a M.m.(p+1)-SNAPSHOT (es. 2.1.1-SNAPSHOT)
 *
 * I tag vM.m.p-SNAPSHOT-{i} su develop sono creati dal workflow GitHub.
 *
 * Uso: npm run release:v2
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const DEVELOP_BRANCH = 'develop';
const ROOT = path.join(__dirname, '..');
const rootPackageJsonPath = path.join(ROOT, 'package.json');
const libPackageJsonPath = path.join(ROOT, 'projects/angular-tailwind-components/package.json');
const distLibPath = path.join(ROOT, 'dist/angular-tailwind-components');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = question =>
  new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });

function isYes(answer) {
  const normalized = answer.trim().toLowerCase();
  return normalized === 'y' || normalized === 'yes' || normalized === 's' || normalized === 'si';
}

function run(cmd, options = {}) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...options });
}

function runCapture(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function readRootVersion() {
  return JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8')).version;
}

/**
 * @returns {{ kind: 'snapshot'|'rc'|'stable', major: number, minor: number, patch: number, rc?: number, raw: string }}
 */
function parseVersion(version) {
  const snapshot = version.match(/^(\d+)\.(\d+)\.(\d+)-SNAPSHOT$/i);
  if (snapshot) {
    return {
      kind: 'snapshot',
      major: +snapshot[1],
      minor: +snapshot[2],
      patch: +snapshot[3],
      raw: version
    };
  }

  const rc = version.match(/^(\d+)\.(\d+)\.(\d+)-RC(\d+)$/i);
  if (rc) {
    return {
      kind: 'rc',
      major: +rc[1],
      minor: +rc[2],
      patch: +rc[3],
      rc: +rc[4],
      raw: version
    };
  }

  const stable = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (stable) {
    return {
      kind: 'stable',
      major: +stable[1],
      minor: +stable[2],
      patch: +stable[3],
      raw: version
    };
  }

  throw new Error(`Formato versione non supportato: ${version}`);
}

function formatStable({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function formatRc({ major, minor, patch, rc }) {
  return `${major}.${minor}.${patch}-RC${rc}`;
}

function formatSnapshot({ major, minor, patch }) {
  return `${major}.${minor}.${patch}-SNAPSHOT`;
}

function snapshotBaseToFirstRc(version) {
  const parsed = parseVersion(version);
  if (parsed.kind !== 'snapshot') {
    throw new Error(`Attesa versione SNAPSHOT, trovata: ${version}`);
  }
  return formatRc({ ...parsed, rc: 1 });
}

function advanceRcVersion(version) {
  const parsed = parseVersion(version);
  if (parsed.kind !== 'rc') {
    throw new Error(`Attesa versione RC, trovata: ${version}`);
  }
  return formatRc({ ...parsed, rc: parsed.rc + 1 });
}

function closeRcVersion(version) {
  const parsed = parseVersion(version);
  if (parsed.kind !== 'rc') {
    throw new Error(`Attesa versione RC, trovata: ${version}`);
  }
  return formatStable(parsed);
}

function nextDevelopSnapshotAfterStable(stableVersion) {
  const parsed = parseVersion(stableVersion);
  if (parsed.kind !== 'stable') {
    throw new Error(`Attesa versione stabile, trovata: ${stableVersion}`);
  }
  return formatSnapshot({
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch + 1
  });
}

function releaseBranchName(stableVersion) {
  return `release/${stableVersion}`;
}

function assertOnDevelopBranch() {
  const branch = runCapture('git branch --show-current');
  if (branch !== DEVELOP_BRANCH) {
    const current = branch || 'detached HEAD';
    throw new Error(`release-v2 consentito solo su "${DEVELOP_BRANCH}" (branch attuale: "${current}").`);
  }
}

function assertCleanWorkingTree() {
  const status = runCapture('git status --porcelain');
  if (status) {
    throw new Error('Working tree non pulito. Committa o stasha le modifiche prima della release.');
  }
}

function checkNpmLogin() {
  console.log('\nVerifica login npm...');
  try {
    const who = runCapture('npm whoami');
    console.log(`Autenticato come: ${who}`);
  } catch {
    console.error(
      '\n❌ Non risulti autenticato su npm.\n' +
        '   Esegui: npm login\n' +
        '   Con 2FA publish: npm publish --otp=<codice>\n'
    );
    process.exit(1);
  }
}

function setPackageVersions(newVersion) {
  console.log(`\nImposto versione ${newVersion}...`);
  run(`npm version ${newVersion} --no-git-tag-version`);

  const libPackageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));
  libPackageJson.version = newVersion;
  fs.writeFileSync(libPackageJsonPath, JSON.stringify(libPackageJson, null, 2) + '\n');
}

function buildLibrary() {
  console.log('\nBuild libreria...');
  run('npm run build');
}

function gitCommitRelease(version, messageSuffix = '') {
  run('git add .');
  const msg = messageSuffix ? `Release ${version} (${messageSuffix})` : `Release ${version}`;
  run(`git commit -m "${msg}"`);
}

function gitPushBranch(branch = DEVELOP_BRANCH) {
  console.log(`Push origin ${branch}...`);
  run(`git push origin ${branch}`);
}

function pushTag(version) {
  const tag = `v${version}`;
  console.log(`\nTag ${tag}...`);
  run(`git tag ${tag}`);
  run(`git push origin ${tag}`);
}

function publishToNpm(version) {
  console.log('\nPublish npm...');
  const args = ['publish', '--access', 'public'];
  const parsed = parseVersion(version);

  if (parsed.kind === 'rc') {
    args.push('--tag', 'rc');
    console.log('RC → dist-tag "rc".');
  } else if (parsed.kind === 'stable') {
    console.log('Stabile → dist-tag default (latest).');
  } else {
    throw new Error('Publish npm solo per RC o versione stabile.');
  }

  run(`npm ${args.join(' ')}`, { cwd: distLibPath });
}

async function confirm(message) {
  if (!isYes(await ask(`${message} (y/n): `))) {
    throw new Error('Operazione annullata.');
  }
}

/**
 * @returns {{ nextVersion: string, mode: 'rc'|'stable' }}
 */
async function determineReleaseStep(currentVersion) {
  const parsed = parseVersion(currentVersion);

  if (parsed.kind === 'snapshot') {
    const firstRc = snapshotBaseToFirstRc(currentVersion);
    console.log(`\nVersione SNAPSHOT: ${currentVersion}`);
    console.log(`Prima RC: ${firstRc}`);
    await confirm('Staccare la RC');
    return { nextVersion: firstRc, mode: 'rc' };
  }

  if (parsed.kind === 'rc') {
    const nextRc = advanceRcVersion(currentVersion);
    const stable = closeRcVersion(currentVersion);

    console.log(`\nRC in corso: ${currentVersion}`);
    const question = `
Cosa vuoi fare?
1 = avanzare RC (${currentVersion} → ${nextRc})
2 = chiudere e rilasciare stabile (${currentVersion} → ${stable})
Inserisci 1 o 2: `;

    const answer = (await ask(question)).trim();
    if (answer === '1') {
      return { nextVersion: nextRc, mode: 'rc' };
    }
    if (answer === '2') {
      await confirm(`Confermi release stabile ${stable}`);
      return { nextVersion: stable, mode: 'stable' };
    }
    throw new Error('Opzione non valida. Deve essere 1 o 2.');
  }

  throw new Error(
    `Su develop è attesa una versione *-SNAPSHOT o *-RCn (attuale: "${currentVersion}").\n` +
      'Dopo una release stabile lo script imposta il prossimo SNAPSHOT; se vedi una stabile, verifica merge/cherry-pick.'
  );
}

async function runRcRelease(nextVersion) {
  setPackageVersions(nextVersion);
  buildLibrary();
  gitCommitRelease(nextVersion);
  gitPushBranch(DEVELOP_BRANCH);
  pushTag(nextVersion);
  publishToNpm(nextVersion);
  console.log(`\n✅ RC ${nextVersion} pubblicata.`);
}

async function runStableRelease(stableVersion) {
  const relBranch = releaseBranchName(stableVersion);
  const nextSnapshot = nextDevelopSnapshotAfterStable(stableVersion);

  console.log(`\nPiano release stabile ${stableVersion}:`);
  console.log(`  • branch ${relBranch}`);
  console.log(`  • merge → master → develop`);
  console.log(`  • develop → ${nextSnapshot}`);

  setPackageVersions(stableVersion);
  buildLibrary();
  gitCommitRelease(stableVersion);
  gitPushBranch(DEVELOP_BRANCH);

  console.log(`\nBranch ${relBranch}...`);
  run(`git branch ${relBranch}`);
  run(`git push -u origin ${relBranch}`);

  pushTag(stableVersion);
  publishToNpm(stableVersion);

  console.log('\nMerge in master...');
  run('git fetch origin master');
  run('git checkout master');
  run('git pull origin master');
  run(`git merge ${relBranch} -m "Merge ${relBranch} into master"`);
  gitPushBranch('master');

  console.log('\nMerge master in develop...');
  run(`git checkout ${DEVELOP_BRANCH}`);
  run(`git pull origin ${DEVELOP_BRANCH}`);
  run('git merge origin/master -m "Merge master into develop"');
  gitPushBranch(DEVELOP_BRANCH);

  console.log(`\nBump develop → ${nextSnapshot}...`);
  setPackageVersions(nextSnapshot);
  run('git add .');
  run(`git commit -m "chore: bump develop to ${nextSnapshot}"`);
  gitPushBranch(DEVELOP_BRANCH);

  console.log(`\n✅ Release stabile ${stableVersion} completata.`);
  console.log(`   Branch: ${relBranch}`);
  console.log(`   develop: ${nextSnapshot}`);
  console.log('   I prossimi push su develop genereranno tag snapshot via GitHub Actions.');
}

async function main() {
  assertOnDevelopBranch();
  assertCleanWorkingTree();

  const currentVersion = readRootVersion();
  console.log(`Branch: ${DEVELOP_BRANCH}`);
  console.log(`Versione attuale: ${currentVersion}`);

  const { nextVersion, mode } = await determineReleaseStep(currentVersion);
  console.log(`\nTarget: ${nextVersion} (${mode})`);

  checkNpmLogin();

  if (mode === 'rc') {
    await runRcRelease(nextVersion);
  } else {
    await runStableRelease(nextVersion);
  }
}

main()
  .catch(error => {
    console.error('\n❌ Errore durante release-v2:');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
