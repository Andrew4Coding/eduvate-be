import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';
import chalk from 'chalk';

const seedDirectory = join(__dirname, 'seed');
const compiledDirectory = join(__dirname, 'compiled_seed');
const arg = process.argv[2];
let startFromFile: string | null = null;
if (arg && arg.startsWith('from:')) {
    startFromFile = arg.substring(5);
}

async function compileTypeScript(
    inputFile: string,
    outputFile: string,
): Promise<void> {
    try {
        const result = await esbuild.build({
            entryPoints: [inputFile],
            bundle: true,
            platform: 'node',
            target: 'node14',
            outfile: outputFile,
        });
        if (result.errors.length > 0) {
            console.error(
                chalk.red(`❌ Error compiling ${inputFile}:`),
                result.errors,
            );
            throw new Error('Compilation failed');
        }
        console.log(chalk.green(`✔ Successfully compiled ${inputFile}`));
    } catch (error) {
        console.error(chalk.red(`❌ Error compiling ${inputFile}:`), error);
        throw error;
    }
}

async function main() {
    try {
        console.log(chalk.blue.bold('🔍 Scanning seed directory...'));
        const files = await readdir(seedDirectory);
        let startIndex = 0;
        if (startFromFile) {
            startIndex = files.indexOf(startFromFile);
            if (startIndex === -1) {
                console.error(
                    chalk.yellow(
                        `⚠ Start from file "${startFromFile}" not found in seed directory`,
                    ),
                );
                return;
            }
        }

        console.log(chalk.blue.bold('⚒️  Compiling TypeScript files...'));
        for (let i = startIndex; i < files.length; i++) {
            const file = files[i];
            if (extname(file) === '.ts') {
                const inputFile = join(seedDirectory, file);
                const outputFile = join(compiledDirectory, file.replace('.ts', '.js'));
                await compileTypeScript(inputFile, outputFile);
            }
        }

        console.log(chalk.blue.bold('🚀 Running compiled JavaScript files...'));
        for (let i = startIndex; i < files.length; i++) {
            const file = files[i];
            if (extname(file) === '.ts') {
                const compiledFile = join(
                    compiledDirectory,
                    file.replace('.ts', '.js'),
                );
                try {
                    execSync(`node ${compiledFile}`, { stdio: 'inherit' });
                    console.log(chalk.green(`✔ Successfully ran ${file}`));
                } catch (error) {
                    console.error(chalk.red(`❌ Error running ${file}:`), error);
                    process.exit(1);
                }
            }
        }

        console.log(chalk.green.bold('🎉 All files processed successfully!'));
    } catch (err) {
        console.error(chalk.red.bold('❌ Error:'), err);
        process.exit(1);
    }
}

main();
