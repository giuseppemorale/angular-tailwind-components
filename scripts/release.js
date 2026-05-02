const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rootPackageJsonPath = path.join(__dirname, '../package.json');
const libPackageJsonPath = path.join(__dirname, '../projects/angular-tailwind-components/package.json');
const rootPackageLockPath = path.join(__dirname, '../package-lock.json');

// Get current version
const currentVersion = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8')).version;

console.log(`Current version is: ${currentVersion}`);

const question = `
Which release type do you want?
1 = major
2 = minor
3 = patch
Enter a number (1-3): `;

rl.question(question, answer => {
  const option = answer.trim();
  const map = { 1: 'major', 2: 'minor', 3: 'patch' };
  const releaseType = map[option];

  if (!releaseType) {
    console.error('Invalid option. Must be 1, 2, or 3.');
    rl.close();
    process.exit(1);
  }

  try {
    console.log('\nBuilding the library...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log(`\nBumping ${releaseType} version...`);

    // 1. Use npm version to safely update package.json and package-lock.json in root
    execSync(`npm version ${releaseType} --no-git-tag-version`, { stdio: 'inherit' });

    // 2. Read the new version
    const newVersion = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8')).version;
    console.log(`New version is: ${newVersion}`);

    // 3. Update the library package.json
    console.log('Updating library package.json...');
    const libPackageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));
    libPackageJson.version = newVersion;
    fs.writeFileSync(libPackageJsonPath, JSON.stringify(libPackageJson, null, 2) + '\n');

    // 4. Git operations
    console.log('\nCommitting changes...');
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "Release ${newVersion}"`, { stdio: 'inherit' });

    console.log('Pushing to repository...');
    execSync('git push', { stdio: 'inherit' });

    console.log(`\n✅ Release ${newVersion} completed successfully!`);

    // 5. Publish (commented out)
    /*
    console.log('\nPublishing to npm...');
    execSync('npm publish', { cwd: path.join(__dirname, '../dist/angular-tailwind-components'), stdio: 'inherit' });
    */
    console.log('\n(Note: npm publish is currently commented out in the script.)');
  } catch (error) {
    console.error('\n❌ An error occurred during the release process:');
    console.error(error.message);
  }

  rl.close();
});
