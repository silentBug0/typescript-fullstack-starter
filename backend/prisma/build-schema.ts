// prisma/build-schema.ts
import * as fs from 'fs';
import * as path from 'path';

const base = fs.readFileSync(path.join(__dirname, 'generator.prisma'), 'utf-8');

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.endsWith('.prisma') &&
      file !== 'generator.prisma' &&
      file !== 'schema.prisma',
  );

const mergedModels = modelFiles
  .map((file) => fs.readFileSync(path.join(__dirname, file), 'utf-8'))
  .join('\n\n');

const finalSchema = `${base}\n\n${mergedModels}`;
fs.writeFileSync(path.join(__dirname, 'schema.prisma'), finalSchema);

console.log('✅ schema.prisma built successfully');
