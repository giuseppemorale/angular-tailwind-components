const fs = require('fs');
const path = require('path');
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

const rootPackageJsonPath = path.join(__dirname, '../package.json');
const libPackageJsonPath = path.join(__dirname, '../projects/angular-tailwind-components/package.json');

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-RC(\d+))?$/i);

  if (!match) {
    throw new Error(`Formato versione non supportato: ${version}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    rc: match[4] != null ? parseInt(match[4], 10) : null,
    isRc: match[4] != null
  };
}

function formatVersion({ major, minor, patch, rc }) {
  const base = `${major}.${minor}.${patch}`;
  return rc != null ? `${base}-RC${rc}` : base;
}

function bumpByReleaseType(currentVersion, releaseType, withRc) {
  const version = parseVersion(currentVersion);

  switch (releaseType) {
    case 'major':
      return formatVersion({
        major: version.major + 1,
        minor: 0,
        patch: 0,
        rc: withRc ? 1 : null
      });
    case 'minor':
      return formatVersion({
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
        rc: withRc ? 1 : null
      });
    case 'patch':
      return formatVersion({
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        rc: withRc ? 1 : null
      });
    default:
      throw new Error(`Tipo di release non valido: ${releaseType}`);
  }
}

function advanceRc(currentVersion) {
  const version = parseVersion(currentVersion);

  if (!version.isRc) {
    throw new Error('La versione attuale non e una RC');
  }

  return formatVersion({ ...version, rc: version.rc + 1 });
}

function closeRc(currentVersion) {
  const version = parseVersion(currentVersion);

  if (!version.isRc) {
    throw new Error('La versione attuale non e una RC');
  }

  return formatVersion({
    major: version.major,
    minor: version.minor,
    patch: version.patch,
    rc: null
  });
}

function isRcVersion(version) {
  return parseVersion(version).isRc;
}

function isYes(answer) {
  const normalized = answer.trim().toLowerCase();
  return normalized === 'y' || normalized === 'yes' || normalized === 's' || normalized === 'si';
}

async function determineNewVersion(currentVersion) {
  if (isRcVersion(currentVersion)) {
    const nextRc = advanceRc(currentVersion);
    const stableVersion = closeRc(currentVersion);

    console.log(`\nRelease candidate in corso: ${currentVersion}`);

    const question = `
Cosa vuoi fare?
1 = avanzare RC (${currentVersion} -> ${nextRc})
2 = chiudere versione (${currentVersion} -> ${stableVersion})
Enter a number (1-2): `;

    const answer = (await ask(question)).trim();

    if (answer === '1') {
      return nextRc;
    }

    if (answer === '2') {
      return stableVersion;
    }

    throw new Error('Opzione non valida. Deve essere 1 o 2.');
  }

  const releaseQuestion = `
Quale tipo di release vuoi?
1 = major
2 = minor
3 = patch
Enter a number (1-3): `;

  const releaseAnswer = (await ask(releaseQuestion)).trim();
  const releaseTypeMap = { 1: 'major', 2: 'minor', 3: 'patch' };
  const releaseType = releaseTypeMap[releaseAnswer];

  if (!releaseType) {
    throw new Error('Opzione non valida. Deve essere 1, 2 o 3.');
  }

  const rcQuestion = `
Vuoi procedere tramite RC (Release Candidate)? (y/n): `;
  const withRc = isYes(await ask(rcQuestion));

  return bumpByReleaseType(currentVersion, releaseType, withRc);
}

function checkNpmLogin() {
  console.log('\nChecking npm login...');

  try {
    const who = execSync('npm whoami', { encoding: 'utf8' }).trim();
    console.log(`Logged in as: ${who}`);
  } catch {
    console.error(
      '\n❌ Non risulti autenticato su npm (401 / whoami fallito).\n' +
        '   Esegui: npm login\n' +
        '   Se usi 2FA "auth and publish", al publish serve: npm publish --otp=<codice>\n' +
        '   oppure un Access Token con permesso di pubblicazione: https://www.npmjs.com/settings/~/tokens\n'
    );
    process.exit(1);
  }
}

function bumpVersion(newVersion) {
  console.log(`\nImposto la versione ${newVersion}...`);
  execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'inherit' });
}

function updateLibraryPackageJson(newVersion) {
  console.log('Updating library package.json...');

  const libPackageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));
  libPackageJson.version = newVersion;
  fs.writeFileSync(libPackageJsonPath, JSON.stringify(libPackageJson, null, 2) + '\n');
}

function publishToNpm(newVersion) {
  console.log('\nPublishing to npm...');

  const publishArgs = ['publish', '--access', 'public'];

  if (isRcVersion(newVersion)) {
    publishArgs.push('--tag', 'rc');
    console.log('Pubblicazione RC con dist-tag "rc" (latest resta invariato).');
  }

  execSync(`npm ${publishArgs.join(' ')}`, {
    cwd: path.join(__dirname, '../dist/angular-tailwind-components'),
    stdio: 'inherit'
  });
}

async function main() {
  const currentVersion = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8')).version;
  console.log(`Versione attuale: ${currentVersion}`);

  const newVersion = await determineNewVersion(currentVersion);
  console.log(`\nNuova versione: ${newVersion}`);

  checkNpmLogin();

  // ng-packagr writes dist/package.json from projects/.../package.json during
  // build; publishing stale dist would republish the old version on npm.
  bumpVersion(newVersion);
  updateLibraryPackageJson(newVersion);

  console.log('\nBuilding the library...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\nCommitting changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Release ${newVersion}"`, { stdio: 'inherit' });

  console.log('Pushing to repository...');
  execSync('git push', { stdio: 'inherit' });

  publishToNpm(newVersion);

  console.log(`\n✅ Release ${newVersion} completed successfully!`);
}

main()
  .catch(error => {
    console.error('\n❌ An error occurred during the release process:');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
